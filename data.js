// Huizen, periodes en vragen voor de Bier-StemApp.
// Prijzen, beschikbaarheid en vluchten gecheckt op 9 oktober 2026 (Airbnb + Transavia, 6 personen).
// Reizen die vrienden zelf toevoegen staan in Firebase (collectie "options").
import { PHOTOS_LUCAS, PHOTOS_SOFIE, PHOTOS_BESA, PHOTOS_VILLA } from "./photos.js";

export const MEMBERS = ["Cas", "Hidde", "Lucas", "Shane", "Maurits", "Timo"];
export const CHECKED_ON = "9 okt";
export const GROUP_SIZE = 6;
// Apparaten die geblokkeerd zijn (alles wat ze schreven wordt verborgen).
export const BLOCKED_UIDS = ["pFQSbtE8zSbFkgANLTO5j2Jv6fZ2"];

// De periodes waaruit je kiest. Vluchtprijs = heen + terug p.p., Basic-ticket.
export const PERIODS = [
  {
    id: "p1", label: "21 – 26 juli", short: "21–26 jul", nights: 5, origin: "AMS", flightPP: 403,
    flight: "Transavia vanaf Schiphol · vliegt elke dag · volgens Hidde 's avonds heen (landen rond 22:00) en eind van de ochtend terug",
    flightCheck: "Transavia vliegt elke dag vanaf Schiphol. Nu: heen €242, terug €161.",
    note: "Past voor iedereen, maar is kort. De eerste avond gaat op aan reizen.",
  },
  {
    id: "p2", label: "26 juli – 2 aug", short: "26 jul–2 aug", nights: 7, origin: "RTM", flightPP: 428,
    flight: "Transavia vanaf Rotterdam/Den Haag · alleen op maandag en vrijdag · 's middags heen, terugvlucht maandagavond 20:10 uit Kos (huidige dienstregeling)",
    flightCheck: "26 juli en 2 aug zijn maandagen, dus Rotterdam vliegt dan. Nu: heen €228, terug €200.",
    note: "Past het best voor Lucas. Hidde vindt een week eigenlijk te lang.",
  },
  {
    id: "p3", label: "21 – 29 juli", short: "21–29 jul", nights: 8, origin: "AMS", flightPP: 390,
    flight: "Transavia vanaf Schiphol · vliegt elke dag · de terugvlucht op 29 juli is juist goedkoper",
    flightCheck: "Vlucht is goedkoper dan bij 21–26 juli. Nu: heen €242, terug €148.",
    note: "Lekker lang. Cas wil graag langer, Hidde vindt 8 dagen te lang.",
  },
];

export const GENERAL = [
  { s: "let", t: "Vliegprijzen zijn de laagste prijs voor 1 persoon. Voor 6 stoelen op dezelfde vlucht kan het iets duurder uitvallen, en prijzen veranderen elke dag." },
  { s: "let", t: "Vluchtprijzen zijn met een Basic-ticket (alleen een klein tasje). Een cabinekoffer kost ±€90 extra p.p. heen en terug (schatting uit de chat)." },
  { s: "info", t: "Vliegveld → Kos-stad: ±30 min met de taxi, ±€50–60 per auto. Met 6 man en bagage heb je 2 taxi's of een busje nodig." },
];

// prices = totaalprijs huis voor de hele groep per periode; null = niet vrij op die data.
export const HOUSES = [
  {
    id: "huis-lucas", order: 1, by: "Lucas",
    title: "Retro appartement bij het strand", houseName: "Enorm 4BR Retro Appartement",
    airbnb: "https://www.airbnb.nl/rooms/1586290862285761861", photos: PHOTOS_LUCAS,
    house: "Huurcomplex · ★4,33 · 4 slaapkamers · 5 bedden · 2 badkamers · 3 min lopen naar het strand · inchecken op elk moment",
    pool: false, poolNote: "wel strand op 3 min lopen, airco en een balkon",
    prices: { p1: 1866, p2: 2569, p3: 2921 },
    checks: [{ s: "ok", t: "Slaapplekken: 2 queensize, 2 eenpersoonsbedden en een stapelbed. Iedereen kan een eigen plek hebben." }],
    pros: ["Iedereen een eigen slaapplek", "3 minuten lopen naar het strand", "Laat aankomen is geen probleem"],
    cons: ["Maar 3 reviews (★4,33)", "Geen zwembad"],
  },
  {
    id: "huis-sofie", order: 2, by: "Hidde",
    title: "Goedkoopste huis, in het centrum", houseName: "Sofie's Central House",
    airbnb: "https://www.airbnb.nl/rooms/24965735", photos: PHOTOS_SOFIE,
    house: "Appartement in Kos-stad (volgens de advertentie in het centrum) · ★4,79 (90 reviews) · 3 slaapkamers · 7 bedden · 2 badkamers",
    pool: false, poolNote: "wel airco en een strand in de buurt",
    prices: { p1: 1494, p2: 1839, p3: 2093 },
    checks: [{ s: "ok", t: "Slaapplekken: 3 kamers met elk 2 eenpersoonsbedden, plus een slaapbank. Iedereen een eigen bed." }],
    pros: ["Goedkoopste huis, op elke datum", "Iedereen een eigen bed", "Midden in de stad, veel goede reviews"],
    cons: ["Hidde vond het huis \"heel lelijk\"", "Geen zwembad"],
  },
  {
    id: "huis-villa", order: 3, by: "Cas",
    title: "Villa met zwembad", houseName: "Kosnian Villa",
    airbnb: "https://www.airbnb.nl/rooms/1427456545646172601", photos: PHOTOS_VILLA,
    house: "Villa · ★5,0 (15 reviews) · 3 slaapkamers met elk een queensize bed · 2 badkamers · 5 km buiten Kos-stad · Jeep inbegrepen",
    pool: true, poolNote: "eigen privézwembad, tuin met barbecue en ligstoelen",
    prices: { p1: 3091, p2: 5542, p3: 5818 },
    checks: [
      { s: "ok", t: "Eigen zwembad, tuin met barbecue, en een Jeep Renegade zit bij de prijs." },
      { s: "let", t: "Bedden delen: 3 slaapkamers met elk 1 queensize bed. Airbnb zelf noemt zelfs maar \"1 bed\"; even navragen bij de host." },
      { s: "let", t: "Ligt 5 km buiten de stad. In de Jeep passen 5 mensen, dus met 6 man heb je soms een taxi nodig." },
      { s: "info", t: "Inchecken vanaf 15:00 met sleutelkastje. Gratis annuleren tot 21 juni 2027." },
    ],
    pros: ["Het enige huis met een eigen zwembad", "Auto erbij: makkelijk naar stranden en Tigaki", "Alle 15 reviews geven 5 sterren"],
    cons: ["Duurste huis, zeker in de week van 26 juli", "Iedereen moet een bed delen", "Niet in de stad: uitgaan betekent rijden of een taxi"],
  },
  {
    id: "huis-besa", order: 4, by: "Hidde",
    title: "Luxe appartement (★5,0)", houseName: "Besa Luxury Villa 2",
    airbnb: "https://www.airbnb.nl/rooms/1690724744995440658", photos: PHOTOS_BESA,
    house: "Huurcomplex · ★5,0 · 3 slaapkamers · 5 bedden · 2 badkamers",
    pool: false, poolNote: "",
    prices: { p1: 2382, p2: null, p3: null },
    checks: [{ s: "let", t: "5 bedden voor 6 man: 2 mensen moeten samen in één bed." }],
    pros: ["Hoogst beoordeeld (★5,0)", "Het eerste huis dat Hidde voorstelde"],
    cons: ["Alleen vrij op 21–26 juli", "2 mensen moeten een bed delen", "Geen zwembad"],
  },
];

export const QUESTIONS = [
  {
    id: "data", order: 1, kind: "choice",
    text: "Welke data hebben je voorkeur?",
    context: "Bij elk huis kun je de prijs per periode bekijken.",
    choices: PERIODS.map((p) => `${p.label} (${p.nights} nachten)`),
  },
  {
    id: "bed-delen", order: 2, kind: "choice",
    text: "Is een bed delen oké als dat geld scheelt?",
    context: "In de villa met zwembad en het ★5,0-appartement moet je een bed delen.",
    choices: ["Prima", "Liever niet", "Echt niet"],
  },
  {
    id: "budget", order: 3, kind: "choice",
    text: "Wat is je maximale budget per persoon voor vlucht + huis?",
    context: "Eten, uitgaan en activiteiten komen daar nog bij.",
    choices: ["Tot €700", "Tot €800", "Tot €900", "Maakt niet uit"],
  },
  {
    id: "wanneer-niet", order: 4, kind: "text",
    text: "Wanneer kun je in juli of augustus níet?",
    context: "School, stage, werk, evenementen. Timo moet nog vrij vragen.",
  },
];
