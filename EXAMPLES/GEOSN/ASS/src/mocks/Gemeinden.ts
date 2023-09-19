import { Gemeinde } from "../types/Gemeinde";

export const gemeinden: Gemeinde[] = [
  {
    id: 1,
    fehler: null,
    country: {
      code: { wert: "DE" },
      codelistUrl: new URL("http://inspire.ec.europa.eu/codelist/CountryCode"),
    },
    name: "Stadt Elstra",
    kennzeichen: { wert: "ABC" },
    geometrie: {
      flaeche: 32.6087,
      einheit: "QuadratKilometer",
    },
  },
  {
    id: 2,
    fehler: null,
    country: {
      code: { wert: "FR" },
      codelistUrl: new URL("http://inspire.ec.europa.eu/codelist/CountryCode"),
    },
    name: "Stadt Dresden",
    kennzeichen: { wert: "XYZ" },
    geometrie: {
      flaeche: 99.34,
      einheit: "QuadratKilometer",
    },
  },
];
