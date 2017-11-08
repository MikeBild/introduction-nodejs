const plantsRepo = require("./plants-repo");
const genotypesRepo = require("./genotypes-repo");

module.exports = client => {
  return {
    plantsRepo: plantsRepo(client),
    genotypesRepo: genotypesRepo(client)
  };
};
