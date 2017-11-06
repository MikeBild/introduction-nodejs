const fs = require("fs");

module.exports.sumSync = values =>
  values.reduce((state, value) => (state += value), 0);

module.exports.sum = (filePath, callback) => {
  fs.readFile(filePath, (err, data) => {
    if (err) return callback(err);

    const dataAsObj = JSON.parse(data.toString());
    const result = module.exports.sumSync(dataAsObj);

    callback(null, result);
  });
};
