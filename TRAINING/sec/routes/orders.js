const router = require("express").Router();
const Order = require("../lib/models/order");

module.exports = router;

const result = [
  new Order(
    "1",
    "kurs1",
    "abc",
    new Date("05.17.2018"),
    new Date("05.18.2018")
  ),
  new Order(
    "2",
    "kurs1",
    "efg",
    new Date("05.17.2018"),
    new Date("05.18.2018")
  ),
  new Order(
    "3",
    "kurs2",
    "hijkl",
    new Date("05.17.2018"),
    new Date("05.18.2018")
  )
];

router.get("/", (req, res) => {
  res.send(result);
});

router.get("/:id", (req, res) => {
  const orderId = req.params.id;
  const order = result.find(x => x.id === orderId);

  if (!order) return res.sendStatus(404);

  res.send(order);
});
