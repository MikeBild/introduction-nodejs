import express from "express";
import { AddressInfo } from "net";
import { Server } from "http";

const app = express();
let srv: Server | null = null;

app.get("/gemeinden", (req, res) => {
  res.send({
    message: "Hello World!",
  });
});

export function start(port = 8080): Promise<Server | null> {
  return new Promise((resolve) => {
    srv = app.listen(port, () => {
      console.log(
        `Listen on ${(srv?.address() as AddressInfo)?.port}. Exit with CTRL+C.`
      );
      resolve(srv);
    });
  });
}

export function stop(): Promise<void> {
  return new Promise((resolve) => {
    srv?.close(() => {
      console.log(`Exit.`);
      resolve();
    });
  });
}
