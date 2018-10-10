process.on('uncaughtException', error => {
  console.log('uncaughtException - unhandled exception is detected');
  console.error(error);
});

process.on('unhandledRejection', (reason, p) => {
  console.log('unhandledRejection - unhandled rejection is detected');
});

const myPromise = Promise.reject(new Error('An asnyc promise error'));

setTimeout(() => {
  throw new Error('An async error');
}, 500);

try {
  throw new Error('A sync error');
} catch (error) {
  console.error('Handled exception');
}
