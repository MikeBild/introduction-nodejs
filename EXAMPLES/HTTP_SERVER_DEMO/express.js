const express = require("express");
const app = express();
const childProcess = require("child_process");
const fs = require("fs");
const through2 = require("through2");
const es = require("event-stream");
const JSONStream = require("JSONStream");
const uuid = require("node-uuid");
const path = require("path");
const util = require("util");
const morgan = require("morgan");

const plants = require("./routes/plants");
const genotypes = require("./routes/genotypes");
const responseTime = require("./lib/reponsetime-middleware");
app.use(morgan("combined"));
app.use(express.json());
// custom middleware
app.use(responseTime());

app.use(express.static("./statics"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/index", (req, res) => {
  res.render("index", {
    title: "Title",
    genSomeUUID: () => uuid.v1(),
    plants: [{ id: "ddmee" }, { id: "ddmee2" }]
  });
});

app.use("/plants", plants);
app.use("/genotypes", genotypes);
app.get("/file", (req, res) => {
  fs.createReadStream("./statics/foo.json").pipe(res);
});

app.get("/scripts/demo", (req, res, next) => {
  const demo = childProcess.spawn(`./scripts/demo.sh`);

  demo.stdout
    .pipe(JSONStream.parse())
    .pipe(
      es.mapSync(function(data) {
        return JSON.stringify({
          ...data,
          fsss: "sdsk",
          timeStamp: new Date()
        });
      })
    )
    // .pipe(
    //   through2(function(chunk, enc, callback) {
    //     const toJSON = JSON.stringify({ foo: chunk.toString() });
    //     this.push(toJSON);
    //     callback();
    //   })
    // )
    .pipe(res);

  demo.on("close", exitCode => {
    console.log(exitCode);
  });
});

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
