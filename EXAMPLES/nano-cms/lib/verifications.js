module.exports.isPasswordValid = isPasswordValid;

module.exports.isPasswordValidPromise = password => {
  return new Promise((resolve, reject) => {
    isPasswordValid(password, (error, data) => {
      if (error) return reject(error);

      resolve(data);
    });
  });
};

function isPasswordValid(password, callbackFn) {
  setTimeout(() => {
    if (password === '123') return callbackFn(null, true);

    callbackFn(new Error('Password invalid'));
  }, 0);
}
