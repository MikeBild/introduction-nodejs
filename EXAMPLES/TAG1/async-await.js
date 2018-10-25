function a() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('foo');
    }, 1000);
  });
}

function b(a) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(a + 'bar');
    }, 1000);
  });
}

async function main() {
  try {
    const a1 = await a();
    const b1 = await b(a1);
    console.log(b1);
  } catch (e) {
    console.error('Mist!');
  }
}

main().then(() => console.log('done'));
