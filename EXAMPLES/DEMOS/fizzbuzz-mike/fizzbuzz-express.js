const express = require("express");
const morgan = require("morgan");
const app = express();
const fizzbuzz = require("./fizzbuzz");

app.use(morgan({ format: "tiny" }));

app.get("/fizzbuzz", (req, res) => {
  res.send(fizzbuzz());
});

app.get("/fizzbuzz/:count", (req, res) => {
  const count = parseInt(req.params.count);
  const output = fizzbuzz(count);

  if (req.query.format === "object") {
    const asObject = output.reduce((s, n, i) => {
      i += 1;
      s[i] = n;
      return s;
    }, {});
    return res.send(asObject);
  }
  res.send(output);
});

let server = null;

module.exports = {
  port: () => server.address().port,
  start: (port, callback) => (server = app.listen(port, callback)),
  stop: callback => server.close(callback)
};
