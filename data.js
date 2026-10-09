// De vaste opties en vragen uit de groepsapp.
// Opties die vrienden zelf toevoegen staan in Firebase (collectie "options").

export const MEMBERS = ["Cas", "Hidde", "Lucas", "Shane", "Maurits", "Timo"];

const TRANSAVIA = "https://www.transavia.com/boeken/nl-nl/zoek-een-vlucht";

export const BASE_OPTIONS = [
  {
    id: "kort-21-26-juli", order: 1, seed: true, status: "open", by: "Hidde",
    title: "Korte trip", dates: "21 – 26 juli", length: "5 nachten",
    pricePP: 760, priceNote: "Vlucht + huis, cabinekoffer inbegrepen", origin: "AMS",
    flight: "Transavia vanaf Schiphol · 's avonds heen (landen rond 22:00), eind van de ochtend terug · cabinekoffer inbegrepen",
    house: "Huurcomplex midden in de stad · ★4,33 · 4 slaapkamers · 5 bedden · 2 badkamers · inchecken vanaf 15:00 met sleutelkastje",
    link: TRANSAVIA, linkLabel: "Vluchten zoeken bij Transavia",
    pros: [
      "Iedereen lijkt te kunnen: Cas is vrij vanaf 19 juli, Lucas heeft na de 19e geen les meer",
      "Goedkoopste optie die nog haalbaar is",
      "Huis midden in de stad, met 24-uurswinkels in de buurt",
      "Prima vliegtijden, geen nacht doorhalen op Schiphol",
    ],
    cons: [
      "Maar 5 nachten",
      "Eerste avond gaat op aan reizen: landen rond 22:00 en dan nog ±40 min met de taxi",
      "Eerste avond geen boodschappen in een gewone supermarkt",
      "Lucas heeft liever vanaf 26 juli (evenementen en praktijkuren)",
      "5 bedden voor 6 man: checken hoe de bedden verdeeld zijn",
    ],
  },
  {
    id: "week-26-jul-2-aug", order: 2, seed: true, status: "open", by: "Lucas",
    title: "Hele week vanaf 26 juli", dates: "26 juli – 2 aug", length: "7 nachten",
    pricePP: 887, priceNote: "Met basisticket. Met Smart (koffer + tas) ±€977", origin: "RTM",
    flight: "Transavia vanaf Rotterdam/Den Haag · geen ochtendvlucht · basisticket €458 pp, Smart €548 pp",
    house: "Zelfde huis midden in de stad · ★4,33 · 4 slaapkamers · 5 bedden · 2 badkamers",
    link: TRANSAVIA, linkLabel: "Vluchten zoeken bij Transavia",
    pros: [
      "Past het beste bij Lucas zijn planning",
      "Langer weg: 7 nachten",
      "Vanaf Rotterdam is goedkoper en er is geen vroege vlucht",
    ],
    cons: [
      "Duurste optie, zeker met een Smart-ticket (±€977)",
      "Hidde vindt een week of langer eigenlijk te lang",
      "€887 is berekend met het basisticket (alleen koffer óf tas)",
      "Later in de zomer worden vluchten duurder",
    ],
  },
  {
    id: "lang-8-dagen", order: 3, seed: true, status: "open", by: "Cas",
    title: "Lange trip", dates: "Vanaf 21 juli", length: "8 dagen",
    pricePP: 956, priceNote: "Schatting uit de chat: huis ±€546 + vlucht ±€400", origin: "AMS",
    flight: "Transavia vanaf Schiphol · vlucht wordt duurder bij een langere periode",
    house: "Zelfde huis midden in de stad (±€300 per extra nacht voor het hele huis)",
    link: TRANSAVIA, linkLabel: "Vluchten zoeken bij Transavia",
    pros: [
      "3 dagen extra voor ±€196 meer per persoon",
      "Genoeg tijd voor activiteiten én uitrusten",
      "Kos is wat anders dan Texel: meer te doen",
    ],
    cons: [
      "Hidde vindt 8 dagen samen te lang (Texel was al lang genoeg)",
      "Vluchten worden duurder",
      "Lucas hoeft niet per se 8 nachten",
      "Precieze data nog niet vastgelegd",
    ],
  },
  {
    id: "eerste-14-19-juli", order: 4, seed: true, status: "afgevallen",
    statusNote: "Lucas en Cas kunnen dan niet.", by: "Hidde",
    title: "Eerste voorstel", dates: "14 – 19 juli", length: "5 nachten",
    pricePP: 777, priceNote: "Vlucht €380 (handbagage) + huis €397. Met ruimbagage €833", origin: "AMS",
    flight: "Transavia · met handbagagekoffer €380 pp, met ruimbagage €436 pp",
    house: "Huurcomplex · ★5,0 · 3 slaapkamers · 5 bedden · 2 badkamers",
    pros: ["Hoogst beoordeelde huis (★5,0)", "Vroeg in de zomer, vluchten nog relatief goedkoop"],
    cons: [
      "Lucas kan niet: Zwarte Cross, bruiloft op de 18e en school tot de 19e",
      "Cas heeft dan nog stage (vakantie vanaf 19 juli)",
      "2 mensen moeten samen in één bed",
    ],
  },
];

export const QUESTIONS = [
  {
    id: "bed-delen", order: 1, kind: "choice",
    text: "Is een bed of slaapbank delen oké als dat ±€130 pp scheelt?",
    context: "Lucas: een huis met gedeelde bedden is zo'n €800 goedkoper voor de hele groep. Shane heeft liever een eigen bed, Hidde vindt een twijfelaar delen niks.",
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
    choices: ["Tot €800", "Tot €900", "Tot €1000", "Maakt niet uit"],
  },
  {
    id: "wanneer-niet", order: 4, kind: "text",
    text: "Wanneer kun je in juli of augustus níet?",
    context: "School, stage, werk, evenementen. Timo moet nog vrij vragen, Lucas heeft evenementen voor school.",
  },
];
