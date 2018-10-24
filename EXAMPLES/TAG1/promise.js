function a() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('foo');
    }, 1000);

    reject(new Error('It is an error from a()'));
  });
}

function b(a) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(a + 'bar');
    }, 1000);
  });
}

a()
  .then(a => b(a))
  .then(b => console.log('done: ', b))
  .catch(error => {
    console.error('common error: ', error.message);
  });
