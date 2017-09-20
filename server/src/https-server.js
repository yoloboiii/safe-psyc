// @flow

import fs from 'fs';
import https from 'https';

const isDevelopment = process.env.NODE_ENV === 'development';

export function startHttpsServer(app: *, port: number=8080) {
    const secrets = {
        key:  'SECRETS/key.pem',
        cert: 'SECRETS/cert.pem',
    };

    if (isDevelopment) {
        console.log();
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!! WARNING !!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('!!!!!!! STARTING THE HTTPS SERVER WITH INSECURE CERTS !!!!!!!');
        console.log();

        secrets.key  = 'dev-keys/dev-privkey.pem';
        secrets.cert = 'dev-keys/dev-cert.pem';
    }

    const options = {
        key: fs.readFileSync(secrets.key),
        cert: fs.readFileSync(secrets.cert),
    };
    https.createServer(options, app).listen(port, () => {
        console.log('LISTENING TO https://localhost:' + port);
    });
}

