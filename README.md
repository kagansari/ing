# Case Study - Employee Management Applicaton

## Getting Started

```bash

cd www
npm install
npm run serve

```

## Production

```bash

cd www
# Generate test coverage reports
npm run test
# build bundled scripts and index.html
npm run build

cd ..
# Copy certificates for SSL
sudo cp /etc/letsencrypt/live/ing.kagansari.com/fullchain.pem dev/nginx/ing.kagansari.com/fullchain.pem
sudo cp /etc/letsencrypt/live/ing.kagansari.com/privkey.pem dev/nginx/ing.kagansari.com/privkey.pem
# Run nginx container
docker compose up -d

```