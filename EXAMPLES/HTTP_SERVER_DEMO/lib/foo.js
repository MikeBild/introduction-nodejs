const fs = require("fs");
const util = require("util");

module.exports.sumSync = values =>
  values.reduce((state, value) => (state += value), 0);

module.exports.sum = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err);

      const dataAsObj = JSON.parse(data.toString());
      const result = module.exports.sumSync(dataAsObj);

      resolve(result);
    });
  });
};

module.exports.sumPromisified = filePath =>
  util.promisify(fs.readFile)(filePath).then(data => {
    const dataAsObj = JSON.parse(data.toString());
    return module.exports.sumSync(dataAsObj);
  });
