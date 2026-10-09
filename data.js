// De vaste opties en vragen uit de groepsapp.
// Prijzen, beschikbaarheid en vluchten gecheckt op 9 oktober 2026 (Airbnb + Transavia, 6 personen).
// Opties die vrienden zelf toevoegen staan in Firebase (collectie "options").

export const MEMBERS = ["Cas", "Hidde", "Lucas", "Shane", "Maurits", "Timo"];
export const CHECKED_ON = "9 okt";

const TRANSAVIA = "https://www.transavia.com/home/nl-nl";
const img = (path) => `https://a0.muscache.com/im/pictures/${path}?im_w=720`;

const HUIS_LUCAS = {
  airbnb: "https://www.airbnb.nl/rooms/1586290862285761861",
  houseName: "Enorm 4BR Retro Appartement",
  photos: [
    "256140a0-0445-4916-bc55-f8ec58dff09d", "cac14774-6f49-49ff-921f-9015586a63a9",
    "c3ffb949-5d55-48ad-8c14-2a02a21d1676", "e873ee12-d551-4253-b8e3-e57ba2551eab",
    "4f72bb7a-7c4c-4814-b1a4-a04a18504dbe",
  ].map((id) => img(`hosting/Hosting-1586290862285761861/original/${id}.jpeg`)),
};
const HUIS_SOFIE = {
  airbnb: "https://www.airbnb.nl/rooms/24965735",
  houseName: "Sofie's Central House",
  photos: [
    "c610aa11-421b-441e-b4fa-32502d6af0e9", "5b569c5c-bf96-4063-a8cf-6843006fd78f",
    "40782de2-22d5-4a96-9019-0886c9ecf898", "314d0ec7-86e4-4505-a9ee-19d90b559a23",
    "40d6a983-5842-403f-87b8-4d54b1ad1292",
  ].map((id) => img(`${id}.jpg`)),
};
const HUIS_BESA = {
  airbnb: "https://www.airbnb.nl/rooms/1690724744995440658",
  houseName: "Besa Luxury Villa 2",
  photos: [
    "4b31d045-bbdb-43d6-a897-b6993cf031c3", "a059c560-448d-437e-aec4-d18ddb512fdd",
    "da970f9a-f9db-4a96-97b5-19fe1e3d39fd", "b170b46b-4ddc-4a0f-acfa-b0a6d383b1c7",
    "ee031d56-09d0-456d-994b-b90b00f577c0",
  ].map((id) => img(`hosting/Hosting-1690724744995440658/original/${id}.jpeg`)),
};

const TAXI = { s: "info", t: "Vliegveld → Kos-stad: ±30 min met de taxi, ±€55 per auto. Met 6 man en bagage heb je 2 taxi's of een busje nodig." };
const KOFFER = { s: "let", t: "Prijs is met Basic-ticket (alleen een klein tasje). Een cabinekoffer kost ±€90 extra p.p. heen en terug (schatting uit de chat)." };
const BEDDEN_LUCAS = { s: "ok", t: "Slaapplekken: 2 queensize, 2 eenpersoonsbedden en een stapelbed. Iedereen kan een eigen plek hebben." };

export const BASE_OPTIONS = [
  {
    id: "kort-21-26-juli", order: 1, seed: true, status: "open", by: "Hidde",
    title: "Korte trip", dates: "21 – 26 juli", length: "5 nachten",
    pricePP: 714, priceNote: "Huis €311 + vlucht €403 (Basic)", origin: "AMS",
    flight: "Transavia vanaf Schiphol · 's avonds heen (landen rond 22:00), eind van de ochtend terug",
    house: "Huurcomplex · ★4,33 · 4 slaapkamers · 5 bedden · 2 badkamers · 3 min lopen naar het strand · inchecken op elk moment",
    ...HUIS_LUCAS,
    link: TRANSAVIA, linkLabel: "Transavia",
    checks: [
      { s: "ok", t: "Huis is vrij op 21–26 juli: €1.866 voor de hele groep." },
      { s: "ok", t: "Transavia vliegt elke dag vanaf Schiphol. Nu: heen €242, terug €161." },
      BEDDEN_LUCAS, KOFFER, TAXI,
    ],
    pros: [
      "Iedereen lijkt te kunnen: Cas is vrij vanaf 19 juli, Lucas heeft na de 19e geen les meer",
      "Goedkoopste optie met het huis van Lucas",
      "Inchecken kan op elk moment, dus laat aankomen is geen probleem",
    ],
    cons: [
      "Maar 5 nachten",
      "Eerste avond gaat op aan reizen: landen rond 22:00 en daarna nog een half uur taxi",
      "Lucas heeft liever vanaf 26 juli (evenementen en praktijkuren)",
    ],
  },
  {
    id: "goedkoop-sofie-21-26-juli", order: 2, seed: true, status: "open", by: "Hidde",
    title: "Korte trip, goedkoper huis", dates: "21 – 26 juli", length: "5 nachten",
    pricePP: 652, priceNote: "Huis €249 + vlucht €403 (Basic)", origin: "AMS",
    flight: "Transavia vanaf Schiphol · zelfde vluchten als de korte trip",
    house: "Appartement in het centrum · ★4,79 (90 reviews) · 3 slaapkamers · 7 bedden · 2 badkamers",
    ...HUIS_SOFIE,
    link: TRANSAVIA, linkLabel: "Transavia",
    checks: [
      { s: "ok", t: "Huis is vrij op 21–26 juli: €1.494 voor de hele groep." },
      { s: "ok", t: "7 bedden voor 6 man: genoeg plek." },
      { s: "info", t: "Hoe de bedden verdeeld zijn, staat niet op Airbnb. Even vragen aan de host." },
      KOFFER, TAXI,
    ],
    pros: [
      "Goedkoopste optie van allemaal",
      "Veel bedden en goede reviews (★4,79 uit 90)",
      "Midden in de stad",
    ],
    cons: [
      "Hidde vond het huis \"heel lelijk\"",
      "Maar 5 nachten",
      "Eerste avond gaat op aan reizen",
    ],
  },
  {
    id: "week-26-jul-2-aug", order: 3, seed: true, status: "open", by: "Lucas",
    title: "Hele week vanaf 26 juli", dates: "26 juli – 2 aug", length: "7 nachten",
    pricePP: 856, priceNote: "Huis €428 + vlucht €428 (Basic)", origin: "RTM",
    flight: "Transavia vanaf Rotterdam/Den Haag · vliegt alleen op maandag en vrijdag · geen ochtendvlucht",
    house: "Zelfde huis als de korte trip · ★4,33 · 4 slaapkamers · 5 bedden · 2 badkamers",
    ...HUIS_LUCAS,
    link: TRANSAVIA, linkLabel: "Transavia",
    checks: [
      { s: "ok", t: "Huis is vrij op 26 juli – 2 aug: €2.569 voor de hele groep." },
      { s: "ok", t: "26 juli en 2 aug zijn maandagen, dus Rotterdam vliegt dan. Nu: heen €228, terug €200." },
      BEDDEN_LUCAS, KOFFER, TAXI,
    ],
    pros: [
      "Past het beste bij Lucas zijn planning",
      "Lekker lang: 7 nachten",
      "Vanaf Rotterdam en geen vroege vlucht",
    ],
    cons: [
      "Duurder dan de korte trips",
      "Hidde vindt een week eigenlijk te lang",
    ],
  },
  {
    id: "lang-8-dagen", order: 4, seed: true, status: "open", by: "Cas",
    title: "Lange trip", dates: "21 – 29 juli", length: "8 nachten",
    pricePP: 877, priceNote: "Huis €487 + vlucht €390 (Basic)", origin: "AMS",
    flight: "Transavia vanaf Schiphol · de terugvlucht op 29 juli is juist goedkoper",
    house: "Zelfde huis als de korte trip · ★4,33 · 4 slaapkamers · 5 bedden · 2 badkamers",
    ...HUIS_LUCAS,
    link: TRANSAVIA, linkLabel: "Transavia",
    checks: [
      { s: "ok", t: "Huis is vrij op 21–29 juli: €2.921 voor de hele groep." },
      { s: "ok", t: "Vlucht is goedkoper dan bij de korte trip. Nu: heen €242, terug €148." },
      { s: "info", t: "3 nachten extra kosten maar ±€163 p.p. meer dan de korte trip." },
      BEDDEN_LUCAS, KOFFER,
    ],
    pros: [
      "3 nachten extra voor maar ±€163 meer",
      "Genoeg tijd voor activiteiten én uitrusten",
      "Kos is wat anders dan Texel: meer te doen",
    ],
    cons: [
      "Hidde vindt 8 dagen samen te lang (Texel was al lang genoeg)",
      "Lucas hoeft niet per se 8 nachten",
    ],
  },
  {
    id: "eerste-14-19-juli", order: 5, seed: true, status: "afgevallen",
    statusNote: "Lucas en Cas kunnen dan niet.", by: "Hidde",
    title: "Eerste voorstel", dates: "14 – 19 juli", length: "5 nachten",
    pricePP: 777, priceNote: "Huis €397 + vlucht €380 (uit de chat)", origin: "AMS",
    flight: "Transavia · met handbagagekoffer €380 pp, met ruimbagage €436 pp",
    house: "Huurcomplex · ★5,0 · 3 slaapkamers · 5 bedden · 2 badkamers",
    ...HUIS_BESA,
    checks: [
      { s: "ok", t: "Huis is nog vrij op 14–19 juli: €2.382 voor de hele groep." },
      { s: "nee", t: "Lucas heeft dan de Zwarte Cross en een bruiloft, Cas heeft nog stage." },
    ],
    pros: ["Hoogst beoordeelde huis (★5,0)"],
    cons: ["2 mensen moeten samen in één bed"],
  },
];

export const QUESTIONS = [
  {
    id: "bed-delen", order: 1, kind: "choice",
    text: "Is een bed of slaapbank delen oké als dat geld scheelt?",
    context: "Lucas: een huis met gedeelde bedden kan zo'n €800 goedkoper zijn voor de hele groep. Shane heeft liever een eigen bed.",
    choices: ["Prima", "Liever niet", "Echt niet"],
  },
  {
    id: "hoe-lang", order: 2, kind: "choice",
    text: "Hoe lang wil je weg?",
    context: "Hidde vindt 8 dagen te lang, Cas wil juist wat langer weg.",
    choices: ["5 nachten", "6 nachten", "7 nachten", "8 nachten"],
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
