import type { Country, Difficulty, DinnerSlot, Dish } from "./types";

export const dinnerSlots: Record<DinnerSlot, { label: string; short: string; tone: string }> = {
  apero: { label: "Apéro", short: "AP", tone: "#00b4d8" },
  entree: { label: "Entrée", short: "EN", tone: "#8ac926" },
  plat: { label: "Plat principal", short: "PL", tone: "#ff4d6d" },
  dessert: { label: "Dessert", short: "DE", tone: "#ffbe0b" },
  snacks: { label: "Snacks", short: "SN", tone: "#9d4edd" }
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const searchLinks = (query: string) => [
  {
    label: "Marmiton",
    query,
    url: `https://www.marmiton.org/recettes/recherche.aspx?aqt=${encodeURIComponent(query)}`
  },
  {
    label: "750g",
    query,
    url: `https://www.750g.com/recherche.htm?search=${encodeURIComponent(query)}`
  },
  {
    label: "CuisineAZ",
    query,
    url: `https://www.cuisineaz.com/recherche/recette?query=${encodeURIComponent(query)}`
  }
];

const recipeCards = (names: string[], difficulty: "Facile" | "Moyen" | "Challenge", story: string, shopping: string[]) =>
  names.map((name, index) => ({
    id: `${slugify(name)}-${slugify(difficulty)}-${index + 1}`,
    name,
    difficulty,
    story: index === 0 ? story : "Autre spécialité locale, choisie pour varier réellement les options sans répéter la même recette.",
    shopping,
    recipeUrl: `#recette-${slugify(name)}-${slugify(difficulty)}-${index + 1}`,
    recipeLinks: searchLinks(`${name} recette traditionnelle`),
    ingredients: [
      ...shopping,
      "sel fin",
      "poivre noir",
      index === 0 ? "huile d'olive ou beurre" : index === 1 ? "citron ou vinaigre doux" : "herbes fraîches"
    ],
    instructions: [
      `Préparer et peser les ingrédients principaux pour ${name.toLowerCase()}.`,
      "Ouvrir un des liens fiables pour vérifier les quantités exactes et les temps de cuisson.",
      "Cuire les éléments qui demandent du temps, puis laisser tiédir avant le transport si besoin.",
      difficulty === "Facile" ? "Privilégier une présentation simple, en portions faciles à servir." : "Assaisonner progressivement pour garder le goût du plat traditionnel.",
      "Servir dans un plat stable, avec une petite étiquette du pays et du niveau choisi."
    ]
  }));

const curatedDish = (
  name: string,
  difficulty: Difficulty,
  story: string,
  url: string,
  source: string,
  ingredients: string[],
  instructions: string[]
): Dish => ({
  id: `${slugify(name)}-${slugify(difficulty)}`,
  name,
  difficulty,
  story,
  shopping: ingredients,
  recipeUrl: `#recette-${slugify(name)}-${slugify(difficulty)}`,
  recipeLinks: [{ label: source, url, query: name }],
  ingredients,
  instructions
});

const austriaEntrees: Dish[] = [
  curatedDish(
    "Frittatensuppe",
    "Facile",
    "Soupe viennoise claire avec fines lanières de crêpes salées: locale, légère et facile à servir en petite entrée.",
    "https://www.austria.org/starters-sides/fritattensuppe",
    "Austria.org",
    ["farine", "lait", "oeuf", "bouillon de boeuf ou de légumes", "ciboulette", "sel"],
    ["Préparer une pâte à crêpes salée très fine.", "Cuire les crêpes, les rouler puis les couper en lanières.", "Réchauffer un bon bouillon et ajouter les lanières au dernier moment."]
  ),
  curatedDish(
    "Liptauer sur pain noir",
    "Facile",
    "Tartinade austro-hongroise au fromage frais, paprika, câpres et cornichons: parfaite avec du pain de seigle.",
    "https://www.okuto.fr/recettes-de-cuisine/recette/liptauer",
    "Okuto",
    ["fromage blanc ou faisselle égouttée", "beurre", "crème épaisse", "paprika doux", "cornichons", "câpres", "moutarde", "pain de seigle"],
    ["Mélanger le fromage blanc avec le beurre ramolli.", "Ajouter paprika, moutarde, câpres, cornichons et assaisonner.", "Réserver au frais puis servir sur pain noir ou bretzels."]
  ),
  curatedDish(
    "Erdäpfelsalat",
    "Facile",
    "Salade de pommes de terre autrichienne, tiède ou froide, liée au bouillon, vinaigre et moutarde plutôt qu'à la mayonnaise.",
    "https://cupofyum.com/recipes/austrian-potato-salad-erdapfelsalat",
    "Cup of Yum",
    ["pommes de terre à chair ferme", "bouillon", "vinaigre de cidre ou vin blanc", "moutarde de Dijon", "oignon rouge", "ciboulette"],
    ["Cuire les pommes de terre puis les trancher encore tièdes.", "Verser bouillon chaud, vinaigre, moutarde et huile.", "Laisser absorber, rectifier le sel et finir avec ciboulette."]
  ),
  curatedDish(
    "Grießnockerlsuppe",
    "Moyen",
    "Bouillon autrichien aux quenelles de semoule, très classique dans les auberges et facile à adapter en version végétarienne.",
    "https://saskgermancouncil.org/recipes/semolina-dumpling-soup-griessnockerlsuppe/",
    "Sask German Council",
    ["semoule fine de blé dur", "beurre", "oeufs", "noix de muscade", "bouillon", "persil", "ciboulette"],
    ["Travailler beurre, oeufs, semoule et muscade.", "Laisser reposer puis former des quenelles.", "Pocher doucement et servir dans un bouillon chaud."]
  ),
  curatedDish(
    "Salade de Tafelspitz",
    "Moyen",
    "Version froide et plus légère du grand classique viennois: boeuf poché, légumes, vinaigrette et herbes.",
    "https://www.austria.info/fr/recettes/salade-de-tafelspitz/",
    "Austria.info",
    ["boeuf à pot-au-feu ou reste de boeuf poché", "carottes", "céleri-rave", "poireau", "vinaigre", "huile", "ciboulette"],
    ["Pocher ou récupérer une viande de type pot-au-feu.", "Émincer finement avec légumes et herbes.", "Assaisonner avec une vinaigrette vive et servir frais."]
  ),
  curatedDish(
    "Schlutzkrapfen tyroliens",
    "Moyen",
    "Ravioles tyroliennes rustiques, souvent garnies d'épinards et fromage frais: très local et encore transportable.",
    "https://fr.tyrol.com/activites/culinaire/recettes/schlutzkrapfen",
    "Tyrol",
    ["farine de seigle ou blé", "oeuf", "épinards", "fromage frais", "oignon", "beurre", "parmesan ou fromage de montagne"],
    ["Préparer une pâte fine.", "Réaliser une farce épinards-fromage.", "Former les ravioles, pocher et servir avec beurre noisette."]
  ),
  curatedDish(
    "Kaspressknödel",
    "Challenge",
    "Quenelles pressées au fromage de montagne, spécialité tyrolienne servie avec salade ou dans un bouillon.",
    "https://fr.tyrol.com/activites/culinaire/recettes/kaspressknoedel",
    "Tyrol",
    ["pain rassis ou pain à knödel", "fromage de montagne", "oeufs", "lait", "oignon", "persil", "marjolaine", "beurre"],
    ["Tremper le pain avec lait, oeufs et aromates.", "Ajouter oignon revenu et fromage râpé.", "Former, aplatir et poêler jusqu'à coloration."]
  ),
  curatedDish(
    "Leberknödelsuppe",
    "Challenge",
    "Soupe traditionnelle aux quenelles de foie, plus typée et très auberge autrichienne.",
    "https://www.austria.org/starters-sides/leberkndelsuppe-liver-dumpling-soup",
    "Austria.org",
    ["foie de boeuf ou veau", "pain rassis", "oeufs", "oignon", "persil", "bouillon", "sel", "poivre"],
    ["Hacher le foie avec pain trempé et oignon revenu.", "Former des quenelles souples.", "Pocher dans le bouillon et servir très chaud."]
  ),
  curatedDish(
    "Tafelspitz en bouillon",
    "Challenge",
    "Le monument viennois: boeuf longuement poché, bouillon parfumé et garniture de racines.",
    "https://www.austria.info/fr/recettes/tafelspitz/",
    "Austria.info",
    ["boeuf à bouillir: paleron, macreuse ou gîte", "os à moelle optionnels", "carottes", "céleri-rave", "poireau", "oignon", "laurier"],
    ["Colorer l'oignon coupé à sec.", "Faire mijoter boeuf, os et légumes racines longuement.", "Servir une petite portion avec bouillon filtré et ciboulette."]
  )
];

const proposals = (easy: string[], medium: string[], hard: string[], slot: DinnerSlot) => {
  const baseStories: Record<DinnerSlot, string[]> = {
    apero: [
      "Format partageable, parfait pour lancer le dîner sans monopoliser la cuisine.",
      "Un classique de table familiale qui raconte bien le pays sans devenir intimidant.",
      "Version plus travaillée, idéale si la personne aime arriver avec un petit effet scène."
    ],
    entree: [
      "Entrée fraîche ou simple, souvent servie avant les plats plus généreux.",
      "Recette de bistrot ou de maison, avec un vrai marqueur local.",
      "Préparation plus longue, mais très Eurovision: mémorable dès la première bouchée."
    ],
    plat: [
      "Plat national ou régional qui tient bien au transport et nourrit vraiment.",
      "Un plat de repas du dimanche: plus généreux, plus lent, plus réconfortant.",
      "Le grand numéro culinaire du pays, à réserver aux mains motivées."
    ],
    dessert: [
      "Douceur populaire, facile à découper ou partager le soir du concours.",
      "Dessert de fête ou de café, avec une vraie identité locale.",
      "Pâtisserie iconique: le genre de dessert qui mérite ses douze points."
    ],
    snacks: [
      "Bouchée à grignoter, parfaite pour patienter pendant les performances.",
      "Petit format relevé, à attraper d'une main pendant que l'autre tient le verre.",
      "Snack signature du pays, à servir en milieu de soirée pour relancer."
    ]
  };
  const shoppingBySlot: Record<DinnerSlot, string[][]> = {
    apero: [
      ["pain", "herbes", "fromage ou legumes"],
      ["farine", "oeufs", "produit laitier"],
      ["pâte maison", "épices", "garniture"]
    ],
    entree: [
      ["legumes", "huile", "vinaigre"],
      ["bouillon", "herbes", "pain"],
      ["pâte", "farce", "sauce"]
    ],
    plat: [
      ["proteine", "legumes", "feculent"],
      ["viande ou alternative", "oignons", "epices"],
      ["ingredient signature", "sauce", "accompagnement"]
    ],
    dessert: [
      ["sucre", "farine", "beurre"],
      ["creme", "fruits ou noix", "pâte"],
      ["pâte fine", "garniture", "sirop ou glaçage"]
    ],
    snacks: [
      ["pain ou base", "garniture salée", "herbes"],
      ["pâte feuilletée", "fromage", "épices"],
      ["base maison", "garniture signature", "sauce"]
    ]
  };

  return [
    ...recipeCards(easy, "Facile", baseStories[slot][0], shoppingBySlot[slot][0]),
    ...recipeCards(medium, "Moyen", baseStories[slot][1], shoppingBySlot[slot][1]),
    ...recipeCards(hard, "Challenge", baseStories[slot][2], shoppingBySlot[slot][2])
  ];
};

const dishSet = (
  apEasy: string,
  apMedium: string,
  apHard: string,
  stEasy: string,
  stMedium: string,
  stHard: string,
  mainEasy: string,
  mainMedium: string,
  mainHard: string,
  deEasy: string,
  deMedium: string,
  deHard: string
) => ({
  apero: proposals(
    [apEasy, apMedium, apHard],
    [stEasy, stMedium, stHard],
    [mainEasy, mainMedium, deEasy],
    "apero"
  ),
  entree: proposals(
    [stEasy, stMedium, apEasy],
    [stHard, apMedium, apHard],
    [mainEasy, mainMedium, mainHard],
    "entree"
  ),
  plat: proposals(
    [mainEasy, mainMedium, stMedium],
    [mainHard, stHard, apHard],
    [deEasy, deMedium, deHard],
    "plat"
  ),
  dessert: proposals(
    [deEasy, deMedium, deHard],
    [apEasy, apMedium, stEasy],
    [apHard, stMedium, stHard],
    "dessert"
  ),
  snacks: proposals(
    [apEasy, stEasy, deEasy],
    [apMedium, stMedium, deMedium],
    [apHard, stHard, deHard],
    "snacks"
  )
});

const baseCountries: Country[] = [
  { code: "AL", name: "Albanie", flag: "AL", artist: "Alis", song: "Nân", color: "#e63946", dishes: dishSet("Byrek en bouchées", "Qofte albanaises", "Lakror miniature", "Salade shopska albanaise", "Tarator", "Pite me spinaq", "Tavë kosi", "Fërgesë de Tirana", "Flija", "Trileçe", "Revani", "Bakllava albanaise"), youtubeId: "b9AdRrA554o" },
  { code: "AM", name: "Arménie", flag: "AM", artist: "Simón", song: "Paloma Rumba", color: "#f77f00", dishes: dishSet("Lavash et fromages", "Eetch en verrines", "Tolma froide", "Salade de concombres au matsun", "Spas", "Manti arméni", "Khorovats", "Harissa", "Ghapama", "Gata", "Nazook", "Pakhlava arménienne"), youtubeId: "5EXoK-lgocw" },
  { code: "AU", name: "Australie", flag: "AU", artist: "Delta Goodrem", song: "Eclipse", color: "#0077b6", dishes: dishSet("Damper et dips", "Sausage rolls", "Mini meat pies", "Salade de betterave australienne", "Pumpkin soup", "Prawn cocktail", "Chicken parmi", "Barramundi grillé", "Roast lamb australien", "Anzac biscuits", "Lamingtons", "Pavlova"), youtubeId: "EUMCr1pnaMY" },
  { code: "AT", name: "Autriche", flag: "AT", artist: "Cosmó", song: "Tanzschein", color: "#d90429", dishes: dishSet("Liptauer sur pain noir", "Brettljause", "Mini knödel", "Frittatensuppe", "Salade de pommes de terre", "Kaspressknödel", "Wiener schnitzel", "Tafelspitz", "Rindsrouladen", "Kaiserschmarrn", "Apfelstrudel", "Sachertorte"), youtubeId: "zPGP9ZphxiY" },
  { code: "AZ", name: "Azerbaïdjan", flag: "AZ", artist: "Jiva", song: "Just Go", color: "#00a8e8", dishes: dishSet("Lavash aux herbes", "Qutab fromage", "Dolma mini", "Salade motal", "Dovga", "Kutab viande", "Plov simplifié", "Kebab lule", "Shah plov", "Shekerbura", "Pakhlava azérie", "Gogal sucré"), youtubeId: "iMDBPe25JhM" },
  { code: "BE", name: "Belgique", flag: "BE", artist: "Essyla", song: "Dancing on the Ice", color: "#ffba08", dishes: dishSet("Fromage de Herve et pain", "Croquettes crevettes", "Mini gaufres salées", "Chicons crus vinaigrette", "Soupe aux chicons", "Tomates crevettes", "Carbonnade flamande", "Waterzooi", "Moules-frites", "Spéculoos", "Gaufres de Liège", "Tarte au riz"), youtubeId: "9sfI4g6DWTU" },
  { code: "BG", name: "Bulgarie", flag: "BG", artist: "Dara", song: "Bangaranga", color: "#2a9d8f", dishes: dishSet("Lutenitsa et pain", "Banitsa roulée", "Kebapche mini", "Salade shopska", "Tarator bulgare", "Sarmi", "Kavarma", "Moussaka bulgare", "Kapama", "Mekitsi au miel", "Tikvenik", "Baklava bulgare"), youtubeId: "J3oGYo_mekw" },
  { code: "HR", name: "Croatie", flag: "HR", artist: "Lelek", song: "Andromeda", color: "#4361ee", dishes: dishSet("Pršut et fromage de Pag", "Pogača", "Soparnik bouchées", "Salade de poulpe", "Zagorska juha", "Štrukli salés", "Peka de poulet", "Pašticada", "Crni rižot", "Fritule", "Kremšnita", "Rožata"), youtubeId: "vl7Jqnw10sU" },
  { code: "CY", name: "Chypre", flag: "CY", artist: "Antigoni", song: "Jalla", color: "#fb8500", dishes: dishSet("Halloumi grillé", "Koupes", "Sheftalia mini", "Salade villageoise", "Trahana", "Kolokotes", "Souvla", "Afelia", "Kleftiko", "Loukoumia", "Daktyla", "Galaktoboureko chypriote"), youtubeId: "TzSs51BiQrE" },
  { code: "CZ", name: "Tchéquie", flag: "CZ", artist: "Daniel Zizka", song: "Crossroads", color: "#457b9d", dishes: dishSet("Chlebíčky", "Nakládaný hermelín", "Bramboráky", "Kulajda légère", "Soupe à l'ail", "Šunkofleky", "Svíčková", "Goulash tchèque", "Vepřo knedlo zelo", "Koláče", "Bublanina", "Medovník"), youtubeId: "6ea25aRGpLo" },
  { code: "DK", name: "Danemark", flag: "DK", artist: "Søren Torpegaard Lund", song: "Før vi går hjem", color: "#c1121f", dishes: dishSet("Smørrebrød hareng", "Frikadeller mini", "Tarteletter", "Concombres marinés", "Soupe de chou-fleur", "Æggekage", "Stegt flæsk", "Boller i karry", "Flæskesteg", "Drømmekage", "Risalamande", "Kransekage"), youtubeId: "xKzEP9dwoss" },
  { code: "EE", name: "Estonie", flag: "EE", artist: "Vanilla Ninja", song: "Too Epic to Be True", color: "#00b4d8", dishes: dishSet("Kiluvõileib", "Pirukad", "Kama dip", "Rosolje", "Seljanka", "Mulgipuder", "Verivorst", "Hapukapsas et porc", "Kilu vorm", "Kohuke maison", "Kringel", "Kama mousse"), youtubeId: "lOiWuol3t3o" },
  { code: "FI", name: "Finlande", flag: "FI", artist: "Linda Lampenius & Pete Parkkonen", song: "Liekinheitin", color: "#5e60ce", dishes: dishSet("Karjalanpiirakka", "Rieska et saumon", "Sienisalaatti", "Soupe de saumon froide", "Rosolli", "Lohikeitto", "Makaronilaatikko", "Karjalanpaisti", "Kalakukko", "Mustikkapiirakka", "Pulla", "Runebergintorttu"), youtubeId: "9bfwNIYb96Q" },
  { code: "FR", name: "France", flag: "FR", artist: "Monroe", song: "Regarde !", color: "#0055a4", dishes: dishSet("Gougères", "Tapenade", "Pissaladière", "Poireaux vinaigrette", "Soupe à l'oignon", "Quiche lorraine", "Croque-monsieur", "Blanquette", "Boeuf bourguignon", "Madeleines", "Clafoutis", "Tarte Tatin"), youtubeId: "ujoCYrvvTYQ" },
  { code: "GE", name: "Géorgie", flag: "GE", artist: "Bzikebi", song: "On Replay", color: "#ef233c", dishes: dishSet("Pkhali", "Lobiani mini", "Badrijani", "Salade géorgienne aux noix", "Chikhirtma", "Khinkali", "Chakhokhbili", "Khachapuri adjaruli", "Satsivi", "Gozinaki", "Pelamushi", "Churchkhela maison"), youtubeId: "coh-lygCINY" },
  { code: "DE", name: "Allemagne", flag: "DE", artist: "Sarah Engels", song: "Fire", color: "#fca311", dishes: dishSet("Bretzels et obatzda", "Kartoffelpuffer", "Currywurst mini", "Gurkensalat", "Kartoffelsuppe", "Maultaschen", "Bratwurst et choucroute", "Königsberger Klopse", "Sauerbraten", "Rote Grütze", "Bienenstich", "Schwarzwälder Kirschtorte"), youtubeId: "AzvRc3eH_rA" },
  { code: "GR", name: "Grèce", flag: "GR", artist: "Akylas", song: "Ferto", color: "#118ab2", dishes: dishSet("Tzatziki et pita", "Spanakopita", "Keftedes", "Horiatiki", "Avgolemono", "Dolmadakia", "Souvlaki", "Moussaka", "Pastitsio", "Kourabiedes", "Portokalopita", "Baklava grec"), youtubeId: "NGwNTd_DA9s" },
  { code: "IL", name: "Israël", flag: "IL", artist: "Noam Bettan", song: "Michelle", color: "#3a86ff", dishes: dishSet("Houmous et pita", "Boureka", "Falafel", "Salade israélienne", "Soupe de lentilles", "Sabich", "Shakshuka", "Ptitim aux légumes", "Cholent", "Malabi", "Rugelach", "Knafeh"), youtubeId: "xWCnWSoG8nI" },
  { code: "IT", name: "Italie", flag: "IT", artist: "Sal Da Vinci", song: "Per sempre sì", color: "#2d6a4f", dishes: dishSet("Bruschette", "Supplì", "Arancini", "Caprese", "Ribollita", "Parmigiana", "Pasta alla norma", "Risotto alla milanese", "Lasagne", "Panna cotta", "Tiramisu", "Cannoli"), youtubeId: "V406FAGkhyQ" },
  { code: "LV", name: "Lettonie", flag: "LV", artist: "Atvara", song: "Ēnā", color: "#9d0208", dishes: dishSet("Pain noir et fromage", "Piragi", "Sprats sur seigle", "Salade de betterave", "Soupe froide de betterave", "Sklandrausis salé", "Pois gris au lard", "Ragoût letton", "Karbonāde", "Biezpiena sieriņš", "Maizes zupa", "Alexander cake"), youtubeId: "6C2ivaB5D00" },
  { code: "LT", name: "Lituanie", flag: "LT", artist: "Lion Ceccah", song: "Sólo quiero más", color: "#70e000", dishes: dishSet("Pain noir à l'ail", "Kepta duona", "Varškės apkepas salé", "Šaltibarščiai", "Salade de hareng", "Kibinai", "Cepelinai", "Kugelis", "Balandėliai", "Tinginys", "Šakotis simplifié", "Medutis"), youtubeId: "0H-PXnbhG7A" },
  { code: "LU", name: "Luxembourg", flag: "LU", artist: "Eva Marija", song: "Mother Nature", color: "#00b4d8", dishes: dishSet("Tartines au Kachkéis", "Gromperekichelcher", "Mini Rieslingspaschtéit", "Salade de pommes de terre", "Bouneschlupp", "Kniddelen", "Judd mat Gaardebounen", "Träipen", "F'rell am Rèisleck", "Quetschentaart", "Bamkuch", "Rieslingspudding"), youtubeId: "DmVfJSRqgnI" },
  { code: "MT", name: "Malte", flag: "MT", artist: "Aidan", song: "Bella", color: "#ef476f", dishes: dishSet("Galletti et bigilla", "Pastizzi", "Qassatat", "Salade maltaise", "Soppa tal-armla", "Bragioli mini", "Timpana", "Stuffat tal-fenek", "Lampuki pie", "Imqaret", "Kannoli maltais", "Helwa tat-Tork"), youtubeId: "CW6mQLBh6Js" },
  { code: "MD", name: "Moldavie", flag: "MD", artist: "Satoshi", song: "Viva, Moldova!", color: "#ffbe0b", dishes: dishSet("Placinte au fromage", "Salade de vinete", "Mititei", "Zeama légère", "Salade de légumes marinés", "Colțunași", "Mămăligă brânză smântână", "Sarmale moldaves", "Tocană", "Cușma lui Guguță", "Prune farcies aux noix", "Cozonac"), youtubeId: "SViojHjNSzc" },
  { code: "ME", name: "Monténégro", flag: "ME", artist: "Tamara Živković", song: "Nova zora", color: "#d00000", dishes: dishSet("Priganice salées", "Njeguški pršut", "Kačamak bites", "Salade de tomates monténégrine", "Čorba de poisson", "Pita zeljanica", "Ćevapi", "Japrak", "Ispod sača", "Priganice au miel", "Krempita", "Palačinke aux noix"), youtubeId: "nuvy2d60HbI" },
  { code: "NO", name: "Norvège", flag: "NO", artist: "Jonas Lovv", song: "Ya Ya Ya", color: "#023e8a", dishes: dishSet("Lefse au fromage", "Brunost et crackers", "Mini fiskekaker", "Salade de concombre", "Sodd", "Rømmegrøt", "Fiskekaker", "Fårikål", "Pinnekjøtt", "Krumkake", "Riskrem", "Kvæfjordkake"), youtubeId: "MasllzWk_bQ" },
  { code: "PL", name: "Pologne", flag: "PL", artist: "Alicja", song: "Pray", color: "#dc2f02", dishes: dishSet("Ogórki et pain", "Zapiekanki mini", "Pierogi ruskie", "Mizeria", "Barszcz", "Żurek", "Bigos", "Gołąbki", "Kotlet schabowy", "Rogaliki", "Sernik", "Makowiec"), youtubeId: "q78cnYIoF9Y" },
  { code: "PT", name: "Portugal", flag: "PT", artist: "Bandidos do Cante", song: "Rosa", color: "#40916c", dishes: dishSet("Tremocos", "Pataniscas", "Croquetes", "Salada de polvo", "Caldo verde", "Peixinhos da horta", "Bacalhau à Brás", "Arroz de pato", "Cataplana", "Pastéis de nata", "Arroz doce", "Toucinho do céu"), youtubeId: "jyHaE6GqaaQ" },
  { code: "RO", name: "Roumanie", flag: "RO", artist: "Alexandra Căpitănescu", song: "Choke Me", color: "#ffb703", dishes: dishSet("Zacuscă et pain", "Salată de vinete", "Chiftele", "Salată de boeuf", "Ciorbă de perișoare", "Placinte", "Mici", "Sarmale", "Tochitură", "Papanași", "Cozonac", "Amandine"), youtubeId: "yn0YmI0dPb8" },
  { code: "SM", name: "Saint-Marin", flag: "SM", artist: "Senhit", song: "Superstar", color: "#48cae4", dishes: dishSet("Piadina", "Crostini romagnoli", "Cassoni mini", "Insalata di ceci", "Passatelli in brodo", "Nidi di rondine", "Strozzapreti", "Coniglio alla sammarinese", "Polenta e salsiccia", "Bustrengo", "Ciambella", "Torta Tre Monti"), youtubeId: "wOQe-fQSFxg" },
  { code: "RS", name: "Serbie", flag: "RS", artist: "Lavina", song: "Kraj mene", color: "#3a0ca3", dishes: dishSet("Ajvar et pain", "Gibanica", "Proja", "Šopska salata", "Čorba de haricots", "Sarma mini", "Ćevapi", "Prebranac", "Karađorđeva šnicla", "Vanilice", "Krofne", "Reforma torta"), youtubeId: "FJTLKBOOE98" },
  { code: "SE", name: "Suède", flag: "SE", artist: "Felicia", song: "My System", color: "#0077b6", dishes: dishSet("Knäckebröd et gravlax", "Toast Skagen", "Västerbottenpaj", "Pressgurka", "Soupe aux pois", "Janssons frestelse", "Köttbullar", "Pytt i panna", "Kroppkakor", "Chokladbollar", "Kladdkaka", "Prinsesstårta"), youtubeId: "ibbfS8iG450" },
  { code: "CH", name: "Suisse", flag: "CH", artist: "Veronica Fusaro", song: "Alice", color: "#e5383b", dishes: dishSet("Raclette bites", "Bündnerfleisch", "Malakoffs", "Salade de cervelas", "Soupe d'orge grisonne", "Rösti", "Älplermagronen", "Zürcher Geschnetzeltes", "Fondue moitié-moitié", "Meringues double crème", "Carac", "Nusstorte"), youtubeId: "PfpYGAzW5dM" },
  { code: "UA", name: "Ukraine", flag: "UA", artist: "Leléka", song: "Ridnym", color: "#ffd60a", dishes: dishSet("Pampushky ail", "Deruny", "Varenyky mini", "Salade Olivier ukrainienne", "Bortsch", "Holubtsi", "Poulet Kyiv", "Banosh", "Kotlety po-kyivsky", "Syrniki", "Medovik", "Kyiv cake"), youtubeId: "SoEXezpblAc" },
  { code: "GB", name: "Royaume-Uni", flag: "GB", artist: "Look Mum No Computer", song: "Eins, Zwei, Drei", color: "#03045e", dishes: dishSet("Cheddar scones", "Scotch eggs mini", "Sausage rolls", "Coronation chicken salad", "Leek and potato soup", "Welsh rarebit", "Shepherd's pie", "Fish and chips", "Beef Wellington", "Shortbread", "Sticky toffee pudding", "Trifle"), youtubeId: "niMKvJ-Itq8" }
];

export const countries: Country[] = baseCountries.map((country) =>
  country.code === "AT"
    ? {
        ...country,
        dishes: {
          ...country.dishes,
          entree: austriaEntrees
        }
      }
    : country
);

export const sourceNote =
  "Pays et artistes alignés sur les informations disponibles au 25 avril 2026: 35 participants annoncés pour Vienne 2026.";
