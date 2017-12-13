const express = require("express");
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static("./public"));

// app.use((req, res, next) => {
//   req.body = "";
//   req.on("data", raw => {
//     req.body += raw;
//   });
//   req.on("end", () => {
//     req.body = JSON.parse(req.body);
//     next();
//   });
// });

app.use((req, res, next) => {
  req.conn = { close: () => ({}) };
  if (req.method === "POST") console.log(req.method);
  next();
  req.conn.close();
});

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.get("/users", (req, res) => {
  res.send("Demo");
});

app.post("/users", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.get("/users/:id", (req, res) => {
  res.send("Demo " + req.params.id + " " + req.query.foo);
});

app.post("/", (req, res) => {
  res.send("Foo Bar");
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send(err.message);
});

let server = null;
module.exports = {
  port: () => server && server.address().port,
  start,
  stop: callback => {
    server.close(callback);
  }
};

function start(port, callback) {
  server = app.listen(port, null, callback);
}
