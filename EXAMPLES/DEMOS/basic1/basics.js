const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  fs.writeFile("./demo.json", req.method, (err, data) => {
    res.write("Hello");
    res.write("World");
    res.end();
  });
});

server.listen(8080, null, () => console.log("Listen on 8080"));
