const express = require("express");
const app = express();
const plantsRepo = require("./lib/plants-repo");

app.use(express.json());

app.get("/helloworld", (req, res) => {
  res.send({
    msg: "Hello World"
  });
});

app.get("/plants", (req, res) => {
  plantsRepo.all().then(data => res.send(data));
});

app.get("/plants/:name", (req, res) => {
  plantsRepo
    .byName(req.params.name)
    .then(data => res.send(data))
    .catch(error => res.status(404).send({ error: error.message }));
});

app.post("/plants/:name", (req, res) => {
  const plantName = req.params.name;
  const plant = req.body;
  plant.name = plantName;
  plantsRepo
    .insert(plant)
    .then(data => res.send(data))
    .catch(error => res.status(409).send({ error: error.message }));
});

app.listen(8080, () => console.log(`Listen on 8080`));
