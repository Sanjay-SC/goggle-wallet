const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors()); // Enables CORS for all routes
const credentials = JSON.parse(fs.readFileSync('./dark-safeguard-343006-b3d5a62b39db.json'));

// API to generate and serve a Google Wallet Pass
app.get('/generate-pass', (req, res) => {
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const jwtPayload = {
    iss: credentials.client_email,
    aud: 'https://walletobjects.googleapis.com/walletobjects/v1',
    typ: 'loyalty',
    payload: {
      loyaltyObjects: [
        {
          id: `${credentials.project_id}.loyalty-pass-12345`,
          classId: `${credentials.project_id}.loyalty-class`,
          state: 'active',
          accountId: '1234567890',
          accountName: 'John Doe',
          barcode: {
            type: 'qrCode',
            value: 'QR123456789',
          },
        },
      ],
    },
  };

  const signedJwt = jwt.sign(jwtPayload, credentials.private_key, { header: jwtHeader });

  // Return the signed JWT
  res.json({ jwt: signedJwt });
});

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static('public'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
  next();
});
// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
