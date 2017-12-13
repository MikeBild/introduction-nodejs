const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/users", (req, res) => {
  res.send("Demo");
});

app.get("/users/:id", (req, res) => {
  res.send("Demo " + req.params.id + " " + req.query.foo);
});

app.post("/", (req, res) => {
  res.send("Foo Bar");
});

app.listen(8080, null, () => console.log("Listen on 8080"));
