import { Country } from "./Country";
import { ID, Fehler, Kennzeichen, QuadratKilometer } from "./Einheiten";

interface Gemeinde {
  id: ID | number;
  fehler: Fehler | string
  kennzeichen: Kennzeichen | string;
  geometrie: QuadratKilometer | string;
  name: string
  country: Country | string
}

