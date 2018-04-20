const fs = require("fs");
const fetch = require("node-fetch");
const util = require("util");

tryFileExists("./out.jsson", "./out.json")
  .then(path => ladeDaten(path))
  .catch(error => programBeendenAusgeben(error))
  .then(data => verarbeiten(data))
  .catch(() => "default")
  .then(data => schreibeDaten("./foo.json", data))
  .then(data => okAusgeben(data))
  .catch(error => fehlerAusgeben(error));

ladeAlleDaten(["./out3.json", "./out2.json"])
  .then(data => okAusgeben(data))
  .catch(error => fehlerAusgeben(error));

ladeKalenderDaten()
  .then(data => console.log(data))
  .catch(error => fehlerAusgeben(error));

function ladeKalenderDaten() {
  return fetch("http://calapi.inadiutorium.cz/api/v0/en/calendars").then(
    response => response.json()
  );
}

function ladeAlleDaten(paths = []) {
  const promiseArray = paths.map(path => ladeDatenOderDefault(path, "{}"));
  return Promise.all(promiseArray);
}

function ladeDatenOderDefault(path, defaultValue) {
  return ladeDaten(path).catch(error => defaultValue);
}

function tryFileExists(path, fallbackPath) {
  if (!path) return Promise.reject(new Error("Path is empty"));
  if (!fallbackPath) return Promise.reject(new Error("Fallback path is empty"));

  return new Promise((resolve, reject) => {
    fs.stat(path, error => {
      if (error && error.code === "ENOENT") return resolve(fallbackPath);
      if (error) return reject(error);

      resolve(path);
    });
  });
}

function ladeDaten(path) {
  if (!path) return Promise.reject(new Error("Path is empty"));

  const readFileFunctionAsPromise = util.promisify(fs.readFile);
  return readFileFunctionAsPromise(path).then(data => data.toString());
}

function programBeendenAusgeben(error) {
  console.error(`Beendet - ${error && error.message}`);
  process.exit(1);
}

function verarbeiten(data) {
  if (!data) throw new Error("Keine Daten zu verarbeiten!");

  return data.toUpperCase();
}

function schreibeDaten(path, data) {
  if (!path) return Promise.reject(new Error("Path is empty"));
  if (!data) return Promise.reject(new Error("Data is empty"));

  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (error, data) => {
      if (error) return reject(error);

      resolve(data);
    });
  });
}

function okAusgeben(data) {
  console.log(JSON.stringify(data, null, 2));
  console.log("Fertig");
}

function fehlerAusgeben(error) {
  console.error(`Fehler: ${error && error.message}`);
  process.exit(1);
}
