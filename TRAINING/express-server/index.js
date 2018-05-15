const express = require("express");
const { readFile } = require("fs");
// const { promisify } = require("util");

const { loadFile } = require("./lib/file-repository");

const app = express();

app.use((req, res, next) => {
  console.log("Check Auth!");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/hello-world", (req, res) => {
  res.send({
    message: "hello world",
    responseAt: new Date()
  });
});

app.get("/filedata", (req, res, next) => {
  const p1 = loadFile("./filedata.json");

  p1
    .then(data => {
      res.setHeader("Content-Type", "application/json");
      res.send(data.toString());
    })
    .catch(error => {
      console.error(`Fehler beim lesen der Datei. ${error.message}`);
      // Call express errror handler
      // next(error);
      res
        .status(500)
        .send({ message: `Fehler beim lesen der Datei. ${error.message}` });
    });
});

const server = app.listen(8080, () =>
  console.log(`Express listen on ${server.address().port}`)
);

console.log("Hello ExpressJS");

// 1. refactoring (Zwischenergebniss)
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    readFile(path, (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(data.toString());
    });
  });
}

function promisify(func) {
  return arg1 => {
    return new Promise((resolve, reject) => {
      func(arg1, (error, data) => {
        if (error) return reject(error);
        resolve(data);
      });
    });
  };
}
