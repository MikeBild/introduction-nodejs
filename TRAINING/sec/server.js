const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlite = require("sqlite");
const samples = require("./routes/samples");
const orders = require("./routes/orders");
const ordersRepository = require("./lib/repositories/orders");

app.use(bodyParser.json({ limit: "5mb" }));
app.use((req, res, next) => {
  req.ordersRepository = ordersRepository;
  next();
});
app.use("/samples", samples);
app.use("/orders", orders);

module.exports = async ({ port = 8080 } = {}, callback) => {
  const dbConnection = await sqlite.open("./sec.db");
  return app.listen(port, callback);
};
