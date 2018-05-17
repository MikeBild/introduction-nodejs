const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlite = require("sqlite");
const samples = require("./routes/samples");
const orders = require("./routes/orders");
const ordersRepository = require("./lib/repositories/orders");

module.exports = server;

async function server({ port = 8080 } = {}) {
  app.use(async (req, res, next) => {
    const dbConnection = await sqlite.open("./sec.db");
    req.ordersRepository = ordersRepository({ dbConnection });
    req.connection.on("close", async () => {
      if (req.headers["Connection"] !== "keep-alive") {
        await dbConnection.close();
      }
    });
    next();
  });

  app.use(bodyParser.json({ limit: "5mb" }));
  app.use("/samples", samples);
  app.use("/orders", orders);

  return new Promise(resolve => {
    const instance = app.listen(port, () => resolve(instance));
  });
}
