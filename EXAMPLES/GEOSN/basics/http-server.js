const http = require("http");

console.log("Hello HTTP Server!");

const srv = http.createServer((req, res) => {
  res.end("Hello World!");
});

module.exports = {
  start(port, done = serverStartSuccess) {
    srv.listen(port, done);
  },
  stop(done = serverStopSuccess) {
    srv.close(done);
  },
};

function serverStartSuccess() {
  console.log(`Server listen on ${srv.address().port}. CTRL+C for exit.`);
}

function serverStopSuccess() {
  console.log("Exit");
}
