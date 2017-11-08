const express = require("express");
const app = express();
const util = require("util");
const morgan = require("morgan");

const plants = require("./routes/plants");
const genotypes = require("./routes/genotypes");
const responseTime = require("./lib/reponsetime-middleware");
app.use(morgan("combined"));
app.use(express.json());
// custom middleware
app.use(responseTime());
app.use("/plants", plants);
app.use("/genotypes", genotypes);

app.use((error, req, res, next) => {
  res.status(500).send({ msg: error.message });
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
