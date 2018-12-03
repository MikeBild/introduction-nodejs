const { doSomething: doSomethingCallback } = require('./callbacks');

const { readFile: readFileCallback } = require('fs');
const { promisify } = require('util');
const readFile = promisify(readFileCallback);

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

// const p1 = doSomething('Bar')
//   .catch(error => ({ value: 'demo' }))
//   .then(data => doSomething(`Hello  ${data.value}`))
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

// console.log(p1);

// Parallel
// const simpleFileList = Promise.all([readFile('a.json'), readFile('b.json')])
//   .then(dataList => {
//     console.log(dataList.map(data => data.toString()));
//   })
//   .catch(error => console.error(error));

const fileList = ['a.json', 'b.json'];
const readFileList = fileList.map(fileName =>
  readFileWithDefaultValue(fileName)
);

// Promise.all(readFileList)
//   .then(dataList => {
//     console.log(dataList.map(data => data.toString()));
//   })
//   .catch(error => console.error(error));

function readFileWithDefaultValue(fileName, defaultValue = '{}') {
  return readFile(fileName).catch(error => defaultValue);
}
