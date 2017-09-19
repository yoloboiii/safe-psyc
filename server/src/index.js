// @flow

import { a } from './some-module.js';

const isDevelopment = process.env.NODE_ENV === 'development';
console.log(isDevelopment);

const express = require('express');
const fs = require('fs');
const https = require('https');



const key = fs.readFileSync(isDevelopment
  ? 'dev-keys/dev-privkey.pem'
  : 'SECRETS/key.pem');
const cert = fs.readFileSync(isDevelopment
  ? 'dev-keys/dev-cert.pem'
  : 'SECRETS/cert.pem');

const options = {
  key: key,
  cert: cert,
};


const app = express();
app.get('/', function (req, res) {
  res.send('Hello World!')
})


https.createServer(options, app).listen(8080, () => {
  console.log('LISTENING TO https://localhost:8080');
});

console.log('YATTAMAS');
console.log(a);
console.log(a());
