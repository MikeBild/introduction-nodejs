const { readFile } = require("fs");
const { promisify } = require("util");

module.exports = {
  loadFile,
  loadJSONFile,
  loadJSONFileAndMergeWith
};

function loadFile(path) {
  return promisify(readFile)(path);
}

function loadJSONFile(path) {
  return loadFile(path).then(data => JSON.parse(data.toString()));
}

function loadJSONFileAndMergeWith(path, data) {
  return loadJSONFile(path).then(data2 => Object.assign(data, data2));
}
