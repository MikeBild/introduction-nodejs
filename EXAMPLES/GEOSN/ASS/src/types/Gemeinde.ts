import { Country } from "./Country";
import { ID, Fehler, Kennzeichen, Geometrie } from "./Einheiten";

export interface Gemeinde {
  id: ID | number;
  fehler: Fehler | string | null
  kennzeichen: Kennzeichen | string;
  geometrie: Geometrie | string;
  name: string
  country: Country | string
}

