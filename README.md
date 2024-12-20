# Case Study - Employee Management Applicaton

Demo: [https://ing.kagansari.com](https://ing.kagansari.com)

> For demonstration purposes, the rollup build & code coverage report artifacts are hosted in AWS EC2 (behind an nginx server in docker)

Code Coverage Report: [https://ing.kagansari.com/coverage/lcov-report](https://ing.kagansari.com/coverage/lcov-report)

> The coverage report output of Web Test Runner

## Folder Structure

- [`www`](www) Main project directory cloned from [lit-element-starter-js](https://github.com/lit/lit-element-starter-js)
  - [`assets`](www/assets) Public files, also bound by nginx
  - [`components`](www/components) Contains lit elements that are used in pages
  - [`coverage`](www/coverage) Web Test Runner report generated by `npm test`
  - [`data`](www/data) Initial mock data seeded to `@reduxjs/toolkit`
  - [`generated`](www/generated) Translation files generated by `@lit/localize`
  - [`pages`](www/pages) Lit elements to render `@vaadin/router` routes
  - [`xliff`](www/xliff) Translation files
  - [`app.js`](www/app.js) Defines the routes
  - [`locale.js`](www/app.js) Defines getter & setter for `@lit/localize`
  - [`store.js`](www/app.js) Store, state, slices, actions and reducers defined by `@reduxjs/toolkit`
  - [`style.js`](www/app.js) Global styles used in multiple elements
  - ..other files and folders provided by lit starter kit
- [`dev`](dev) Contains nginx configuration and certificates of nginx server hosting demo
- [`docker-compose.yml`](docker-compose.yml) Contains the nginx service for demo website
- [`Makefile`](Makefile) Some useful scripts to debug docker compose services

## Development

```bash

cd www
npm install
npm run serve

```

Go to [http://localhost:8080](http://localhost:8080)

## Production

```bash

cd www
# build bundled scripts and index.html
npm run build

cd ..
# Run nginx container
docker compose up -d

```
