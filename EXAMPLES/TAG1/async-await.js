const { doSomething } = require('./promises');
// Node >= 10
// const { readFile } = require('fs').promises;

doIt();

async function doIt() {
  try {
    const { value } = await doSomething('bar');
    const result2 = await doSomething(`foo ${value}`);
    console.log(result2);
  } catch (error) {
    console.log(error);
  }
}
