const sqlite = require("sqlite");
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const server = require("./server");
const dbPromise = sqlite.open("./data-server.db");

(async () => {
  const db = await dbPromise;
  const instance = server({ isAuthenticationEnabled: false, db });

  const app = instance.listen(8080, () => {
    console.log(`Is in production: ${IS_PRODUCTION}`);
    console.log(`Is auth enabled: ${instance.config.isAuthenticationEnabled}`);
    console.log(`Listen on ${app.address().port}`);
  });
})();
