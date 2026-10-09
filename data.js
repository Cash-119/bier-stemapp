// Huizen, periodes en vragen voor de Bier-StemApp.
// Prijzen, beschikbaarheid en vluchten gecheckt op 9 oktober 2026 (Airbnb + Transavia + Sunweb, 6 personen).
// Reizen die vrienden zelf toevoegen staan in Firebase (collectie "options").
import { PHOTOS_LUCAS, PHOTOS_SOFIE, PHOTOS_BESA, PHOTOS_VILLA, PHOTOS_ANGELA, PHOTOS_ANASTASIA } from "./photos.js";

export const MEMBERS = ["Cas", "Hidde", "Lucas", "Shane", "Maurits", "Timo"];
export const CHECKED_ON = "9 okt";
export const GROUP_SIZE = 6;
// Apparaten die geblokkeerd zijn (alles wat ze schreven wordt verborgen).
export const BLOCKED_UIDS = ["pFQSbtE8zSbFkgANLTO5j2Jv6fZ2"];

// De periodes waaruit je kiest. Vluchtprijs = heen + terug p.p., Basic-ticket.
export const PERIODS = [
  {
    id: "p1", label: "21 – 26 juli", short: "21–26 jul", nights: 5, origin: "AMS", flightPP: 403,
    flight: "Transavia vanaf Schiphol · heen wo 21 juli 18:15 → 22:45 · terug ma 26 juli 10:35 → 13:25",
    flightCheck: "Vluchten gecheckt voor 6 personen: heen €242, terug €161 p.p. (nog 10+ stoelen voor deze prijs).",
    note: "Past voor iedereen, maar is kort. De eerste avond gaat op aan reizen.",
  },
  {
    id: "p2", label: "26 juli – 2 aug", short: "26 jul–2 aug", nights: 7, origin: "RTM", flightPP: 386,
    flight: "Transavia vanaf Rotterdam/Den Haag · heen ma 26 juli 14:55 → 19:20 · terug ma 2 aug 20:10 → 22:50",
    flightCheck: "Vluchten gecheckt voor 6 personen: heen €228, terug €158 p.p. (nog 10+ stoelen). Rotterdam vliegt alleen op maandag en vrijdag.",
    note: "Past het best voor Lucas. Hidde vindt een week eigenlijk te lang.",
  },
  {
    id: "p3", label: "21 – 29 juli", short: "21–29 jul", nights: 8, origin: "AMS", flightPP: 403,
    flight: "Transavia vanaf Schiphol · heen wo 21 juli 18:15 → 22:45 · terug do 29 juli 12:10 → 15:00",
    flightCheck: "Vluchten gecheckt voor 6 personen: heen €242, terug €161 p.p. (nog 10+ stoelen voor deze prijs).",
    note: "Lekker lang. Cas wil graag langer, Hidde vindt 8 dagen te lang.",
  },
];

export const GENERAL = [
  { s: "info", t: "Alle prijzen zijn nagekeken voor 6 personen, maar ze veranderen elke dag. Check ze vlak voor het boeken nog een keer." },
  { s: "let", t: "Bij de Airbnb-huizen is de vlucht los geboekt bij Transavia met een Basic-ticket (alleen een klein tasje). Een cabinekoffer kost ±€90 extra p.p. heen en terug (schatting uit de chat)." },
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
  {
    id: "huis-angela", order: 5, by: "Cas", package: true,
    title: "Pakketreis met zwembad", houseName: "Appartementen Angela (Sunweb)",
    sunweb: "https://www.sunweb.nl/vakantie/griekenland/kos/kos-stad/appartementen-angela", photos: PHOTOS_ANGELA,
    house: "Appartementencomplex in Kos-stad · reviews 8/10 (86) · 3-kamerappartement ±60 m² met 6 slaapplekken · 1 badkamer · centrum 300 m · strand 400 m",
    pool: true, poolNote: "zwembad met poolbar, ligstoelen en parasols (gedeeld met het complex)",
    // Sunweb-prijs p.p. inclusief vlucht vanaf Schiphol, alleen logies, 6 personen in 1 appartement.
    packagePP: { p1: 658, p2: 744, p3: 770 },
    checks: [
      { s: "ok", t: "Vlucht + appartement in één boeking via Sunweb, vanaf Schiphol. Op 21 juli zijn er nog 4 appartementen voor 6 personen vrij." },
      { s: "info", t: "Slapen: 2 slaapkamers (een tweepersoonsbed óf 2 losse bedden) en 2 bedbanken in de woonkamer." },
      { s: "let", t: "Maar 1 badkamer voor 6 man, en airco kost extra (te betalen per dag)." },
      { s: "let", t: "Transfer van het vliegveld zit er niet bij. De Sunweb-bus kost extra en doet 1–2 uur over Kos-stad; een taxi doet ±30 min." },
      { s: "info", t: "Bagage, vliegmaatschappij en vliegtijden zie je pas in de boekingsstappen; die heb ik niet gecheckt." },
      { s: "let", t: "Volgens reviews zijn de appartementen gehorig." },
    ],
    pros: ["Zwembad met poolbar", "300 m van het centrum, 400 m van het strand", "In juli en augustus populair bij jongeren (volgens Sunweb)", "Goedkoopste optie met een zwembad"],
    cons: ["Eenvoudig (officieel 2 sterren)", "1 badkamer en 2 man op een bedbank", "Transfer en airco kosten extra"],
  },
  {
    id: "huis-anastasia", order: 6, by: "Cas", package: true,
    title: "Luxere pakketreis met zwembad", houseName: "Appartementen Anastasia (Sunweb)",
    sunweb: "https://www.sunweb.nl/vakantie/griekenland/kos/kos-stad/appartementen-anastasia", photos: PHOTOS_ANASTASIA,
    house: "Gerenoveerd appartementencomplex (officieel 4 sterren) in Kos-stad · reviews 8,4/10 (426) · superieur 3-kamerappartement ±44 m² met 6 slaapplekken · 1 badkamer · uitgaansstraat 800 m · strand 800 m · supermarkt 50 m",
    pool: true, poolNote: "gerenoveerd zwembad met ligbedden (gedeeld met het complex)",
    // Sunweb-prijs p.p. inclusief vlucht vanaf Schiphol, alleen logies, 6 personen in 1 appartement.
    packagePP: { p1: 789, p2: 941, p3: 996 },
    checks: [
      { s: "ok", t: "Vlucht + appartement in één boeking via Sunweb, vanaf Schiphol. Op 21 juli zijn er nog maar 2 van deze appartementen vrij." },
      { s: "let", t: "Slapen: 2 slaapkamers met elk een tweepersoonsbed en een bedbank in de woonkamer. 4 man delen dus sowieso een bed." },
      { s: "ok", t: "Airco zit bij de prijs, en je krijgt 3 dagen gratis een fiets." },
      { s: "let", t: "Maar 1 badkamer voor 6 man, en het appartement is kleiner dan bij Angela (±44 m² tegen ±60 m²)." },
      { s: "let", t: "Transfer van het vliegveld zit er niet bij. Een taxi doet ±30 min." },
      { s: "info", t: "Ligt aan een drukke weg. Bagage, vliegmaatschappij en vliegtijden zie je pas in de boekingsstappen; die heb ik niet gecheckt." },
    ],
    pros: ["Netter en luxer: gerenoveerd, 4 sterren, betere reviews (8,4)", "Zwembad, airco inbegrepen en gratis fietsen", "Supermarkt om de hoek, 24 uur receptie"],
    cons: ["±€130–225 p.p. duurder dan Angela", "4 man moeten een bed delen, 1 badkamer", "Iets verder van strand en centrum (±800 m–1 km)"],
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
    context: "In de villa met zwembad, het ★5,0-appartement en Anastasia moet je een bed delen.",
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
