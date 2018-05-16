const express = require("express");
const app = express();
const bodyParser = require("body-parser");
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

app.listen(8080, () => console.log(`Listen on 8080`));
