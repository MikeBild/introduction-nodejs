const {
  doSomething: doSomethingPromise,
  doMore: doMorePromise,
} = require('./promises');

//self executed function
(() => {
  //...
})();

main().then(data => {
  console.log('Hello', data);
  console.log('done async/await');
});

async function main() {
  try {
    const result = await doSomethingPromise();
    const result2 = await doMorePromise(result);
    return result2;
  } catch (e) {
    return `default: ${e.message}`;
  }
}

// async function doSomething(value) {
//   return await doSomethingPromise(value);
// }

// async function doMore(value) {
//   return await doMorePromise(value);
// }
