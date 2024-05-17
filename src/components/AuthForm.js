import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const containerStyle = {
    display: 'flex',
    height: '100vh',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundImage: 'url("https://colorlib.com/etc/lf/Login_v18/images/bg-1.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '40px 55px 45px 55px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const formContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    width: '100%',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
    padding: '15px',
  };

  const toggleButtonStyle = {
    marginTop: '20px',
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={formContentStyle}>
          {isLogin ? <LoginForm inputStyle={inputStyle} buttonStyle={buttonStyle} /> : <RegisterForm inputStyle={inputStyle} buttonStyle={buttonStyle} />}
          <button
            onClick={toggleForm}
            style={toggleButtonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#007BFF')}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
