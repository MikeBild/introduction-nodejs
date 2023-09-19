import express from "express";
import { AddressInfo } from "net";

const app = express();

app.get("/gemeinde", (req, res) => {
  res.send({
    message: "Hello World!",
  });
});

const srv = app.listen(8080, () => {
  console.log(`Listen on ${(srv?.address() as AddressInfo)?.port}`);
});
