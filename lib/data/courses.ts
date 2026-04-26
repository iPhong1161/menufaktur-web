export interface CourseData {
  id: string
  slug: string
  title: string
  category: string
  tagline: string
  description: string[]
  dateFormatted: string
  startTime: string
  endTime: string
  durationLabel: string
  location: string
  address: string
  price: number
  remainingCapacity: number
  photo_url: string | null
}

export const COURSES: CourseData[] = [
  {
    id: "1",
    slug: "kunst-der-pasta-manufaktur",
    title: "Die Kunst der Pasta-Manufaktur",
    category: "ITALIENISCHE MEISTERKLASSE",
    tagline:
      "Entdecken Sie die archaische Freude, Mehl und Eier in goldene Kunstwerke zu verwandeln.",
    description: [
      "In diesem exklusiven Kurs führen wir Sie tief in das Herz der italienischen Pastakultur ein. Es beginnt mit der Berührung: das richtige Verhältnis der Zutaten und das meditative Kneten, bis der Teig die perfekte Elastizität erreicht.",
      "Unter professioneller Anleitung formen Sie filigrane Tagliatelle, füllen zarte Ravioli mit saisonalen Kreationen und erlernen die Geheimnisse authentischer Saucen, die den Eigengeschmack der Pasta krönen. Wir lassen Saucen langsam simmern, bis sich die Aromen perfekt verbinden.",
    ],
    dateFormatted: "12. Juni 2026",
    startTime: "18:00",
    endTime: "22:30",
    durationLabel: "ca. 4,5 Std.",
    location: "Frankfurt-Bornheim",
    address: "Berger Straße 204, 60385 Frankfurt am Main",
    price: 89,
    remainingCapacity: 4,
    photo_url: null,
  },
  {
    id: "2",
    slug: "wein-wild-herbstliches-menue",
    title: "Wein & Wild: Herbstliches Menü",
    category: "WILD & WEIN",
    tagline: "Herbstliche Aromen, die nach Wald und Stille schmecken.",
    description: [
      "Der Herbst ist die Zeit der Tiefe: erdige Pilze, der Duft von Wild und die ersten Noten eines guten Rotweins. In diesem Kurs kombinieren wir die traditionelle Wildküche mit modernen Kochtechniken.",
      "Sie lernen, Reh und Hirsch fachgerecht zu verarbeiten, klassische Saucen auf Wildfond-Basis herzustellen und das Menü perfekt auf ausgesuchte Weine abzustimmen.",
    ],
    dateFormatted: "15. Juni 2026",
    startTime: "19:00",
    endTime: "23:00",
    durationLabel: "ca. 4 Std.",
    location: "Frankfurt-Bornheim",
    address: "Berger Straße 204, 60385 Frankfurt am Main",
    price: 125,
    remainingCapacity: 1,
    photo_url: null,
  },
  {
    id: "3",
    slug: "plant-based-gourmet-vegan",
    title: "Plant-Based Gourmet: Vegan kochen",
    category: "PLANT-BASED GOURMET",
    tagline:
      "Die Küche der Zukunft ist pflanzlich — und alles andere als einfach.",
    description: [
      "Plant-Based Cooking ist keine Einschränkung, sondern eine Erweiterung. Sie entdecken, wie Hülsenfrüchte, Fermentiertes und regionales Gemüse zu eleganten Gerichten werden.",
      "Von der Cashew-Béchamel über Jackfruit-Ragù bis zum Aquafaba-Mousse — dieser Kurs öffnet Ihnen eine neue Welt der Texturen und Umami-Aromen, komplett ohne tierische Produkte.",
    ],
    dateFormatted: "18. Juni 2026",
    startTime: "17:30",
    endTime: "21:30",
    durationLabel: "ca. 4 Std.",
    location: "Frankfurt-Bornheim",
    address: "Berger Straße 204, 60385 Frankfurt am Main",
    price: 95,
    remainingCapacity: 0,
    photo_url: null,
  },
  {
    id: "4",
    slug: "perfect-steak-grillen-braten",
    title: "Perfect Steak: Grillen & Braten",
    category: "FLEISCH & FEUER",
    tagline: "Das perfekte Steak ist eine Wissenschaft — und eine Freude.",
    description: [
      "Dry-aged oder wet-aged? Entrecôte oder Ribeye? Pfanne oder Grill? In diesem Kurs beantworten wir alle Ihre Fragen rund um Rindfleisch und die Maillard-Reaktion.",
      "Sie lernen, Fleisch nach Reifegrad zu beurteilen, die richtige Kerntemperatur zu treffen und Ruhephasen optimal zu nutzen — für ein Ergebnis, das jedes Steakhouse übertrifft.",
    ],
    dateFormatted: "22. Juni 2026",
    startTime: "18:30",
    endTime: "22:30",
    durationLabel: "ca. 4 Std.",
    location: "Frankfurt-Bornheim",
    address: "Berger Straße 204, 60385 Frankfurt am Main",
    price: 139,
    remainingCapacity: 6,
    photo_url: null,
  },
  {
    id: "5",
    slug: "franzoesische-patisserie-macarons",
    title: "Französische Patisserie: Macarons",
    category: "FRANZÖSISCHE PATISSERIE",
    tagline:
      "Filigran, präzise, unnachgiebig — die hohe Kunst der Patisserie.",
    description: [
      "Macarons verzeihen keine Nachlässigkeit: Luftfeuchtigkeit, Temperatur und die Qualität der Mandeln entscheiden über Glanz und Füßchen. Dieser Kurs macht Sie mit der französischen Konditoreikunst vertraut.",
      "Von der perfekten Meringue bis zu eleganten Ganaches erlernen Sie in kleiner Gruppe diese zarten Kunstwerke selbst herzustellen — und nehmen sie natürlich mit nach Hause.",
    ],
    dateFormatted: "25. Juni 2026",
    startTime: "14:00",
    endTime: "18:00",
    durationLabel: "ca. 4 Std.",
    location: "Frankfurt-Bornheim",
    address: "Berger Straße 204, 60385 Frankfurt am Main",
    price: 79,
    remainingCapacity: 2,
    photo_url: null,
  },
  {
    id: "6",
    slug: "sushi-masterclass-maki-nigiri",
    title: "Sushi Masterclass: Von Maki bis Nigiri",
    category: "JAPANISCHE KÜCHE",
    tagline: "Sushi ist Meditation — mit Reis, Fisch und Zeit.",
    description: [
      "In Japan dauert die Ausbildung zum Sushi-Meister Jahre. In diesem Kurs vermitteln wir die Grundlagen: die richtige Reiskonsistenz, das korrekte Schneiden von Fisch und die ruhige Technik der Rollenformung.",
      "Von Hosomaki über Temaki bis zum klassischen Nigiri — Sie verlassen den Kurs mit dem Handwerk und dem Verständnis, diese Kultur in Ihrer eigenen Küche weiterzupflegen.",
    ],
    dateFormatted: "30. Juni 2026",
    startTime: "18:00",
    endTime: "22:00",
    durationLabel: "ca. 4 Std.",
    location: "Frankfurt-Bornheim",
    address: "Berger Straße 204, 60385 Frankfurt am Main",
    price: 109,
    remainingCapacity: 5,
    photo_url: null,
  },
  {
    id: "7",
    slug: "quick-healthy-after-work-cooking",
    title: "Quick & Healthy: After-Work Cooking",
    category: "AFTER-WORK KOCHEN",
    tagline:
      "Gesund kochen bedeutet nicht, stundenlang am Herd zu stehen.",
    description: [
      "Nach einem langen Arbeitstag ist Energie knapp — aber gutes Essen muss trotzdem auf den Tisch. In diesem Kurs zeigen wir Ihnen Techniken und Routinen, mit denen Sie in 30–45 Minuten vollwertige Mahlzeiten zubereiten.",
      "Mise en place, smarte Meal-Prep-Strategien und nährstoffreiche Zutaten stehen im Fokus. Sie nehmen konkrete Wochenpläne und Rezepte mit nach Hause.",
    ],
    dateFormatted: "02. Juli 2026",
    startTime: "19:00",
    endTime: "21:30",
    durationLabel: "ca. 2,5 Std.",
    location: "Frankfurt-Bornheim",
    address: "Berger Straße 204, 60385 Frankfurt am Main",
    price: 75,
    remainingCapacity: 8,
    photo_url: null,
  },
  {
    id: "8",
    slug: "sauerteig-geheimnisse-brot-backen",
    title: "Sauerteig-Geheimnisse: Brot backen",
    category: "BACK-HANDWERK",
    tagline:
      "Ein lebendiger Teig, der Zeit braucht — und Geduld belohnt.",
    description: [
      "Sauerteig ist lebendig: Milliarden von Bakterien und Hefen verwandeln Mehl und Wasser in ein Brot mit Tiefe, Kruste und Halt. Dieser Kurs führt Sie vom Ansetzen des Starters bis zum fertig gebackenen Laib.",
      "Sie lernen die Chemie hinter dem Prozess zu verstehen, Fehlerbilder zu deuten und Ihren eigenen Rhythmus mit dem Sauerteig zu finden — für Brote, die im Supermarkt nicht zu kaufen sind.",
    ],
    dateFormatted: "05. Juli 2026",
    startTime: "10:00",
    endTime: "15:00",
    durationLabel: "ca. 5 Std.",
    location: "Frankfurt-Bornheim",
    address: "Berger Straße 204, 60385 Frankfurt am Main",
    price: 99,
    remainingCapacity: 1,
    photo_url: null,
  },
  {
    id: "9",
    slug: "thai-street-food-wuerzig-authentisch",
    title: "Thai Street Food: Würzig & Authentisch",
    category: "THAI STREET FOOD",
    tagline: "Scharf, süß, sauer, salzig — alles gleichzeitig.",
    description: [
      "Die thailändische Küche ist ein Balanceakt: Fischsauce, Limette, Palmzucker und Chilischoten müssen in perfektem Gleichgewicht stehen. In diesem Kurs lüften wir das Geheimnis dieser Präzision.",
      "Von der hausgemachten Currypaste über Pad Thai bis zu authentischen Suppen — Sie kochen vier Gänge Thai Street Food und verstehen, warum diese Küche weltweit so geliebt wird.",
    ],
    dateFormatted: "08. Juli 2026",
    startTime: "18:00",
    endTime: "22:00",
    durationLabel: "ca. 4 Std.",
    location: "Frankfurt-Bornheim",
    address: "Berger Straße 204, 60385 Frankfurt am Main",
    price: 85,
    remainingCapacity: 3,
    photo_url: null,
  },
]

export const COURSE_INCLUDES = [
  "Alle hochwertigen Zutaten & Utensilien",
  "Leihschürze für den Abend",
  "Wein, Mineralwasser & Espresso",
  "Digitales Rezeptbuch zum Nachkochen",
]

export const FOOD_NOTE =
  "Vegetarische Optionen sind bei uns Standard. Auf Wunsch bereiten wir gerne vegane oder glutenfreie Alternativen für Sie vor. Bitte teilen Sie uns dies bei der Buchung mit."

export const INSTRUCTOR = {
  name: "Chef Marco Ferretti",
  bio: "Mit über 15 Jahren Erfahrung in der gehobenen Gastronomie in Rom und Florenz bringt Marco nicht nur Technik, sondern echte Leidenschaft in die menufaktur. Sein Fokus liegt auf der Einfachheit und Qualität der Rohstoffe.",
}

export const COURSE_REVIEWS = [
  {
    author: "Saskia K.",
    text: "Ein unvergesslicher Abend! Marco hat eine so ruhige und kompetente Art. Man vergisst völlig die Zeit.",
    stars: 5,
  },
  {
    author: "Thomas M.",
    text: "Hätte nie gedacht, dass ich das selbst so gut hinbekomme. Die Qualität der Zutaten war einfach überragend.",
    stars: 5,
  },
  {
    author: "Dr. Elena V.",
    text: "Die Atmosphäre in der menufaktur ist magisch. Es fühlt sich an wie ein Abendessen unter Freunden, bei dem man nebenbei noch Profi-Tipps lernt.",
    stars: 5,
  },
]
