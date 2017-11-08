const express = require("express");
const router = express.Router();
const genotypesRepo = require("../lib/repos/genotypes-repo");

module.exports = router;

router.get("/", (req, res) => {
  genotypesRepo.all().then(data => res.send(data));
});

router.get("/:name", (req, res) => {
  genotypesRepo
    .byName(req.params.name)
    .then(data => res.send(data))
    .catch(error => res.status(404).send({ error: error.message }));
});

router.post("/:name", (req, res) => {
  const plantName = req.params.name;
  const plant = req.body;
  plant.name = plantName;
  genotypesRepo
    .insert(plant)
    .then(data => res.send(data))
    .catch(error => res.status(409).send({ error: error.message }));
});
