const fs = require("fs");
const through = require("through");
const inputDataStream = fs.createReadStream("./demo.log");
const outputDataStream = fs.createWriteStream("./demo2.log");

const myStreamProcessor = through(function(chunk) {
  this.emit("data", chunk.toString().replace(/\n/g, ""));
});

//file copy
inputDataStream.pipe(outputDataStream);

//printf
inputDataStream.pipe(myStreamProcessor).pipe(process.stdout);

let data = "";
inputDataStream.on("data", chunk => {
  data += chunk.toString();
});

inputDataStream.on("end", () => {
  // console.log(data);
});
