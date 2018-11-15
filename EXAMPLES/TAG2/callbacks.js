// Sync

const a = ASync('foo');
const b = BSync(a);

console.log(b);

console.log('Sync');

function ASync(value) {
  return value + value;
}

function BSync(value) {
  return value + 'bar';
}

// Callbacks

A('foo', (error, a) => {
  if (error) {
    return;
  }

  B(a, (error, b) => {
    console.log(b);
  });
});

console.log('ASync');

function A(value, cb) {
  const result = value + value;
  setTimeout(() => {
    cb(null, result);
  }, 1000);
}

function B(value, cb) {
  const result = value + 'bar';
  setTimeout(() => {
    cb(null, result);
  }, 1000);
}
