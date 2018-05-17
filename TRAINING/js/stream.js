const fs = require("fs");

const dataReadStream = fs.createReadStream("./data.csv");
const dataWriteStream = fs.createWriteStream("./data2.csv");

// dataReadStream.on("data", chunk => {
//   console.log(chunk.toString());
// });

dataReadStream.pipe(dataWriteStream);
dataReadStream.pipe(process.stdout);
