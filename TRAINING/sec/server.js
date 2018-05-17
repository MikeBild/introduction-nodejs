const { createReadStream } = require("fs");
const { spawn } = require("child_process");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const crypto = require("crypto");
const sqlite = require("sqlite");
const samples = require("./routes/samples");
const orders = require("./routes/orders");
const ordersRepository = require("./lib/repositories/orders");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

module.exports = server;

async function server({ port = 8080 } = {}) {
  const swaggerDocument = YAML.load("./swagger.yaml");

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get("/filedata", (req, res) => {
    createReadStream("./data.csv").pipe(res);
  });

  app.get("/ls", (req, res) => {
    const ls = spawn("ls", ["-lha", "./"]);
    ls.stdout.pipe(res);
  });

  app.use(async (req, res, next) => {
    const dbConnection = await sqlite.open("./sec.db");
    const accountHeader = (req.headers["authorization"] || "").replace(
      "Basic ",
      ""
    );
    const accountString = Buffer.from(accountHeader, "base64").toString("utf8");
    const accountArray = accountString.split(":");
    const userId = accountArray[0];
    const password = accountArray[1];
    const passwordHash = crypto
      .createHash("md5")
      .update(password || "")
      .digest("hex");

    const account = await dbConnection.get(
      "select * from accounts where id = ?",
      [userId]
    );
    if (!account) return res.sendStatus(401);
    req.user = account;
    next();
  });

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
