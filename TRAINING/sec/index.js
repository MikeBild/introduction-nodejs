const PORT = process.env.PORT;
const ENV = process.env.NODE_ENV || "development";
const server = require("./server");
const config = require("./package.json");

(async () => {
  const instance = await server({ port: PORT || config.sec[ENV].port });
  console.log(`Listen on ${instance.address().port}`);

  //Graceful shutdown!
  process.on("SIGTERM", () => {
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("Shutdown initiated!");
    //Cleanup and close all resources!!!
    instance.close(() => {
      console.log("Shutdown!");
      process.exit(0);
    });
  });
})();
