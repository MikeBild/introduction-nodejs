import express from "express";
import { AsyncDatabase } from "promised-sqlite3";
export const benutzer = express.Router();

benutzer.get("/benutzer", async (req, res) => {
  const db = await AsyncDatabase.open("./db.sqlite");
  const result = await db.all("SELECT * from benutzer;");
  res.send(result);
});

benutzer.post("/benutzer", async (req, res) => {
  const { name, email } = req.body;
  const db = await AsyncDatabase.open("./db.sqlite");
  const dbResult = await db.run(
    "INSERT INTO benutzer (name, email) VALUES ($name, $email); select last_insert_rowid();",
    {
      $name: name,
      $email: email,
    }
  );

  return res.status(201).send({
    id: dbResult.lastID,
    name,
    email,
  });
});
