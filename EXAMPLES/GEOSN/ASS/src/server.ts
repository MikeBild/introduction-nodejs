import { start as startHttpServer } from "./http-api";
import { createBenutzerTable } from "./lib/db";

main();

async function main() {
  createBenutzerTable();
  await startHttpServer(8080);
}
