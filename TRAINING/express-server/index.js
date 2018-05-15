const express = require("express");
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
  loadFile("./filedata.json")
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
