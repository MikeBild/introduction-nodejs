const packageConfig = require("./package.json");

module.exports = {
  DEMO: process.env.DEMO || "slslk",
  FOO: packageConfig.ocConfig.DEMO
};
