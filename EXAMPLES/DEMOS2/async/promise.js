const fs = require('fs');

function do1() {
  return Promise.resolve({foo: 'bar'});
}

function do2(data) {
  return Promise.resolve(Object.assign({}, data, {bar: 'foo'}));
}

function do3(a, b) {
  return Promise.resolve({all: a + b});
}

function do4(data) {
  return new Promise((resolve, reject) => {
    fs.readFile('ii.txt', (err, data2) => {
      if(err) {
        reject(err);
        return;
      }

      resolve(Object.assign({}, data, {fileContent: data2.toString()}));
    });
  });
}

function do5(data){
  console.log('hello')
  return Promise.resolve(data || {});
}

do1()
.then(do2)
.then(data => do3(data.foo, data.bar))
.then(data => do4(data).catch(err => ({trotzdem: 'ldldld'})))
.then(do5)
.then(console.log)
.catch(console.error)

Promise.all([
  do1(),
  do2().catch(err => ({})),
  do5(),
])
.then(data => console.log(JSON.stringify(data, null, 4)))
.catch(err => console.error(err));

Promise.race()
console.log({irgendwas: 1})