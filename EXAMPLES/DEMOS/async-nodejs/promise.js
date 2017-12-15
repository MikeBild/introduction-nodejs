const fetch = require("node-fetch");

myPromise()
  .then(doMore)
  .then(fetchAll)
  .catch(onError)
  .then(final);

function myPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        msg: "Hello World"
      });
      // reject(new Error("Bad!"));
    }, 2000);
  });
}

function doMore(data) {
  return Object.assign({}, data, { demo: 1 });
}

function onError(error) {
  console.error(error.message);
  return {
    msg: "Failure"
  };
}

function final(data) {
  console.log(data);
}

function fetchTwitterData(data) {
  return fetch("https://go-example.cloud.dropstack.run/", { timeout: 10000 })
    .then(response => response.text())
    .then(twitterData => Object.assign({}, data, { twitter: twitterData }))
    .catch(error => Object.assign({}, data, { failure: error.message }));
}

function fetchGoogleData(data) {
  return fetch("https://linklet-basic.cloud.dropstack.run", { timeout: 10000 })
    .then(response => response.json())
    .then(googleData => Object.assign({}, data, { google: googleData }))
    .catch(error => Object.assign({}, data, { failure: error.message }));
}

function fetchAll(data) {
  return Promise.all([fetchGoogleData(data), fetchTwitterData(data)]).then(
    dataAsArray => {
      return dataAsArray.reduce((state, item) => {
        return Object.assign(state, item);
      }, {});
    }
  );
}
