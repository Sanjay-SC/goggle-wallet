const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors()); // Enables CORS for all routes
const credentials = JSON.parse(fs.readFileSync('./dark-safeguard-343006-b3d5a62b39db.json', 'utf8'));

app.get('/generate-save-url', (req, res) => {
  const genericObject = {
    id: `${credentials.project_id}.generic-object-id`,
    classId: `${credentials.project_id}.generic-class-id`,
    state: 'active',
    cardTitle: { defaultValue: { language: 'en', value: 'Example Card Title' } },
  };

  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: ['http://localhost:3000'], // Add your frontend's origin
    typ: 'savetowallet',
    payload: {
      genericObjects: [genericObject],
    },
  };

  const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  res.send({ saveUrl });
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
  next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
