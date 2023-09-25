import express from "express";
import { AddressInfo } from "net";
import { Server } from "http";
import { gemeinden } from "./routes/gemeinden";
import { benutzer } from "./routes/benutzer";
import bodyParser from "body-parser";

let srv: Server | null = null;

const app = express();
app.use(bodyParser.json());
app.use(gemeinden);
app.use(benutzer);

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

//common exception handler
process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});

//ps
//kill -TERM <PID>
process.on("SIGTERM", onExit);
process.on("SIGINT", onExit);

function onExit() {
  console.log("EXIT");
  process.exit(0);
}

// Simulation of error
// setInterval(() => {
//   throw new Error("MEIN FEHLER!");
// }, 4000);
