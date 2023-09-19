import { start as startHttpServer } from "./http-api";

main();

async function main() {
  await startHttpServer(8080);
}
