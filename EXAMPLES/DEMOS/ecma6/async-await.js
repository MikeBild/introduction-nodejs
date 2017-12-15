function doSome() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve({ msg: "Hello World!" }), 110);
  });
}

async function doSome2() {
  return { msg: "Hello World!" };
}

async function main() {
  try {
    const data = await doSome();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

main();
console.log("First");
