function doSomething(cb) {
  console.log('Start calc');
  setTimeout(() => {
    console.log('calc');
    cb && cb(null, 'done');
  }, 1000);
}

doSomething((err, data) => {
  console.log('ok', err, data);
});

console.log('Foo');

// Sync
function a() {
  return 'foo1';
}

function b(a) {
  return a + 'bar2';
}
const a1 = a();
const b1 = b(a1);
console.log(b1);

//ASync waterfall

function c(cb) {
  setTimeout(() => {
    cb && cb(null, 'foo3');
  }, 1000);
}

function d(c, cb) {
  setTimeout(() => {
    cb && cb(null, c + 'bar4');
  }, 1000);
}

console.log(d(c()));

c((error, data) => {
  d(data, (error, data) => {
    console.log(data);
  });
});
