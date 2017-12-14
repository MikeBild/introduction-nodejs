const fizzbuzz = require("./fizzbuzz");
const count = parseInt(process.argv[2]);
const output = fizzbuzz(count || 100);

console.log(output);
