const router = require("express").Router();
const Order = require("../lib/models/order");

module.exports = router;

router.get("/", (req, res) => {
  res.send(req.ordersRepository.loadAll());
});

router.get("/:id", (req, res) => {
  const orderId = req.params.id;
  const order = req.ordersRepository.loadById(orderId);

  if (!order) return res.sendStatus(404);

  res.send(order);
});

router.post("/", (req, res) => {
  const orderToCreate = req.body;
  //TODO: Validate order to create

  const createdOrder = req.ordersRepository.create(orderToCreate);
  res.send(createdOrder);
});

router.put("/:id", (req, res) => {
  const orderId = req.params.id;
  const order = req.body;
  order.id = orderId;
  const updatedOrder = req.ordersRepository.update(order);
  res.send(updatedOrder);
});

router.patch("/:id/:status", (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.params.status;

  if (!Order.validStatusList().find(x => x === newStatus))
    return res
      .status(400)
      .send({ error: `${newStatus} invalid`, status: Order.validStatusList() });

  if (newStatus === "ARCHIVED") {
    const updatedOrder = req.ordersRepository.archive(orderId);
    res.send(updatedOrder);
    return;
  }
});
