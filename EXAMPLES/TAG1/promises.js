const { doSomething: doSomethingCallback } = require('./callbacks');

module.exports = {
  doSomething,
};

function doSomething(value) {
  return new Promise((resolve, reject) => {
    doSomethingCallback(value, (error, data) => {
      if (error) return reject(error);

      resolve(data);
    });
  });
}

const p1 = doSomething('Bar')
  .catch(error => ({ value: 'demo' }))
  .then(data => doSomething(`Hello  ${data.value}`))
  .then(data => console.log(data))
  .catch(error => console.error(error));

console.log(p1);
