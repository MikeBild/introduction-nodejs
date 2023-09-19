import express from "express";
import { gemeinden as mockGemeinden, add } from "../mocks/Gemeinden";
export const gemeinden = express.Router();

gemeinden.get("/gemeinden", (req, res) => {
  const nameContains = req.query["?nameContains"] as string;

  //database query
  res.send({
    items: nameContains
      ? mockGemeinden.filter((x) => x.name.includes(nameContains))
      : mockGemeinden,
  });
});

gemeinden.get("/gemeinden/:id", (req, res) => {
  const [firstHit] = mockGemeinden.filter(
    (x) => x.id === parseInt(req.params.id)
  );
  //database query where id=:id
  res.send(firstHit);
});

gemeinden.post("/gemeinden", (req, res) => {
  //Database insert
  const created = {
    ...req.body,
    id: mockGemeinden.length + 1,
  };
  add(created);
  res.status(201).send(created);
});

gemeinden.put("/gemeinden/:id", (req, res) => {
  //Database update where id=:id
  res.status(200).send({});
});

gemeinden.delete("/gemeinden/:id", (req, res) => {
  //Database delete where id=:id
  res.status(200).send({});
});
