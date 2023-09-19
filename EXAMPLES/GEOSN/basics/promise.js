function delay(timeout) {
  return new Promise((resolve, reject) => {
    if (timeout >= 10000) {
      reject();
      return;
    }

    setTimeout(() => {
      console.log(`. ${timeout}`);
      resolve(timeout);
    }, timeout);
  });
}

// delay(2000)
//   .then(() => delay(10000))
//   .catch(() => console.error("Meine erste Fehlerbehandlung"))
//   .then(() => delay(4000))
//   .catch(() => console.error("Meine zweite Fehlerbehandlung"));

Promise.all([delay(2000), delay(4000), delay(1000)])
.then((data) => {
  console.log({ data });    
});
