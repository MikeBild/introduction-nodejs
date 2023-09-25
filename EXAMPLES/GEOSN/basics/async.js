const successPromise = Promise.resolve({ msg: "Ok" });
const failurePromise = Promise.reject({ msg: "Fail" });

successPromise
  .then((payload) => {
    console.log({ payload });
  })
  .then(() => failurePromise)
  .catch((error) => {
    console.error(error);
  })
  .then(() => {
    console.log("continue");
  })
  .finally(() => {
    console.log("done");
  });

const parallelPromise = Promise.all([
  successPromise,
  failurePromise.catch(() => ({
    msg: "Default",
  })),
  successPromise,
  successPromise,
]);

parallelPromise
  .then((payload) => {
    console.log({ payload });
  })
  .catch((error) => {
    console.error(error);
  });

Promise.race([successPromise, successPromise, successPromise])
  .then((payload) => {
    console.log({ payload });
  })
  .catch((error) => {
    console.error(error);
  });
