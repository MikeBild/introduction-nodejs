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

module.exports = ({ dbConnection }) => {
  return {
    loadAll: () => loadAll(dbConnection),
    loadById: id => loadById(id, dbConnection),
    create,
    update,
    // remove,
    archive
  };
};

async function loadAll(dbConnection) {
  return await dbConnection.all("select * from orders");
}

async function loadById(id, dbConnection) {
  return await dbConnection.get("select * from orders where id = ?", [id]);
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
