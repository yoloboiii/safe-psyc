// @flow

import { startHttpsServer } from './https-server.js';

const app = require('express')();
// $FlowFixMe
app.get('/', function (req, res) {
    res.send('Hello World!')
})

startHttpsServer(app);
