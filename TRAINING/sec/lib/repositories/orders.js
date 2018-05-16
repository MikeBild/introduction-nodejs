const Order = require("../models/Order");

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

module.exports = {
  loadAll,
  loadById,
  create,
  update,
  // remove,
  archive
};

function loadAll() {
  return result;
}

function loadById(id) {
  return result.find(x => x.id === id);
}

function create({ sampleId, dns, start, end, status }) {
  const newOrderId = (result.length + 1).toString();
  const newOrder = new Order(newOrderId, sampleId, dns, start, end, status);
  result.push(newOrder);
  return newOrder;
}

function update({ id, sampleId, dns, start, end, status }) {
  const orderToUpdateIndex = result.findIndex(x => x.id === id);
  console.log(orderToUpdateIndex, result[orderToUpdateIndex], {
    id,
    sampleId,
    dns,
    start,
    end,
    status
  });
  result[orderToUpdateIndex] = new Order(id, sampleId, dns, start, end, status);
  return result[orderToUpdateIndex];
}

function remove(id) {
  const orderToRemoveIndex = result.findIndex(x => x.id === id);
  delete result[orderToRemoveIndex];
}

function archive(id) {
  const orderToArchiveIndex = result.findIndex(x => x.id === id);
  result[orderToArchiveIndex].status = "ARCHIVED";
  return result[orderToArchiveIndex];
}
