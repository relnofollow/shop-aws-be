export default class ProductsRepository {
  static async getProducts() {
    return [
      {
        id: "5b168ad0-0019-4df7-819d-75313cc024de",
        count: 5,
        price: 55.99,
        company: "MAGFORMERS",
        minAge: 3,
        title: "Magformers Amazing Construction Set",
        description:
          "Baustellen sind für Kinder besonders spannend: Fahrzeuge, Kräne, Maschinen und die verschiedenen Baumaterialien, aus denen Gebäude entstehen. Mit dem MAGFORMERS Amazing Construction Set können Kinder aus 50 gelben und orangefarbenen Bauelementen und vielen speziellen Bauelementen mit Unterstützung der Bauanleitung oder nach ihren Vorstellungen eigenen Kräne, verschiedene Baufahrzeuge und -maschinen und viele geometrische Figuren konstruieren.Kunststoff mit Neodymmagneten.",
        reviews: 1,
      },
      {
        id: "908d6e26-75cb-4ec0-aa70-ab4a69772caf",
        count: 6,
        price: 29.99,
        company: "Geomag",
        minAge: 3,
        title: "GEOMAG Classic Green Line 60tlg.",
        description:
          "Geomag 272 Classic-42 Teile-Magnetisches Konstruktionsspielzeug für Kinder-Green Line-Lernspiel aus 100% Recyclingkunststoff",
        reviews: 0,
      },
      {
        id: "99c79b84-f597-4936-90b5-6dcb09df6bbd",
        count: 10,
        price: 79.99,
        company: "fischertechnik",
        minAge: 9,
        title: "PROFI Green Energy",
        description:
          "Klima- und Umweltschutz spielerisch schon in jungen Jahren vermitteln Entdecken der Energieformen der Zukunft Gewinnung, Speicherung und Nutzung natürlicher Energieträger Nominiert für den Deutschen Spielzeugpreis 2021 in der Kategorie Spiel und Technik.",
        reviews: 4,
      },
      {
        id: "99d70ca1-6a9a-4bc6-9bc9-3033def4aaaf",
        count: 5,
        price: 20.99,
        company: "LEGO",
        minAge: 4,
        title: "LEGO® Classic 10696 Mittelgroße Bausteine-Box",
        description:
          "Für alle begeisterten Baumeister*innen sorgt die LEGO® Classics Mittelgroße Bausteine-Box (10696) für eine große Auswahl an verschiedenen Elementen, um die eigenen kreativen Projekte umzusetzen. In dem Set enthalten ist eine Grundplatte als praktischer Untergrund für alle Bauvorhaben. Außerdem verschiedenste Bausteine in 35 verschiedenen Farben die zu allerhand kreativen Umsetzungen eigener Ideen anregen. Reifen, Felgen, Fenster mit Rahmen und verschiedene Augenpaare sorgen für grenzenlosen Spielespaß. Alle abgebildeten Modelle lassen sich gleichzeitig aus den Steinen in der Box bauen. Eine bebilderte Bauanleitung mit Vorschlägen liegt dem Set bei.",
        reviews: 5,
      },
      {
        id: "4717ec5c-3643-4e9c-922d-f581d887314b",
        count: 6,
        price: 20.99,
        company: "LEGO",
        minAge: 7,
        title: "LEGO® Ninjago 71770 Zanes Golddrachen-Jet",
        description:
          "Für alle Ninjago-Fans kommt hier ein Bau-Erlebnis für spannende Ninjago-Abenteuer! Mit dem umfassenden Spielset LEGO® Ninjago Zanes Golddrachen-Jet (71770) können die Fans der TV-Serie „NINJAGO®: Crystallized“ die spannenden Szenen nachstellen und eigene Abenteuer erfinden. In der Luft entscheiden sich hier die Duelle zwischen Gut und Böse und es geht um nichts Geringeres, als das Schicksal von Ninjago-City und seiner Bewohner*innen.",
        reviews: 1,
      },
      {
        id: "39dd2bf8-d9eb-4448-aac4-e0f1bb9f6d95",
        count: 8,
        price: 12.99,
        company: "Mattel",
        minAge: 1,
        title: "Mega Bloks Bausteine-Beutel pink (60 Teile)",
        description:
          "Diese First Builders Big Building Bag von Mega Bloks und die auffallenden pink- und lilafarbenen Blöcke werden Ihrem Kind sicher gefallen. Die großen Bausteine mit hellgelben und lavendelfarbenen Akzenten sind perfekt für das Erstellen farbenfroher Schlösser oder wunderlicher Abenteuer.",
        reviews: 3,
      },
      {
        id: "19fbf7ab-3698-4890-87a5-7f4bcd4dbe69",
        count: 7,
        price: 75.99,
        company: "Ravensburger",
        minAge: 8,
        title: "GraviTrax Starter-Set Obstacle",
        description:
          'Mit diesem GraviTrax Starter-Set "Obstacle" von Ravensburger können die Kugeln auf actionreiche Hindernisparcoure geschickt werden! In diesem Set sind klassische GraviTrax-Elemente mit spannenden Action-Steinen vereint und regen zum Bauen von Bahnen an.',
        reviews: 0,
      },
      {
        id: "f8081216-1360-4206-86cc-7bdd81144cdb",
        count: 6,
        price: 36.99,
        company: "LEGO",
        minAge: 12,
        title: "LEGO® Architecture 21044 Paris",
        description:
          "Würdige die Pariser Architektur mit dem LEGO Architecture Skyline Set „Paris“ (LEGO-Nr.: 21044). Halte die Grandeur der Architektur von Paris mit diesem prächtigen LEGO® Architecture Skyline Set „Paris“ fest. In diesem Modell finden sich der ikonische Arc de Triomphe, die Champs-Elysées, das Tour Montparnasse, das Grand Palais, der Eiffelturm und der Louvre wieder.",
        reviews: 3,
      },
      {
        id: "b0fe1a68-5686-4514-a675-317f780f0515",
        count: 7,
        price: 53.99,
        company: "LEGO",
        minAge: 6,
        title: "LEGO® Super Mario 71368 Toads Schatzsuche – Erweiterungsset",
        description:
          "Das Erweiterungs-Set „Toads Schatzsuche“ (71368) von LEGO® Super Mario enthält Toad-Häsuer, einen Baum, eine Schatztruhe und bewegliche Plattformen. Durch die vielen coolen Funktionen und fünf Figuren wird die Spielwelt noch größer und aufregender. Mit der interaktiven Mario-Figur aus dem Starter-Set (71360) können zudem digitale Bonus-Punkte gesammelt werden. Dafür müssen die drei Zahlenblöcke gefunden werden, damit Mario in der richtigen Reihenfolge auf sie springen kann.",
        reviews: 4,
      },
      {
        id: "65c0defc-6b1b-40e7-9af3-5ff8d05af54d",
        count: 6,
        price: 15.99,
        company: "Eichhorn",
        minAge: 1,
        title: "Holzbausteine bunt, 100 Stück",
        description:
          "Perfekt für kleine Nachwuchs-Architekten: Die bunten Holzbausteine von Eichhorn animieren den Nachwuchs dazu, fantasievolle Bauwerke zu errichten. Holzbausteine von Eichhorn Aufbewahrungsbox mit Deckel und Kordel, 100 Bauklötze in verschiedenen Formen und Farben ab 12 Monaten",
        reviews: 0,
      },
    ];
  }

  static async getProductById(id) {
    const products = await ProductsRepository.getProducts();
    return products.find((product) => product.id === id);
  }
}
