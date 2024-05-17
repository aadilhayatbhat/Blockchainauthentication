const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const usersFile = 'users.txt';

app.post('/api/getToken', async (req, res) => {
  try {
    const { tenantId, clientId, clientSecret } = process.env;
    const response = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://graph.microsoft.com/.default'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    res.json({ accessToken: response.data.access_token });
  } catch (error) {
    console.error('Error obtaining access token:', error);
    res.status(500).send('Error obtaining access token');
  }
});

app.post('/api/registerUser', async (req, res) => {
  const { username, email, password } = req.body;

  console.log(`Received user info: ${username}, ${email}, ${password}`);

  const userInfo = `${username},${email},${password}\n`;

  console.log('Preparing to write to file:', usersFile);

  fs.appendFile(usersFile, userInfo, (err) => {
    if (err) {
      console.error('Error saving user information:', err);
      res.status(500).send('Error saving user information');
      return;
    }

    console.log('User information saved to file:', usersFile);
    res.send('User information saved');
  });
});

app.post('/api/verifyAzure', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`Verifying with Azure AD: ${username}`);
    const response = await axios.post(
      `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: 'password',
        client_id: process.env.REACT_APP_AZURE_AD_CLIENT_ID,
        client_secret: process.env.REACT_APP_AZURE_AD_CLIENT_SECRET,
        scope: process.env.REACT_APP_AZURE_AD_SCOPE,
        username: `${username}@asifbhat1842outlook.onmicrosoft.com`,
        password: password
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data.access_token) {
      console.log('Azure AD verification successful');
      res.json({ success: true });
    } else {
      console.log('Azure AD verification failed');
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error verifying with Azure AD:', error.response.data);
    res.status(500).send('Error verifying with Azure AD');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
