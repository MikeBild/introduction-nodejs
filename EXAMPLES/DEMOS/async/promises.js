const {readFile} = require('fs');

function timeout(period = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Hello`);
    }, period);
  });
}

function openFile(fileName) {
  return new Promise((resolve, reject) => {
    readFile(fileName, (err, data) => {
      if(err) return reject(err);

      resolve(data);
    });
  });
}

openFile('promises.js')
.then(x => timeout(2000).then(() => x))
.then(x => x.toString())
.then(x => Promise.reject(new Error('An error ... ')))
.then(x => {
  throw new Error('An error ...');
})
.then(x => log(x))
.then(() => console.log('done'))
.catch(err => console.error(err.message))
.then(() => console.log('final'));

function log (obj) {
  console.log(JSON.stringify(obj));
  return Promise.resolve(obj);
}
