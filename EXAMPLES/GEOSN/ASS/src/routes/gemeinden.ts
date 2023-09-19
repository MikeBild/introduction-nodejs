import express from "express";
import { gemeinden as mockGemeinden } from "../mocks/Gemeinden";
export const gemeinden = express.Router();

gemeinden.get("/gemeinden", (req, res) => {
  //database query
  res.send({
    items: mockGemeinden,
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
  res.status(201).send({});
});

gemeinden.put("/gemeinden/:id", (req, res) => {
  //Database update where id=:id
  res.status(200).send({});
});

gemeinden.delete("/gemeinden/:id", (req, res) => {
  //Database delete where id=:id
  res.status(200).send({});
});
