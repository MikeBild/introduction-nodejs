const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve("HEllo World");
    reject(new Error("Bad!"));
  }, 2000);
});

myPromise
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error.message);
  })
  .then(data => {
    console.log("Yeah!");
  });
