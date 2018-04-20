const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("Hallo Welt!"));
app.get("/error", (req, res) => {
  throw new Error("Ein Fehler!");
});
app.get("/real-time", (req, res) => {
  let count = 0;

  setInterval(() => {
    res.write(`count: ${count++}\n`);
  }, 1000);
});

app.get("*", (req, res) => {
  res.status(404).send({ message: "not found" });
});

app.use((err, req, res, next) => {
  console.log(`Fataler Fehler: ${err.message}`);
  res.status(500).send({ message: err.message });
});

const server = app.listen(8080, () =>
  console.log(`Listen on ${server.address().port}`)
);
