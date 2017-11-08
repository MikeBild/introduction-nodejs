const express = require("express");
const app = express();
const util = require("util");
const morgan = require("morgan");
const plantsRepo = require("./lib/plants-repo");

app.use(morgan("combined"));
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

module.exports = config => {
  let server = null;
  return {
    start: () =>
      start(config)
        .then(srv => {
          server = srv;
          return true;
        })
        .catch(error => false),
    stop: () => stop(server),
    server: () => server
  };
};

function start({ port } = {}) {
  return new Promise((resolve, reject) => {
    const srv = app.listen(
      port,
      () => (srv ? resolve(srv) : reject(new Error("can not start server")))
    );
  });
}

function stop(server) {
  return new Promise(resolve => {
    server.close(() => resolve());
  });
}
