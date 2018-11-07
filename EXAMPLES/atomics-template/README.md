# WAFIOS Zero-Configuration MicroService Template

## How to install?

1. `yarn add atomics-template` or `npm install atomics-template`

**`package.json`**

```json
"scripts": {
  "run": "atomics run"
}
```

## How to start with an MicroService?

1. Create an `index.js` in your project root

2. Enter

**`index.js`**

```javascript
const { log } = require('atomics-template');

module.exports = async () => {
  log.info(`I'm here!`);
};
```

3. `yarn start` or `npm start`

## How to start with an ExpressJS-Based MicroService?

1. Create an `index.js` in your project root

2. Enter

**`index.js`**

```javascript
const express = require('express');
module.exports = async () => {
  const routes = express.Router();

  routes.get('/', (req, res) => {
    res.send('Hello from WAFIOS!');
  });

  return {
    routes,
  };
};
```

3. `yarn start` or `npm start`
