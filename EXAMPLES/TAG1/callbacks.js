module.exports = {
  doSomething,
};

// doSomething('Bar', (error, result) => {
//   if (error) return console.error(error);
//   const barResult = result;

//   doSomething('Hello', (error, result) => {
//     console.log(barResult, result);
//   });
// });

// console.log('Done');

function doSomething(value, cb) {
  setTimeout(() => {
    if (value === 'Foo') return cb(new Error('An error!'));

    cb(null, { value });
  }, 1000);
}
