const router = require("express").Router();
const Sample = require("../lib/models/Sample");

module.exports = router;

const result = [
  new Sample("kurs1", "tuan", [1, 2, 3]),
  new Sample("kurs2", "tuan", [2, 4])
];

router.get("/", (req, res) => {
  res.send(result);
});

router.get("/:id", (req, res) => {
  const sampleId = req.params.id;
  const sample = result.find(x => x.id === sampleId);

  if (!sample) return res.sendStatus(404);

  res.send(sample);
});
