const express = require("express");
const router = express.Router();
const plantsRepo = require("../lib/repos/plants-repo");

module.exports = router;

router.get("/", async (req, res) => {
  // console.log(req.__meinFeld());
  const data = await plantsRepo.all();
  res.send(data);
});

router.get("/:name", async (req, res) => {
  try {
    res.send(await plantsRepo.byName(req.params.name));
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.post("/:name", (req, res) => {
  const plantName = req.params.name;
  const plant = req.body;
  plant.name = plantName;
  plantsRepo
    .insert(plant)
    .then(data => res.send(data))
    .catch(error => res.status(409).send({ error: error.message }));
});
