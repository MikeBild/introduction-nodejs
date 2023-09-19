export interface ID {
    id: number
}

export interface Geometrie {
    flaeche: number
    einheit: "QuadratKilometer" | "Qudratmeter"
}

export interface Kennzeichen {
    wert: string
}

export interface Fehler {
    nachricht: string
}

export interface CountryCode {
    wert: "DE" | "FR"
}