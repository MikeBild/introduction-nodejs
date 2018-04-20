const fs = require("fs");

module.exports = {
  leseDaten: leseDatenOut,
  leseAlleDaten: leseDatenOut,
  schreibeDaten: schreibeDaten,
  schreibeDatenMitErrorAusgabe: () => schreibeDaten(err => console.error(err))
};

function leseDatenOut(callback) {
  console.log("Async");
  fs.readFile("./out.json", (err, data) => {
    if (err) {
      console.error(err);
      callback(new Error("Meine Fehler!"));
      return;
    }
    console.log("Async stop");
    console.log(JSON.parse(data));
    callback(null, JSON.parse(data));
  });
}

function schreibeDaten(callback) {
  fs.writeFile("./in.json", JSON.stringify({ foo: "bar" }, null, 2), callback);
}

// console.log("Sync start");
// const inData = fs.readFileSync("./out.json").toString();
// console.log(inData);
// console.log("Sync end");
