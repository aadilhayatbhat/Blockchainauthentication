import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_AD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_AD_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_AZURE_AD_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
};

// Create an instance of PublicClientApplication
const msalInstance = new PublicClientApplication(msalConfig);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
