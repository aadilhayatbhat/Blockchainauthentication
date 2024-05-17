import React, { useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import AzureAuthContract from '../contracts/AzureAuth.json';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const getAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/getToken');
      return response.data.accessToken;
    } catch (error) {
      console.error('Error obtaining access token:', error);
      setMessage('Error obtaining access token');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return;
    }

    const tenantDomain = 'asifbhat1842outlook.onmicrosoft.com';

    try {
      const azureResponse = await axios.post(
        `https://graph.microsoft.com/v1.0/users`,
        {
          accountEnabled: true,
          displayName: username,
          mailNickname: username,
          userPrincipalName: `${username}@${tenantDomain}`,
          passwordProfile: {
            forceChangePasswordNextSignIn: false,
            password: password
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (azureResponse.status === 201) {
        console.log('User created in Azure AD:', azureResponse.data);

        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = AzureAuthContract.networks[networkId];
          const contract = new web3.eth.Contract(AzureAuthContract.abi, deployedNetwork && deployedNetwork.address);

          try {
            // Additional logging for debug
            console.log('Registering on blockchain with:', { username, email, password });

            const gasEstimate = await contract.methods.registerUser(username, email, password).estimateGas({ from: accounts[0] });
            console.log('Gas estimate:', gasEstimate);

            await contract.methods.registerUser(username, email, password).send({
              from: accounts[0],
              gas: Number(gasEstimate) + 100000,
              gasPrice: web3.utils.toWei('20', 'gwei')
            });

            console.log('User registered on blockchain.');

            // Save user information to the server
            try {
              const saveResponse = await axios.post('http://localhost:5000/api/registerUser', { username, email, password });
              console.log('User information saved on server:', saveResponse.data);
              setMessage('Registration successful');
            } catch (error) {
              console.error('Error saving user information:', error);
              setMessage('Error saving user information');
            }

          } catch (error) {
            console.error('Error registering on blockchain:', error);
            setMessage(`Error registering on blockchain: ${error.message}`);
          }
        } else {
          setMessage('Please install MetaMask');
        }
      } else {
        console.log('Unexpected response status from Azure AD:', azureResponse.status);
        setMessage('Error registering with Azure AD');
      }
    } catch (error) {
      console.error('Error registering with Azure AD:', error);
      setMessage(`Error registering with Azure AD: ${error.response?.data?.error?.message || error.message}`);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
          <label>Email - id:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterForm;
