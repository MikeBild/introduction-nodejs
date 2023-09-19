import express from "express";
import { AddressInfo } from "net";
import { Server } from "http";
import { gemeinden } from "./routes/gemeinden";
import bodyParser from "body-parser";

let srv: Server | null = null;

const app = express();
app.use(bodyParser.json());
app.use(gemeinden);

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
