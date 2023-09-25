import { AsyncDatabase } from "promised-sqlite3";

export async function dropTable() {
  const db = await AsyncDatabase.open("./db.sqlite");
  await db.run("DROP TABLE IF EXISTS benutzer");
}

export async function createBenutzerTable() {
  const db = await AsyncDatabase.open("./db.sqlite");
  await db.run(
    "CREATE TABLE IF NOT EXISTS benutzer (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT)"
  );
}
