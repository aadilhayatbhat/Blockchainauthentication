// import React, { useState } from 'react';
// import Web3 from 'web3';
// import axios from 'axios';
// import AzureAuthContract from '../contracts/AzureAuth.json';

// const LoginForm = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     // Verify on Ethereum Blockchain
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum);
//       await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const accounts = await web3.eth.getAccounts();
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = AzureAuthContract.networks[networkId];
//       const contract = new web3.eth.Contract(AzureAuthContract.abi, deployedNetwork && deployedNetwork.address);

//       try {
//         const passwordHash = web3.utils.soliditySha3(password);
//         console.log('Password hash:', passwordHash);
//         console.log('Username:', username);
//         console.log('Account:', accounts[0]);
//         console.log('Contract address:', deployedNetwork.address);

//         const isVerified = await contract.methods.verifyUser(username, password).call({ from: accounts[0] });
//         console.log('Blockchain verification result:', isVerified);

//         if (!isVerified) {
//           setMessage('Blockchain authentication failed');
//           return;
//         }
//       } catch (error) {
//         console.error('Error verifying on blockchain:', error);
//         setMessage('Error verifying on blockchain');
//         return;
//       }
//     } else {
//       setMessage('Please install MetaMask');
//       return;
//     }

//     // Verify with Azure AD
//     try {
//       console.log('Verifying with Azure AD:', username);
//       const azureResponse = await axios.post('http://localhost:5000/api/verifyAzure', {
//         username,
//         password
//       });

//       if (azureResponse.data.success) {
//         console.log('Azure AD verification successful');
//         setMessage('Authentication successful');
//       } else {
//         console.log('Azure AD verification failed');
//         setMessage('Azure AD authentication failed');
//       }
//     } catch (error) {
//       console.error('Error verifying with Azure AD:', error);
//       setMessage('Error verifying with Azure AD');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import Web3 from 'web3';
import AzureAuthContract from '../contracts/AzureAuth.json'; 

const LoginForm = () => {
  const { instance, accounts } = useMsal();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      setIsAuthenticated(true);
      setMessage('User Signed in');
    }
  }, [accounts]);

  const handleLogin = async (event) => {
    event.preventDefault();

    // Verify on Ethereum Blockchain
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AzureAuthContract.networks[networkId];
      const contract = new web3.eth.Contract(AzureAuthContract.abi, deployedNetwork && deployedNetwork.address);

      try {
        const passwordHash = web3.utils.soliditySha3(password);
        console.log('Password hash:', passwordHash);
        console.log('Username:', username);
        console.log('Account:', accounts[0]);
        console.log('Contract address:', deployedNetwork.address);

        const isVerified = await contract.methods.verifyUser(username, password).call({ from: accounts[0] });
        console.log('Blockchain verification result:', isVerified);

        if (!isVerified) {
          setMessage('Blockchain authentication failed');
          return;
        }
      } catch (error) {
        console.error('Error verifying on blockchain:', error);
        setMessage('Error verifying on blockchain');
        return;
      }
    } else {
      setMessage('Please install MetaMask');
      return;
    }

    // Verify with Azure AD
    try {
      const loginRequest = {
        scopes: ["openid", "profile", "User.Read"],
        loginHint: `${username}@asifbhat1842outlook.onmicrosoft.com`,
        redirectUri: 'http://localhost:3000'
      };

      const loginResponse = await instance.loginPopup(loginRequest);

      if (loginResponse.accessToken) {
        console.log('Azure AD verification successful');
        setMessage('User Signed in');
        setIsAuthenticated(true);
        window.open('https://myapps.microsoft.com/', '_blank');
      } else {
        console.log('Azure AD verification failed');
        setMessage('Azure AD authentication failed');
      }
    } catch (error) {
      console.error('Error verifying with Azure AD:', error);
      setMessage(`Error verifying with Azure AD: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: 'http://localhost:3000'
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <h2>{isAuthenticated ? 'Welcome' : 'Login'}</h2>
      {!isAuthenticated ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;

// import React, { useState, useEffect } from 'react';
// import { useMsal } from '@azure/msal-react';
// import Web3 from 'web3';
// import AzureAuthContract from '../contracts/AzureAuth.json';

// const LoginForm = () => {
//   const { instance, accounts } = useMsal();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     if (accounts.length > 0) {
//       setIsAuthenticated(true);
//       setMessage('User Signed in');
//     }
//   }, [accounts]);

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     // Verify on Ethereum Blockchain
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum);
//       await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const accounts = await web3.eth.getAccounts();
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = AzureAuthContract.networks[networkId];
//       const contract = new web3.eth.Contract(AzureAuthContract.abi, deployedNetwork && deployedNetwork.address);

//       try {
//         const isVerified = await contract.methods.verifyUser(username, password).call({ from: accounts[0] });
//         console.log('Blockchain verification result:', isVerified);

//         if (!isVerified) {
//           setMessage('Blockchain authentication failed');
//           return;
//         }
//       } catch (error) {
//         console.error('Error verifying on blockchain:', error);
//         setMessage('Error verifying on blockchain');
//         return;
//       }
//     } else {
//       setMessage('Please install MetaMask');
//       return;
//     }

//     // Verify with Azure AD
//     try {
//       const loginRequest = {
//         scopes: ["openid", "profile", "User.Read"],
//         loginHint: `${username}@asifbhat1842outlook.onmicrosoft.com`,
//         redirectUri: 'http://localhost:3000'
//       };

//       const loginResponse = await instance.loginPopup(loginRequest);

//       if (loginResponse.accessToken) {
//         console.log('Azure AD verification successful');
//         setMessage('User Signed in');
//         setIsAuthenticated(true);
//         window.open('https://myapps.microsoft.com/', '_blank');
//       } else {
//         console.log('Azure AD verification failed');
//         setMessage('Azure AD authentication failed');
//       }
//     } catch (error) {
//       console.error('Error verifying with Azure AD:', error);
//       setMessage(`Error verifying with Azure AD: ${error.message}`);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await instance.logoutRedirect({
//         postLogoutRedirectUri: 'http://localhost:3000'
//       });
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>{isAuthenticated ? 'Welcome' : 'Login'}</h2>
//       {!isAuthenticated ? (
//         <form onSubmit={handleLogin}>
//           <div>
//             <label>Username:</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label>Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit">Login</button>
//         </form>
//       ) : (
//         <button onClick={handleLogout}>Logout</button>
//       )}
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default LoginForm;