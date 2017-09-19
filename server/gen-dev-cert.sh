openssl genrsa -out SECRETS/key.pem 4096
openssl req -new -key SECRETS/key.pem -out client.csr
openssl x509 -req -in client.csr -signkey SECRETS/key.pem -out SECRETS/cert.pem
rm client.csr
