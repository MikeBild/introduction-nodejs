const http = require("http");

http.get("http://localhost:8080", (res) => {
  res.pipe(process.stdout);
});
