const { readFile } = require("fs");
const { promisify } = require("util");

module.exports = {
  loadFile
};

function loadFile(path) {
  return promisify(readFile)(path);
}
