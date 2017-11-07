const express = require("express");
const app = express();
const plantsRepo = require("./lib/plants-repo");

app.get("/helloworld", (req, res) => {
  res.send({
    msg: "Hello World"
  });
});

app.get("/plants", (req, res) => {
  plantsRepo.all().then(data => res.send(data));
});

app.post("/plants/:name", (req, res) => {
  const plantName = req.params.name;
  plantsRepo.insert(plantName).then(data => res.send(data));
});

app.listen(8080, () => console.log(`Listen on 8080`));
