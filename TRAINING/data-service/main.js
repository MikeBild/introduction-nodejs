const IS_PRODUCTION = process.env.NODE_ENV === "production";
const server = require("./server")({ isAuthenticationEnabled: false });

const app = server.listen(8080, () => {
  console.log(`Is in production: ${IS_PRODUCTION}`);
  console.log(`Is auth enabled: ${server.config.isAuthenticationEnabled}`);
  console.log(`Listen on ${app.address().port}`);
});
