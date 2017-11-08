const express = require("express");
const router = express.Router();

module.exports = router;

router.get("/", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const data = await req.__repos.plantsRepo.all(limit);
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
