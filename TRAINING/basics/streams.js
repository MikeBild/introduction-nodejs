const fs = require("fs");

const readDataStream = fs.createReadStream("./copy.json");
const writeDataStream = fs.createWriteStream("./copied.json");

readDataStream.on("data", msg => console.log(msg.toString()));
readDataStream.pipe(writeDataStream);
