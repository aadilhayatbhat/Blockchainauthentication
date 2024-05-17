import React from 'react';
import AuthForm from './AuthForm';

const HomePage = () => {
  const pageStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 50px',
    margin: '-8px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden'
  };

  const welcomeStyle = {
    color: 'white',
    fontSize: '3rem',
    fontWeight: 'bold',
    zIndex: 2, // Ensure the text is above the video
    position: 'relative',
    textAlign: 'center',
    marginRight: 'auto'
  };

  const videoStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0 // Ensure the video is below the text and form
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1 // Ensure the overlay is above the video but below the text and form
  };

  const contentStyle = {
    zIndex: 2, // Ensure the content is above the video and overlay
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  };

  return (
    <div style={pageStyle}>
      <video autoPlay muted loop style={videoStyle}>
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <div style={welcomeStyle}>
         Experience  Blockchain Authentication
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default HomePage;
