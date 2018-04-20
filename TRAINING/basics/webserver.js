const http = require("http");
const fsDemo = require("./fs-demo");

const server = http
  .createServer(onServerHandler)
  .listen(8080, () => onStart(server));

function onServerHandler(req, res) {
  fsDemo.leseAlleDaten((err, data) => {
    if (err && err.message === "Meine Fehler!") {
      res.statusCode = 400;
      return res.end();
    }

    res.write(JSON.stringify(data, null, 2));
    res.end();
  });
}

function onStart(server) {
  console.log(`Listen on ${server.address().port}`);
}
