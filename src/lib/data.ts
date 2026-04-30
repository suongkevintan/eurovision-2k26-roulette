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
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const buildDish = (
  countryCode: string,
  countryName: string,
  slot: DinnerSlot,
  difficulty: Difficulty,
  index: number,
  name: string,
  story: string
): Dish => {
  const query = `${name} ${countryName} recette`;
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  return {
    id: `${countryCode.toLowerCase()}-${slot}-${slugify(difficulty)}-${index}`,
    name,
    difficulty,
    story,
    shopping: [],
    recipeUrl: url,
    recipeLinks: [{ label: "Voir la recette", url, query }],
    ingredients: [],
    instructions: []
  };
};

type DishInput = { name: string; story: string };
type SlotInput = { facile: DishInput[]; moyen: DishInput[]; challenge: DishInput[] };
type CountryDishInput = Record<DinnerSlot, SlotInput>;

const buildSlot = (
  countryCode: string,
  countryName: string,
  slot: DinnerSlot,
  input: SlotInput
): Dish[] => [
  ...input.facile.map((d, i) => buildDish(countryCode, countryName, slot, "Facile", i + 1, d.name, d.story)),
  ...input.moyen.map((d, i) => buildDish(countryCode, countryName, slot, "Moyen", i + 1, d.name, d.story)),
  ...input.challenge.map((d, i) => buildDish(countryCode, countryName, slot, "Challenge", i + 1, d.name, d.story))
];

const buildCountryDishes = (
  countryCode: string,
  countryName: string,
  input: CountryDishInput
): Record<DinnerSlot, Dish[]> => ({
  apero: buildSlot(countryCode, countryName, "apero", input.apero),
  entree: buildSlot(countryCode, countryName, "entree", input.entree),
  plat: buildSlot(countryCode, countryName, "plat", input.plat),
  dessert: buildSlot(countryCode, countryName, "dessert", input.dessert),
  snacks: buildSlot(countryCode, countryName, "snacks", input.snacks)
});

type CountryMeta = {
  code: string;
  name: string;
  flag: string;
  artist: string;
  song: string;
  color: string;
  youtubeId?: string;
  dishesInput: CountryDishInput;
};

const countriesData: CountryMeta[] = [
  {
    code: "AL", name: "Albanie", flag: "AL", artist: "Alis", song: "Nân", color: "#e63946", youtubeId: "b9AdRrA554o",
    dishesInput: {
      apero: {
        facile: [
          { name: "Olive me djathë të bardhë", story: "Olives noires marinées et fromage blanc albanais, le grignotage classique des kafenes de Tirana." },
          { name: "Speca turshi", story: "Petits piments doux confits au vinaigre, à piquer entre deux gorgées de raki." },
          { name: "Salcë kosi", story: "Dip de yaourt frais à l'ail et concombre, la cousine albanaise du tzatziki, à servir avec du pain." }
        ],
        moyen: [
          { name: "Byrek mini me djathë", story: "Petites parts de feuilleté au fromage blanc, l'apéro signature de toutes les fêtes albanaises." },
          { name: "Kaçkavall i pjekur", story: "Tranches de fromage de brebis kaçkavall poêlées jusqu'à dorer, à manger très chaudes." },
          { name: "Suxhuk i pjekur", story: "Saucisse sèche épicée tranchée et passée à la poêle, parfaite avec un verre de raki." }
        ],
        challenge: [
          { name: "Pasterma me arra", story: "Bœuf séché aux épices et noix, plusieurs jours de séchage avant de trancher fin." },
          { name: "Sufllaqe miniatures", story: "Mini-galettes farcies de viande grillée, oignon et tzatziki, version cocktail du street food de Tirana." },
          { name: "Pite me presh dhe gjizë", story: "Tourte fine au poireau et fromage frais découpée en bouchées, pâte fait maison oblige." }
        ]
      },
      entree: {
        facile: [
          { name: "Sallatë shqiptare", story: "Salade rustique tomate-concombre-oignon-fromage blanc, l'entrée de tous les déjeuners albanais." },
          { name: "Tarator shqiptar", story: "Soupe froide de yaourt, concombre et noix, parfaite l'été quand il fait chaud à Durrës." },
          { name: "Sallatë me speca të pjekur", story: "Salade de poivrons rôtis pelés, ail et huile d'olive, ultra-locale et fraîche." }
        ],
        moyen: [
          { name: "Çorbë me oriz dhe limon", story: "Soupe albanaise au riz et citron, légèrement liée à l'œuf, version locale de l'avgolemono." },
          { name: "Lakror i Korçës", story: "Petite tarte aux herbes sauvages et oignon nouveau, spécialité de Korçë." },
          { name: "Speca me gjizë", story: "Poivrons rôtis farcis au fromage frais et menthe, à servir tièdes en entrée." }
        ],
        challenge: [
          { name: "Patëllxhanë mbushur", story: "Aubergines évidées farcies riz, viande hachée et menthe, longuement mijotées." },
          { name: "Pispili", story: "Tourte salée au maïs, blettes et fromage, gâteau paysan du sud demandant un vrai tour de main." },
          { name: "Përshesh", story: "Soupe de pain mijotée avec beurre, fromage frais et fines herbes, tradition de berger." }
        ]
      },
      plat: {
        facile: [
          { name: "Qofte të fërguara", story: "Boulettes de viande hachée à la menthe et oignon, poêlées et servies avec riz et yaourt." },
          { name: "Mish me oriz", story: "Mijoté simple de viande et riz au safran, le réflexe des dîners en famille." },
          { name: "Speca të mbushur", story: "Poivrons farcis viande-riz-tomate, classique du déjeuner du dimanche." }
        ],
        moyen: [
          { name: "Fërgesë e Tiranës", story: "Ragoût d'été aux poivrons, tomates et fromage frais, mijoté en cocotte de terre." },
          { name: "Tavë krapi", story: "Carpe au four avec tomates, ail et persil, tradition du lac Shkodër." },
          { name: "Mish me lakra", story: "Agneau mijoté longuement avec chou et carottes, plat d'hiver des montagnes du nord." }
        ],
        challenge: [
          { name: "Tavë kosi", story: "Plat national: agneau et riz cuits sous une croûte d'œuf-yaourt qui doit dorer sans trancher." },
          { name: "Flija", story: "Crêpes fines empilées une à une au feu de bois, monument culinaire du nord albanais." },
          { name: "Pastiço shqiptar", story: "Gratin de macaroni à la viande et béchamel, version albanaise du pastitsio à monter en couches." }
        ]
      },
      dessert: {
        facile: [
          { name: "Reçel fiku", story: "Confiture de figues entières au sirop, à servir sur du yaourt épais avec une cuillère." },
          { name: "Hashure", story: "Bouillie de blé tendre au sucre, noix et grenade, dessert ancestral à partager." },
          { name: "Pestil rrushi", story: "Pâte de raisin séchée au soleil, une bouchée concentrée de soleil albanais." }
        ],
        moyen: [
          { name: "Petulla me mjaltë", story: "Beignets albanais croustillants servis avec miel et fromage frais, à partager chaud." },
          { name: "Sheqerpare", story: "Petits gâteaux ottomans imbibés de sirop, fondants en bouche." },
          { name: "Revani", story: "Gâteau à la semoule imbibé de sirop au citron, simple en apparence mais demande un bon dosage." }
        ],
        challenge: [
          { name: "Trileçe", story: "Gâteau aux trois laits arrivé via les Balkans, génoise gorgée de lait et nappée de caramel." },
          { name: "Bakllava shqiptare", story: "Baklava albanaise en pâte fine étirée à la main, garnie de noix et imbibée au sirop d'eau de fleur." },
          { name: "Kabuni", story: "Riz sucré aux raisins, noix et clou de girofle parfumé au bouillon de mouton, dessert royal." }
        ]
      },
      snacks: {
        facile: [
          { name: "Bukë me djathë e mjaltë", story: "Tranche de pain de campagne avec fromage blanc et miel, le goûter d'enfance." },
          { name: "Petulla të vogla", story: "Petits beignets nature à grignoter sucrés ou salés selon l'envie." },
          { name: "Reçel arrash", story: "Confiture de noix vertes confites au sirop, une cuillère sur un cracker fait l'affaire." }
        ],
        moyen: [
          { name: "Lakror i Pogradecit", story: "Petites parts de tourte aux blettes du lac d'Ohrid, super pour le grignotage." },
          { name: "Byrek me spinaq", story: "Bouchées de byrek aux épinards et oignon nouveau, finger food parfaite." },
          { name: "Qofte të ftohta", story: "Petites boulettes froides à la menthe à piquer en mode tapas." }
        ],
        challenge: [
          { name: "Pite me kungull", story: "Tourte au potiron râpé et yaourt en pâte fine étirée, dont l'étirement est un art." },
          { name: "Kadaif me arra", story: "Petits nids de cheveux d'ange au sirop et noix, à former un par un." },
          { name: "Sufllaqe sandwich", story: "Pita garnie de viande grillée, tzatziki et frites: le snack ultime des soirées albanaises." }
        ]
      }
    }
  },
  {
    code: "AM", name: "Arménie", flag: "AM", artist: "Simón", song: "Paloma Rumba", color: "#f77f00", youtubeId: "5EXoK-lgocw",
    dishesInput: {
      apero: {
        facile: [
          { name: "Soujoukh tranché", story: "Saucisse séchée arménienne aux épices, fines tranches sur du lavash chaud." },
          { name: "Tan glacé", story: "Boisson au yaourt fouetté et menthe en petits verres, l'apéro frais d'Erevan." },
          { name: "Chanakh à l'huile", story: "Cubes de fromage de brebis chanakh à l'huile d'olive et origan." }
        ],
        moyen: [
          { name: "Basturma", story: "Bœuf séché à l'ail, fenugrec et paprika, l'art de la charcuterie arménienne." },
          { name: "Boereg fromage", story: "Petits feuilletés au fromage et persil en pâte fine étirée maison." },
          { name: "Khorovats matnakash", story: "Mini-bouchées de poivrons et aubergines grillées au feu sur pain matnakash." }
        ],
        challenge: [
          { name: "Topik", story: "Boules de pommes de terre et pois chiches farcies oignons-tahin, monument apéro arménien." },
          { name: "Sini boereg", story: "Feuilleté plat au fromage cuit en grand plat rond, à découper en bouchées." },
          { name: "Lahmajun mini", story: "Mini-pizzas plates à la viande hachée et persil, pâte travaillée à la main." }
        ]
      },
      entree: {
        facile: [
          { name: "Eetch", story: "Salade tiède de boulgour, oignon et tomate, version arménienne du tabbouleh." },
          { name: "Salade matsun-concombre", story: "Concombre, ail, aneth et yaourt acidulé matsun, l'entrée fraîche par excellence." },
          { name: "Salade chanakh", story: "Cubes de fromage frais, tomate, concombre et menthe à l'huile d'olive." }
        ],
        moyen: [
          { name: "Spas", story: "Soupe au matsun, blé concassé et coriandre, l'âme du yaourt arménien chaud." },
          { name: "Avelouk soupe", story: "Soupe d'oseille de montagne et lentilles, plat de jeûne devenu signature." },
          { name: "Tjvjik", story: "Foie de veau sauté aux oignons, paprika et grenade, entrée généreuse." }
        ],
        challenge: [
          { name: "Tolma feuilles de vigne", story: "Petits rouleaux de feuilles de vigne farcis riz et herbes, longue patience." },
          { name: "Khash", story: "Bouillon de pieds de bœuf à l'ail très puissant, plat rituel d'hiver à boire chaud." },
          { name: "Manti pochés au yaourt", story: "Petits raviolis à la viande pochés et nappés de yaourt, ail et sumac." }
        ]
      },
      plat: {
        facile: [
          { name: "Khorovats", story: "Brochettes arméniennes de porc ou agneau marinées et grillées au feu de bois." },
          { name: "Plov arménien", story: "Riz pilaf aux fruits secs, abricots et noix, le grand classique de fête." },
          { name: "Kufteh boulettes", story: "Boulettes de viande aux herbes pochées en bouillon clair." }
        ],
        moyen: [
          { name: "Harissa", story: "Plat ancestral de blé pilé et poulet effiloché, mijoté des heures jusqu'à devenir crème." },
          { name: "Ghapama", story: "Citrouille farcie au riz, fruits secs et miel, cuite entière au four." },
          { name: "Kchuch légumes", story: "Cocotte d'aubergines, poivrons, tomates et viande au four en terrine." }
        ],
        challenge: [
          { name: "Sini manti", story: "Manti arméniens cuits au four en plat rond, servis avec yaourt-bouillon et sumac." },
          { name: "Iche tolma", story: "Sept légumes farcis au riz et viande (vigne, chou, poivron, tomate, aubergine, courgette, oignon)." },
          { name: "Kololik", story: "Boulettes de viande soufflée à l'air, technique ancestrale d'aération à la main." }
        ]
      },
      dessert: {
        facile: [
          { name: "Mouraba kydi", story: "Confiture de coing à la cardamome, à servir avec un café arménien serré." },
          { name: "Anushabour", story: "Soupe sucrée d'orge, fruits secs et grenade, dessert de Noël arménien." },
          { name: "Sujukh aux noix", story: "Chaîne de noix trempée dans un sirop de raisin doux, doucement séchée." }
        ],
        moyen: [
          { name: "Gata", story: "Gâteau plat fourré au khoriz beurré et sucré, motif gravé au peigne sur le dessus." },
          { name: "Nazook", story: "Brioche feuilletée à la farine sucrée, roulée puis tranchée en parts." },
          { name: "Pakhlava arménienne", story: "Baklava à la cannelle, plus riche que sa cousine grecque, sirop au miel." }
        ],
        challenge: [
          { name: "Kadaif arménien", story: "Cheveux d'ange au sirop, beurre et noix, à monter en nid individuel." },
          { name: "Cheoreg de Pâques", story: "Brioche tressée à la mahleb et fleur d'oranger, pétrissage long et délicat." },
          { name: "Anushabour cérémoniel", story: "Version royale aux 12 fruits secs, eau de rose et coulis de grenade." }
        ]
      },
      snacks: {
        facile: [
          { name: "Lavash beurre-thym", story: "Pain plat avec beurre fouetté et thym sauvage, roulé serré." },
          { name: "Tahn et matnakash", story: "Pain levain matnakash avec yaourt salé tahn, snack du quotidien." },
          { name: "Khaviar bademjan", story: "Tartinade d'aubergine fumée et tomate à étaler sur du pain." }
        ],
        moyen: [
          { name: "Lahmajoun individuel", story: "Petite pizza croustillante à la viande hachée et persil." },
          { name: "Boereg pommes de terre", story: "Triangles feuilletés farcis aux pommes de terre et oignons confits." },
          { name: "Soujoukh sandwich", story: "Pain matnakash garni de soujoukh poêlé, tomates et concombre." }
        ],
        challenge: [
          { name: "Jingyalov hats", story: "Pain plat farci de 15 à 20 herbes sauvages du Karabakh, le goûter-légende." },
          { name: "Bekhmes pestil", story: "Feuilles de pâte au sirop de raisin séchées au soleil, technique ancienne." },
          { name: "Mante au four", story: "Petits chapeaux de pâte à la viande au four, servis individuellement croustillants." }
        ]
      }
    }
  },
  {
    code: "AU", name: "Australie", flag: "AU", artist: "Delta Goodrem", song: "Eclipse", color: "#0077b6", youtubeId: "EUMCr1pnaMY",
    dishesInput: {
      apero: {
        facile: [
          { name: "Cabanossi tranches", story: "Saucisse séchée d'origine polonaise devenue aussie, à servir avec fromage et pickles." },
          { name: "Cheese & Jatz", story: "Cubes de cheddar tasmanien sur cracker Jatz, l'apéro 100% maison aussie." },
          { name: "Pumpkin scones", story: "Petits scones moelleux au potiron, recette signature de Lady Flo Bjelke-Petersen." }
        ],
        moyen: [
          { name: "Sausage rolls maison", story: "Friands à la chair à saucisse en pâte feuilletée, le pilier des party pies." },
          { name: "Mini meat pies", story: "Mini-tourtes individuelles à la viande hachée et oignons, ketchup obligatoire." },
          { name: "Devils on horseback", story: "Pruneaux farcis enroulés de bacon, grillés jusqu'à caramélisation." }
        ],
        challenge: [
          { name: "Smoked kangaroo carpaccio", story: "Filet de kangourou fumé et tranché extra-fin, huile de bush tomato." },
          { name: "Crab cakes", story: "Galettes de chair de crabe bleu, ciboulette et chapelure panko, à pocher dorées." },
          { name: "Bush tomato dip with damper", story: "Tartinade de tomates du désert sur damper grillé, twist autochtone." }
        ]
      },
      entree: {
        facile: [
          { name: "Prawn cocktail", story: "Crevettes tigrées avec sauce Marie-Rose dans un verre, classique des Christmas lunches." },
          { name: "Beetroot salad", story: "Salade de betterave râpée et pommes vertes, vinaigrette à la mayonnaise." },
          { name: "Garlic bread aussie", story: "Baguette beurrée à l'ail et persil, grillée au four jusqu'à dorer." }
        ],
        moyen: [
          { name: "Pumpkin soup", story: "Velouté de courge butternut au gingembre, crème fraîche et croûtons grillés." },
          { name: "Gravlax de saumon de Tasmanie", story: "Saumon mariné sel-sucre-aneth tranché fin, sauce moutarde douce." },
          { name: "Witlof à la macadamia", story: "Endives crues, fromage bleu et noix de macadamia grillées en salade." }
        ],
        challenge: [
          { name: "Sydney rock oysters Kilpatrick", story: "Huîtres rocheuses de Sydney gratinées au bacon et sauce Worcestershire." },
          { name: "Moreton Bay bug salad", story: "Salade de queues de cigales de mer du Queensland avec mangue et avocat." },
          { name: "Kingfish ceviche au yuzu", story: "Sériole crue au citron yuzu, gingembre et oignon nouveau, version Sydney." }
        ]
      },
      plat: {
        facile: [
          { name: "Sausages and mash", story: "Saucisses grillées sur écrasé de pommes de terre et oignons rissolés." },
          { name: "Spag bol aussie", story: "Spaghetti bolognaise version australienne avec carotte et céleri généreux." },
          { name: "Chicken parmigiana", story: "Escalope de poulet panée, sauce tomate et fromage gratiné: le pub classic." }
        ],
        moyen: [
          { name: "Lamb roast", story: "Gigot d'agneau rôti aux herbes avec pommes de terre et carottes au four." },
          { name: "Barramundi grillé", story: "Filet de barramundi à la peau croustillante, citron et beurre de macadamia." },
          { name: "Beef stroganoff aussie", story: "Bœuf émincé à la crème, champignons et paprika, sur riz blanc." }
        ],
        challenge: [
          { name: "Beef Wellington", story: "Filet de bœuf en croûte feuilletée avec duxelles de champignons, monument du dimanche." },
          { name: "Kangaroo loin grillé", story: "Râble de kangourou saisi rosé, sauce wattle seed et betteraves rôties." },
          { name: "Slow-cooked lamb shoulder", story: "Épaule d'agneau cuite huit heures au four basse température, jus brun au romarin." }
        ]
      },
      dessert: {
        facile: [
          { name: "Lamingtons", story: "Cubes d'éponge plongés dans le chocolat puis roulés dans la noix de coco." },
          { name: "Anzac biscuits", story: "Biscuits avoine, sirop d'érable et coco, créés pour les soldats Anzac." },
          { name: "Fairy bread", story: "Tartine au beurre couverte de centaines de mille, le snack des goûters d'enfants." }
        ],
        moyen: [
          { name: "Pavlova", story: "Meringue moelleuse à cœur tendre, crème fouettée et fruits frais, dessert national." },
          { name: "Sticky date pudding", story: "Pudding aux dattes nappé de sauce caramel chaude, à servir avec glace vanille." },
          { name: "Vanilla slice", story: "Pâte feuilletée superposée à crème pâtissière vanille et glaçage rose." }
        ],
        challenge: [
          { name: "Pavlova layered", story: "Pavlova en tour de plusieurs étages, fruits de la passion et meringue brûlée." },
          { name: "Caramel slice", story: "Trois étages biscuit-caramel-chocolat, équilibre technique fragile à la cuisson." },
          { name: "Trifle aussie", story: "Génoise imbibée de sherry, gelée, custard et crème fouettée en couches." }
        ]
      },
      snacks: {
        facile: [
          { name: "Vegemite toast", story: "Tranche de pain grillé beurrée puis tartinée fine de Vegemite salée." },
          { name: "Tim Tam", story: "Biscuits chocolatés à tremper dans le café pour le 'Tim Tam slam'." },
          { name: "Sao biscuit cheese", story: "Cracker Sao avec tranche de cheddar et pickle, snack de goûter." }
        ],
        moyen: [
          { name: "Chiko roll", story: "Friand frit géant à la viande, chou et carotte, le snack des fish & chip shops." },
          { name: "Dim sim aussie", story: "Boulette à la vapeur ou frite façon yum cha mais inventée à Melbourne." },
          { name: "Halal snack pack mini", story: "Mini-portion de frites recouvertes de viande kebab et trois sauces signature." }
        ],
        challenge: [
          { name: "Meat pie floater", story: "Tourte à la viande renversée dans un velouté de petits pois, plat d'Adélaïde." },
          { name: "Iced VoVo maison", story: "Biscuit aux deux bandes de fondant rose et ligne de gelée framboise." },
          { name: "Pavlova mini en pots", story: "Mini-pavlovas individuelles en pots avec fruits de la passion frais." }
        ]
      }
    }
  },
  {
    code: "AT", name: "Autriche", flag: "AT", artist: "Cosmó", song: "Tanzschein", color: "#d90429", youtubeId: "zPGP9ZphxiY",
    dishesInput: {
      apero: {
        facile: [
          { name: "Liptauer sur pain noir", story: "Tartinade au fromage blanc, paprika et câpres sur pain de seigle." },
          { name: "Brettljause", story: "Planche de charcuterie, fromages de montagne et radis noir, classique de Heuriger." },
          { name: "Salzstangerl au beurre", story: "Bâtonnets de pain feuilletés saupoudrés de gros sel et carvi." }
        ],
        moyen: [
          { name: "Erdäpfelpuffer", story: "Galettes de pomme de terre râpée croustillantes, à tremper dans la compote de pommes." },
          { name: "Speck und Kren", story: "Lard fumé du Tyrol avec raifort frais râpé sur pain noir." },
          { name: "Schmalzbrot", story: "Tartine au saindoux fouetté, oignon et lardons, brasserie viennoise." }
        ],
        challenge: [
          { name: "Beuschelpastete", story: "Mini-pâtés de poumon et cœur de veau en sauce, classique d'auberge." },
          { name: "Salzburger Bierkäse Bites", story: "Fromage de bière fermenté en bouchées avec moutarde douce." },
          { name: "Kasspatzln en bouchées", story: "Petits spätzle au fromage à servir en mini-cocottes." }
        ]
      },
      entree: {
        facile: [
          { name: "Frittatensuppe", story: "Bouillon clair avec lanières de crêpes salées, soupe viennoise emblématique." },
          { name: "Grüner Salat mit Kürbiskernöl", story: "Salade verte avec huile de pépins de courge styrienne pressée." },
          { name: "Erdäpfelsalat", story: "Salade de pommes de terre tiède au bouillon-vinaigre-moutarde, sans mayonnaise." }
        ],
        moyen: [
          { name: "Grießnockerlsuppe", story: "Bouillon aux quenelles de semoule à la muscade, classique d'auberge." },
          { name: "Tafelspitz salade", story: "Bœuf poché froid en salade aux racines, version légère du grand classique viennois." },
          { name: "Schlutzkrapfen", story: "Ravioles tyroliennes farcies épinards-fromage, beurre noisette." }
        ],
        challenge: [
          { name: "Kaspressknödel en bouillon", story: "Quenelles pressées au fromage de montagne servies dans un bouillon clair." },
          { name: "Leberknödelsuppe", story: "Soupe aux quenelles de foie de veau, plat d'auberge typé." },
          { name: "Tafelspitz en bouillon", story: "Bœuf longuement poché, bouillon parfumé, racines et os à moelle." }
        ]
      },
      plat: {
        facile: [
          { name: "Würstel mit Senf", story: "Saucisses viennoises pochées avec moutarde douce et bretzel chaud." },
          { name: "Frankfurter mit Erdäpfelsalat", story: "Saucisses Frankfurter et salade de pommes de terre, classique d'Heuriger." },
          { name: "Käsekrainer", story: "Saucisses fumées au fromage de Carinthie qui fond en bouche." }
        ],
        moyen: [
          { name: "Wiener Schnitzel", story: "Escalope de veau panée et frite au beurre, golden classic viennois." },
          { name: "Tafelspitz viennois", story: "Bœuf bouilli servi avec sauce raifort et épinards à la crème." },
          { name: "Rindsrouladen", story: "Rouleaux de bœuf farcis cornichon, lard et moutarde, sauce brune." }
        ],
        challenge: [
          { name: "Beuschel", story: "Ragoût de poumon et cœur de veau en sauce crémeuse au vinaigre." },
          { name: "Backhendl", story: "Poulet pané entier façon Wiener Schnitzel, cuisson maîtrisée au beurre." },
          { name: "Reindling", story: "Pain feuilleté de Carinthie aux noix, raisins et cannelle, plat de fêtes." }
        ]
      },
      dessert: {
        facile: [
          { name: "Apfelkompott", story: "Compote de pommes autrichienne parfumée à la cannelle et clou de girofle." },
          { name: "Topfenknödel", story: "Quenelles de fromage blanc roulées dans la chapelure beurrée et sucre." },
          { name: "Vanillekipferl", story: "Petits croissants sablés à la vanille et amande, biscuits de Noël viennois." }
        ],
        moyen: [
          { name: "Kaiserschmarrn", story: "Crêpe épaisse déchirée, sucrée et caramélisée avec compote de prunes." },
          { name: "Apfelstrudel", story: "Strudel aux pommes en pâte ultra-fine, raisins et cannelle, à doser au beurre." },
          { name: "Marillenknödel", story: "Boulettes de pommes de terre farcies à l'abricot, panées et sucrées." }
        ],
        challenge: [
          { name: "Sachertorte", story: "Génoise au chocolat avec marmelade d'abricot et glaçage tempéré, l'icône de Vienne." },
          { name: "Esterházy-Schnitten", story: "Mille-feuille hongro-autrichien aux noisettes et fondant glaçage marbré." },
          { name: "Punschkrapfen", story: "Petits cubes glacés au rhum, rose extérieur, intérieur génoise et confiture." }
        ]
      },
      snacks: {
        facile: [
          { name: "Käsestangen", story: "Allumettes au fromage feuilleté, snack à grignoter pendant le concours." },
          { name: "Salzbrezel", story: "Bretzel chaud au gros sel, classique de l'Heuriger viennois." },
          { name: "Topfenaufstrich", story: "Tartinade fromage blanc et baies rouges sur pain de seigle." }
        ],
        moyen: [
          { name: "Wurstsemmel", story: "Petit pain rond garni de saucisse viennoise et moutarde Dijon." },
          { name: "Gulaschsuppe en tasse", story: "Goulasch viennois en mini-tasse pour grignoter chaud entre deux performances." },
          { name: "Backhendl en bouchées", story: "Mini-morceaux de poulet panés croustillants au paprika doux." }
        ],
        challenge: [
          { name: "Powidltascherln", story: "Petites pâtes farcies à la marmelade de prunes powidl, frites et sucrées." },
          { name: "Krapfen mini", story: "Mini-beignets de Carnaval fourrés à la confiture d'abricots." },
          { name: "Brettljause Tyrolienne", story: "Planche-snack avec speck, fromage de montagne, pain de seigle et raifort." }
        ]
      }
    }
  },
  {
    code: "AZ", name: "Azerbaïdjan", flag: "AZ", artist: "Jiva", song: "Just Go", color: "#00a8e8", youtubeId: "iMDBPe25JhM",
    dishesInput: {
      apero: {
        facile: [
          { name: "Lavash et motal", story: "Pain plat azerbaïdjanais avec fromage frais motal et herbes du jardin." },
          { name: "Salade sumakh-tomate", story: "Salade de tomates au sumac, oignon rouge et coriandre fraîche." },
          { name: "Olives à la coriandre", story: "Olives noires marinées coriandre et zestes de citron persan." }
        ],
        moyen: [
          { name: "Qutab fromage-herbes", story: "Crêpes minces farcies fromage frais et herbes, pliées en demi-lune et grillées." },
          { name: "Qutab à la viande", story: "Crêpes minces à la viande hachée et oignons, grillées sur saj brûlant." },
          { name: "Düşbərə bouchées", story: "Mini-raviolis à la viande pochés en bouillon clair." }
        ],
        challenge: [
          { name: "Lülə kebab apéritif", story: "Boulettes longues de viande hachée aux épices, grillées sur brochettes plates." },
          { name: "Levengi en bouchées", story: "Pruneaux séchés farcis de noix et oignon caramélisé, façon levengi miniature." },
          { name: "Şorba pakhlava", story: "Mini-baklavas en losanges au safran, version cocktail à grignoter." }
        ]
      },
      entree: {
        facile: [
          { name: "Choban salatasi", story: "Salade de berger aux tomates, concombres et oignon rouge à la sumac et menthe." },
          { name: "Khyiar dolması", story: "Concombres marinés au sel et aneth, frais et croquants." },
          { name: "Plov froid en salade", story: "Salade tiède de riz au safran et fruits secs." }
        ],
        moyen: [
          { name: "Dovga", story: "Soupe au yaourt, herbes (épinard, coriandre, aneth) et riz, chaude ou froide." },
          { name: "Pita çörbəsi", story: "Soupe printanière à l'agneau et lentilles vertes parfumée à la menthe." },
          { name: "Kələm dolması", story: "Petites feuilles de chou farcies au riz et viande à la pruneau." }
        ],
        challenge: [
          { name: "Yarpaq dolması", story: "Feuilles de vigne farcies à la viande hachée, riz et estragon, à rouler serré." },
          { name: "Piti", story: "Soupe-pot d'agneau, pois chiches et fruits secs cuits au four en pot individuel." },
          { name: "Toyuq lülə", story: "Boulettes de poulet farcies aux noix et coriandre, grillées au feu de bois." }
        ]
      },
      plat: {
        facile: [
          { name: "Lülə kebab", story: "Brochettes de viande hachée aux oignons et épices, grillées sur charbons." },
          { name: "Tikə kebab", story: "Brochettes de cubes d'agneau marinés au yaourt et grenade." },
          { name: "Plov simplifié", story: "Riz au safran et beurre, viande effilochée et oignons frits dorés." }
        ],
        moyen: [
          { name: "Buğlama", story: "Ragoût d'agneau, oignons et tomates mijoté longuement à feu doux." },
          { name: "Lavangi de poulet", story: "Poulet farci aux noix concassées, oignons et raisins, rôti au four." },
          { name: "Kufta Bozbash", story: "Soupe-plat aux énormes boulettes farcies, pois chiches et pommes de terre." }
        ],
        challenge: [
          { name: "Şah plov", story: "Riz au safran emballé dans une croûte de pain lavash, ouvert en spectacle à table." },
          { name: "Lavangi de balıq", story: "Poisson de la Caspienne farci aux noix, oignons confits et grenade, cuit au four." },
          { name: "Plov sept étages", story: "Plov de poulet aux fruits secs en sept couches, technique royale azérie." }
        ]
      },
      dessert: {
        facile: [
          { name: "Şəkərbura", story: "Petits chaussons levés farcis aux noix et cardamome, simples mais sublimes." },
          { name: "Mütəkkə", story: "Petits cigares de pâte fine fourrés noix et sirop, version domestique." },
          { name: "Halva azəri", story: "Halva à la semoule et beurre clarifié au safran, à découper en losanges." }
        ],
        moyen: [
          { name: "Pakhlava bakouvienne", story: "Baklava aux noix et cardamome en losanges, sirop au safran intense." },
          { name: "Qoğal", story: "Petits pains roulés à la cardamome, anis et fenouil, au beurre fondu." },
          { name: "Firni", story: "Crème de riz au lait parfumée à la cannelle et fleur d'oranger." }
        ],
        challenge: [
          { name: "Şəkərbura cérémoniel", story: "Version tressée et gravée de motifs printaniers pour Novruz, technique délicate." },
          { name: "Şor qoğal", story: "Pains feuilletés salés au curcuma et cumin, formage en spirale au tour de main." },
          { name: "Pakhlava de Sheki", story: "Baklava géante de Sheki en pâte de riz et noix avec safran intense." }
        ]
      },
      snacks: {
        facile: [
          { name: "Kətə", story: "Pain plat fourré au beurre fondu et sucre, à découper en parts fines." },
          { name: "Kişmiş plov en tasse", story: "Mini-portion de riz au safran et raisins en tasse pour grignoter." },
          { name: "Limonad estragon", story: "Limonade pétillante à l'estragon Tarkhun, snack-boisson signature." }
        ],
        moyen: [
          { name: "Qutab mini cocktail", story: "Petits qutabs aux herbes pliés en mini-format, à manger d'une main." },
          { name: "Lülə wraps", story: "Lavash roulé autour de viande grillée, sumac et oignon rouge." },
          { name: "Khingal sauté", story: "Petites pâtes carrées sautées avec viande hachée et yaourt." }
        ],
        challenge: [
          { name: "Pirashki azéri", story: "Petits pains frits farcis à la pomme de terre épicée et coriandre." },
          { name: "Düşbərə chaud", story: "Bouillon-collation aux mini-raviolis à siroter dans des bols individuels." },
          { name: "Şəkərbura mini", story: "Mini-versions des chaussons de Novruz à présenter en tour." }
        ]
      }
    }
  },
  {
    code: "BE", name: "Belgique", flag: "BE", artist: "Essyla", song: "Dancing on the Ice", color: "#ffba08", youtubeId: "9sfI4g6DWTU",
    dishesInput: {
      apero: {
        facile: [
          { name: "Cubes de gouda et radis", story: "Petits cubes de gouda vieux belge et radis croquants, simple et frais." },
          { name: "Boudin de Liège mini", story: "Tranches de boudin de Liège poêlées avec compote de pommes." },
          { name: "Crevettes grises sur toast", story: "Toasts au beurre couverts de crevettes grises de la mer du Nord." }
        ],
        moyen: [
          { name: "Croquettes crevettes", story: "Petites croquettes panées aux crevettes grises, l'apéro Bruxellois." },
          { name: "Mini-fricadelles", story: "Mini-saucisses panées et frites, à tremper dans la mayo curry." },
          { name: "Mini-gaufres salées", story: "Petites gaufres au comté belge et lardons, version apéro." }
        ],
        challenge: [
          { name: "Anguille au vert miniature", story: "Anguille de la Schelde aux herbes et vin blanc en bouchées." },
          { name: "Tartare de bœuf belge", story: "Tartare au filet pur, câpres et sauce Worcestershire en mini-portions." },
          { name: "Croquettes au fromage maison", story: "Croquettes au comté belge avec persil frit, panures faites maison." }
        ]
      },
      entree: {
        facile: [
          { name: "Chicons crus vinaigrette", story: "Endives crues au vinaigre balsamique et œuf dur émietté." },
          { name: "Tomates crevettes", story: "Tomate évidée garnie de crevettes grises et mayonnaise maison." },
          { name: "Salade liégeoise", story: "Haricots verts, pommes de terre et lard, vinaigrette tiède au vinaigre." }
        ],
        moyen: [
          { name: "Soupe aux chicons", story: "Velouté d'endives à la pomme et bleu de Belgique." },
          { name: "Asperges à la flamande", story: "Asperges blanches sauce œuf dur, beurre et persil de Malines." },
          { name: "Croquettes parmesan", story: "Croquettes panées au parmesan en pâte béchamel, classique de brasserie." }
        ],
        challenge: [
          { name: "Anguille au vert", story: "Anguille mijotée dans un coulis d'herbes (oseille, persil, cresson), virtuosité belge." },
          { name: "Pâté gaumais", story: "Pâté en croûte de la Gaume au porc et lapin mariné au vinaigre." },
          { name: "Bouchée à la reine", story: "Vol-au-vent au poulet, champignons et quenelles en sauce blanche." }
        ]
      },
      plat: {
        facile: [
          { name: "Stoemp aux saucisses", story: "Purée rustique aux légumes (carotte, poireau) et saucisses grillées." },
          { name: "Boulets liégeois", story: "Boulettes de viande sauce sirop de Liège (le 'lapin sans lapin'), classique populaire." },
          { name: "Filet américain frites", story: "Tartare belge servi avec frites belges et pickles." }
        ],
        moyen: [
          { name: "Carbonnade flamande", story: "Bœuf mijoté à la bière brune, oignons et pain à la moutarde." },
          { name: "Waterzooi", story: "Suprême de poulet ou poisson en velouté de poireaux, carottes et crème, plat de Gand." },
          { name: "Moules-frites", story: "Moules de Zélande marinières et frites, le plat-état d'esprit national." }
        ],
        challenge: [
          { name: "Lapin à la geuze", story: "Lapin braisé à la geuze de Bruxelles, pruneaux et oignons grelot." },
          { name: "Konijn op z'n Vlaams", story: "Lapin flamand avec spéculoos écrasés dans la sauce, technique à la flamande." },
          { name: "Anguilles à l'escavèche", story: "Anguilles frites marinées au vinaigre et oignons, plat wallon." }
        ]
      },
      dessert: {
        facile: [
          { name: "Spéculoos maison", story: "Biscuits cannelle-cassonade épais à découper après cuisson." },
          { name: "Cuberdons", story: "Bonbons-clochettes violets au sirop sucré, à laisser fondre." },
          { name: "Mousse au chocolat Côte d'Or", story: "Mousse aux œufs et chocolat noir 70%, classique des dimanches." }
        ],
        moyen: [
          { name: "Tarte au riz", story: "Tarte au riz cuit au lait à la cannelle et œuf, spécialité de Verviers." },
          { name: "Couque de Dinant", story: "Biscuit dur au miel moulé en relief, à grignoter avec un café." },
          { name: "Tarte au sucre", story: "Tarte briochée nappée de cassonade caramélisée, plat de fête en Wallonie." }
        ],
        challenge: [
          { name: "Gaufres de Liège", story: "Gaufres en pâte levée avec perles de sucre qui caramélisent à la cuisson." },
          { name: "Couque de Verviers", story: "Couque feuilletée en pâte longue, aux épices à pain et cassonade." },
          { name: "Pain à la grecque", story: "Pâte brioche aux perles de sucre et cannelle, technique boulangère bruxelloise." }
        ]
      },
      snacks: {
        facile: [
          { name: "Frites belges", story: "Frites en double cuisson dans la graisse de bœuf, mayo et samouraï." },
          { name: "Pralines belges", story: "Pralines au chocolat à grignoter pendant le concours." },
          { name: "Speculoos pâte à tartiner", story: "Tartine au pain de mie avec pâte de spéculoos." }
        ],
        moyen: [
          { name: "Boulet liégeois mini", story: "Mini-boulet en sauce sirop de Liège dans une cuillère apéritif." },
          { name: "Frikadel à l'oignon", story: "Saucisse frite hollando-belge avec compote d'oignon." },
          { name: "Tartare-frites en cuillère", story: "Mini-portion de filet américain et frites en cuillère apéro." }
        ],
        challenge: [
          { name: "Boulet sauce lapin", story: "Snack mini avec boulet liégeois en sauce concentrée et croûton." },
          { name: "Crevettes grises sur gaufrette", story: "Mini-gaufre salée garnie de crevettes grises et mayonnaise." },
          { name: "Anguille fumée sur blini", story: "Bouchée d'anguille fumée à la vapeur sur blini de la mer du Nord." }
        ]
      }
    }
  },
  {
    code: "BG", name: "Bulgarie", flag: "BG", artist: "Dara", song: "Bangaranga", color: "#2a9d8f", youtubeId: "J3oGYo_mekw",
    dishesInput: {
      apero: {
        facile: [
          { name: "Lutenitsa et pain", story: "Tartinade rouge aux poivrons rôtis et tomates, signature des étés bulgares." },
          { name: "Sirene et concombre", story: "Cubes de fromage de brebis sirene avec concombre frais." },
          { name: "Olives à la sarriette", story: "Olives noires marinées à l'huile et sarriette de Pirin." }
        ],
        moyen: [
          { name: "Banitsa rolls", story: "Roulés de pâte filo au fromage frais et œufs, parts apéritif." },
          { name: "Kebapche mini", story: "Petites saucisses sans peau de viande hachée aux épices, grillées." },
          { name: "Kavarma en cuillère", story: "Mini-portions de ragoût de porc, oignons et paprika doux." }
        ],
        challenge: [
          { name: "Sarmi feuilles de vigne", story: "Feuilles de vigne farcies au riz et menthe en mini-bouchées." },
          { name: "Pasterma maison", story: "Bœuf séché maison aux épices bulgares à trancher fin." },
          { name: "Kashkaval pané", story: "Tranches de fromage kashkaval panées et frites, golden et fondant." }
        ]
      },
      entree: {
        facile: [
          { name: "Shopska salata", story: "Tomates, concombres, oignon, poivron et fromage râpé sirene, drapeau bulgare comestible." },
          { name: "Tarator", story: "Soupe froide au yaourt, concombre, ail, aneth et noix, l'été bulgare." },
          { name: "Salata snezhanka", story: "Salade Blanche-Neige au yaourt épais et concombres, ail et noix." }
        ],
        moyen: [
          { name: "Bob chorba", story: "Soupe aux haricots blancs, paprika fumé et menthe sèche." },
          { name: "Tarator chaud aux orties", story: "Variante chaude du tarator aux orties et fromage frais, plat printanier." },
          { name: "Kyufte au four", story: "Boulettes de viande au cumin gratinées avec sauce tomate et fromage." }
        ],
        challenge: [
          { name: "Sarmi bulgares", story: "Feuilles de vigne ou chou farcies au riz et viande, longuement mijotées." },
          { name: "Patladjan na fournata", story: "Aubergines farcies au riz, oignon et tomate, gratinées." },
          { name: "Spanachena banitsa", story: "Banitsa épaisse aux épinards, fromage et œuf en couches superposées." }
        ]
      },
      plat: {
        facile: [
          { name: "Kebapche grillé", story: "Saucisses sans peau de viande hachée, grillées et servies avec frites bulgares." },
          { name: "Kyufte char-grill", story: "Boulettes de viande aplaties grillées au feu de bois." },
          { name: "Pileshko s ris", story: "Poulet mijoté au paprika et riz, plat-réflexe des dimanches." }
        ],
        moyen: [
          { name: "Kavarma", story: "Ragoût bulgare de porc, oignons, paprika et tomates en pot de terre." },
          { name: "Moussaka bulgare", story: "Pommes de terre et viande hachée gratinées avec yaourt-œuf, version balkanique." },
          { name: "Kapama", story: "Pot de viandes mélangées (porc, agneau, poulet) avec riz et choucroute." }
        ],
        challenge: [
          { name: "Drob sarma", story: "Plat de fête à base d'agneau haché, riz et abats, gratiné au yaourt." },
          { name: "Cheverme", story: "Agneau entier rôti à la broche, technique des bergers de Rhodopes." },
          { name: "Tikvenik salé", story: "Tourte au potiron salée en pâte fine étirée à la main, garnie d'agneau." }
        ]
      },
      dessert: {
        facile: [
          { name: "Mekitsa", story: "Beignets bulgares à servir avec confiture, miel ou yaourt." },
          { name: "Tikvenik", story: "Tourte au potiron râpé, noix et cannelle en pâte filo fine." },
          { name: "Sladko de pétales de rose", story: "Confiture aux pétales de rose, à manger sur la cuillère." }
        ],
        moyen: [
          { name: "Garash torta", story: "Gâteau au chocolat et noisettes, génoise sans farine, glaçage chocolat amer." },
          { name: "Krem karamel", story: "Crème renversée au caramel à la cuillère." },
          { name: "Pita de Plovdiv", story: "Brioche au sirop de roses et noix, dessert de Plovdiv." }
        ],
        challenge: [
          { name: "Baklava bulgare", story: "Baklava aux noix et sirop léger à la rose, technique fine de pâte filo." },
          { name: "Kadaif au sirop", story: "Cheveux d'ange roulés autour de noix, sirop épicé à la cardamome." },
          { name: "Princessa torta", story: "Gâteau royal multi-couches noisette-chocolat-meringue." }
        ]
      },
      snacks: {
        facile: [
          { name: "Banitsa au boza", story: "Bouchée tradition bulgare de banitsa accompagnée de boza fermentée." },
          { name: "Geyak au sésame", story: "Bagel bulgare cuit au four, snack populaire des marchés." },
          { name: "Sirene sur pain noir", story: "Tartine de fromage sirene avec lutenitsa et tranche de tomate." }
        ],
        moyen: [
          { name: "Princess sandwich", story: "Tartine grillée au four avec viande hachée, fromage et œuf." },
          { name: "Sirene burek", story: "Petits paniers de pâte feuilletée au sirene gratiné." },
          { name: "Kebapche-pita", story: "Mini-pita garnie de kebapche grillé, oignon rouge et tomate." }
        ],
        challenge: [
          { name: "Tikvenik mini", story: "Mini-tourtes individuelles au potiron, à servir avec yaourt frais." },
          { name: "Kasha bulgare", story: "Bouillie de blé concassé au beurre et fromage frais, snack rustique." },
          { name: "Banitsa du soir", story: "Banitsa épaisse aux épinards, fromage et orties, technique fine de filage." }
        ]
      }
    }
  },
  {
    code: "HR", name: "Croatie", flag: "HR", artist: "Lelek", song: "Andromeda", color: "#4361ee", youtubeId: "vl7Jqnw10sU",
    dishesInput: {
      apero: {
        facile: [
          { name: "Pršut tranches", story: "Jambon cru séché de Dalmatie tranché fin, à servir avec figues et pain." },
          { name: "Slavonski sir et kulen", story: "Fromage frais de Slavonie et tranches de saucisson kulen pimenté." },
          { name: "Sardines à l'huile dalmates", story: "Petites sardines marinées à l'huile d'olive et romarin de l'île de Hvar." }
        ],
        moyen: [
          { name: "Pogača istrienne", story: "Pain plat istrien à l'huile d'olive et romarin, à découper en bouchées." },
          { name: "Soparnik mini", story: "Tarte fine aux blettes de Poljica, version cocktail." },
          { name: "Pršut sur figues", story: "Bouchées de jambon cru et figue fraîche au miel, été dalmate." }
        ],
        challenge: [
          { name: "Crni rižot en cuillère", story: "Risotto noir à l'encre de seiche en cuillère, technique du timing parfait." },
          { name: "Brodet en verrine", story: "Soupe de poisson dalmate en mini-portion, parfumée au vin et tomate." },
          { name: "Pašticada en mini-portion", story: "Bœuf braisé au vin de Dalmatie en mini-cocottes, mariné 48h." }
        ]
      },
      entree: {
        facile: [
          { name: "Salade de poulpe", story: "Poulpe poché refroidi, pommes de terre, oignon rouge et persil à l'huile d'olive." },
          { name: "Salade istrijanska", story: "Tomates, mozzarella istrienne, basilic et huile d'olive de Buje." },
          { name: "Šparoge sa jajima", story: "Asperges sauvages d'Istrie sautées aux œufs, l'entrée du printemps." }
        ],
        moyen: [
          { name: "Manestra istrienne", story: "Soupe rustique aux haricots, maïs et pomme de terre, plat du quotidien." },
          { name: "Maneštra od bobići", story: "Soupe au maïs frais et lardons fumés, classique istrien." },
          { name: "Štrukli salés bouillis", story: "Petits chaussons de pâte fine farcis fromage frais, pochés et nappés de crème." }
        ],
        challenge: [
          { name: "Štrukli au four", story: "Štrukli gratiné en plat à la crème fraîche, plat-trésor du Zagorje." },
          { name: "Brodet poisson", story: "Soupe-ragoût de poissons dalmates au vin et polenta, mijoté lentement." },
          { name: "Crni rižot", story: "Risotto noir à l'encre de seiche, art du dosage du bouillon." }
        ]
      },
      plat: {
        facile: [
          { name: "Ćevapi", story: "Petites saucisses sans peau aux épices grillées avec oignon cru et lepinja." },
          { name: "Sarma croate", story: "Choux fermenté farci de viande hachée et riz, mijoté au paprika." },
          { name: "Krumpiri pod pekom", story: "Pommes de terre cuites sous une cloche en fonte, plat de Dalmatie." }
        ],
        moyen: [
          { name: "Peka de poulet", story: "Poulet et légumes cuits sous cloche en fonte sur braises, technique des konobas." },
          { name: "Janjetina sa raznja", story: "Agneau de Dalmatie rôti à la broche, à découper en parts." },
          { name: "Žgvacet de chevreau", story: "Ragoût de chevreau istrien aux pommes de terre et vin Teran." }
        ],
        challenge: [
          { name: "Pašticada", story: "Bœuf de Dalmatie mariné 48h puis mijoté au vin doux, gnocchis maison obligatoires." },
          { name: "Crni rižot festif", story: "Risotto noir aux seiches entières et calmars, art du dosage du bouillon." },
          { name: "Soparnik dalmate", story: "Tarte géante aux blettes en pâte fine étirée à la main, IGP de Poljica." }
        ]
      },
      dessert: {
        facile: [
          { name: "Fritule", story: "Petits beignets dalmates au rhum et raisins, à servir saupoudrés de sucre glace." },
          { name: "Buhtle", story: "Brioches farcies à la confiture, cuites côte à côte au four." },
          { name: "Štrudla od jabuka", story: "Strudel aux pommes croate à la cannelle et chapelure beurrée." }
        ],
        moyen: [
          { name: "Kremšnita de Samobor", story: "Mille-feuille à la crème vanille en deux couches feuilletées, IGP de Samobor." },
          { name: "Rožata", story: "Crème renversée dalmate au rhum et zeste de citron, classique de Dubrovnik." },
          { name: "Orahnjača", story: "Brioche roulée garnie de pâte de noix au rhum et cannelle." }
        ],
        challenge: [
          { name: "Makovnjača", story: "Brioche roulée à la pâte de pavot moulu et miel, technique de roulage à maîtriser." },
          { name: "Bajadera", story: "Confiseries fondantes au cacao et noisettes, étoile de Zagreb." },
          { name: "Croatica torta", story: "Gâteau royal multi-couches noix-chocolat-meringue à monter avec patience." }
        ]
      },
      snacks: {
        facile: [
          { name: "Burek mini", story: "Petites parts de feuilleté à la viande ou au fromage, snack des marchés." },
          { name: "Pizza istrijanska", story: "Pizza fine à l'huile d'olive, jambon cru et roquette d'Istrie." },
          { name: "Kifle nature", story: "Petites brioches en croissant à grignoter avec confiture." }
        ],
        moyen: [
          { name: "Štrukli salés en cuillère", story: "Mini-portions de štrukli crémeux au fromage en cuillère apéritif." },
          { name: "Paprenjaci", story: "Petits biscuits au poivre et noix venus de Hvar, snack salé-sucré." },
          { name: "Mini-fritule au miel", story: "Mini-beignets dalmates au miel et zestes d'orange, à grignoter chauds." }
        ],
        challenge: [
          { name: "Pršut wrap aux figues", story: "Wrap roulé au pršut, fromage frais et figues séchées de Hvar." },
          { name: "Crni rižot mini", story: "Mini-portion de risotto noir en bouchée, à servir tiède sur cuillère." },
          { name: "Pašticada en bouchée", story: "Bouchées de bœuf braisé au vin doux servies sur gnocchis frits." }
        ]
      }
    }
  },
  {
    code: "CY", name: "Chypre", flag: "CY", artist: "Antigoni", song: "Jalla", color: "#fb8500", youtubeId: "TzSs51BiQrE",
    dishesInput: {
      apero: {
        facile: [
          { name: "Halloumi grillé", story: "Tranches de halloumi grillées avec menthe fraîche et citron, l'apéro chypriote." },
          { name: "Olives à la coriandre", story: "Olives vertes craquées marinées coriandre, ail et zeste de citron." },
          { name: "Tahini avec pita", story: "Crème de sésame chypriote au citron et ail à servir avec pita chaude." }
        ],
        moyen: [
          { name: "Talattouri", story: "Cousin chypriote du tzatziki, yaourt épais, concombre et menthe sèche." },
          { name: "Loukaniko grillé", story: "Saucisse de porc fumée au coriandre et vin rouge, tranchée à la poêle." },
          { name: "Koupes mini", story: "Petites bombes de boulgour farcies à la viande hachée, frites dorées." }
        ],
        challenge: [
          { name: "Sheftalia mini", story: "Petites saucisses chypriotes au crépine, viande hachée et persil grillées." },
          { name: "Tarte au halloumi", story: "Tarte au halloumi et menthe sur pâte fine, technique du fromage qui ne fond pas." },
          { name: "Carpaccio de poulpe à la chypriote", story: "Poulpe poché refroidi tranché extra-fin, huile et origan séché." }
        ]
      },
      entree: {
        facile: [
          { name: "Horiatiki chypriote", story: "Salade villageoise tomate-concombre-feta-olives, version chypriote au halloumi." },
          { name: "Tomatosalata", story: "Salade de tomates anciennes au capres, oignon et origan." },
          { name: "Salade de fèves frites", story: "Fèves séchées trempées et frites jusqu'à craquantes, en salade au citron." }
        ],
        moyen: [
          { name: "Trahanas", story: "Soupe à base de blé fermenté et yaourt, parfumée au halloumi fondu." },
          { name: "Soupa louvana", story: "Soupe de pois cassés à l'huile d'olive et citron, plat du Carême." },
          { name: "Kolokotes au four", story: "Petits pâtés à la citrouille, blé concassé et raisins secs." }
        ],
        challenge: [
          { name: "Avgolemono chypriote", story: "Soupe au poulet, riz et œuf-citron, ramené à la chypriote avec menthe sèche." },
          { name: "Pourgouri pilafi", story: "Pilaf de blé concassé aux vermicelles et bouillon de poulet." },
          { name: "Tava de Larnaca en entrée", story: "Mini-portion d'agneau-cumin-tomate cuite en cocotte de terre." }
        ]
      },
      plat: {
        facile: [
          { name: "Souvla", story: "Brochettes géantes de porc cuit à la broche pendant des heures." },
          { name: "Lounza", story: "Filet de porc fumé au coriandre, tranché épais et grillé." },
          { name: "Yiouvarlakia", story: "Boulettes de viande pochées au bouillon œuf-citron, comfort food." }
        ],
        moyen: [
          { name: "Afelia", story: "Porc mariné au vin rouge et coriandre concassée, mijoté lentement." },
          { name: "Stifado de lapin", story: "Lapin braisé aux oignons grelot, vinaigre et cannelle, plat d'hiver." },
          { name: "Tava", story: "Agneau, riz et tomates cuits au four en cocotte de terre, parfumés au cumin." }
        ],
        challenge: [
          { name: "Kleftiko", story: "Agneau scellé en papillote ou cocotte fermée, mariné citron et origan, cuit huit heures." },
          { name: "Moussaka chypriote", story: "Aubergines, pomme de terre, viande hachée et béchamel, version chypriote." },
          { name: "Pastitsio chypriote", story: "Gratin de macaroni à la viande et béchamel à la cannelle." }
        ]
      },
      dessert: {
        facile: [
          { name: "Loukoumi de Yeroskipou", story: "Loukoums chypriotes parfumés à la rose, citron ou amande." },
          { name: "Pasteli", story: "Barres de sésame au miel et citron, croustillant et énergétique." },
          { name: "Daktyla simplifié", story: "Petits doigts de pâte fourrés aux noix, frits et arrosés de sirop." }
        ],
        moyen: [
          { name: "Galaktoboureko", story: "Pâte filo croustillante garnie de crème de semoule à la fleur d'oranger." },
          { name: "Bourekia me anari", story: "Mini-chaussons frits à la ricotta chypriote anari et cannelle." },
          { name: "Mahalepi", story: "Crème blanche à l'eau de rose et sirop de fleur, fraîcheur estivale." }
        ],
        challenge: [
          { name: "Daktyla cérémoniel", story: "Doigts de pâte feuilletée farcis aux noix concassées, frits puis trempés au sirop." },
          { name: "Kataifi de Lemesos", story: "Cheveux d'ange roulés autour de noix et amandes, sirop à l'eau de rose." },
          { name: "Halvas tou kounia", story: "Halva à la semoule chypriote au berceau, technique du remuage continu." }
        ]
      },
      snacks: {
        facile: [
          { name: "Halloumi en pain plat", story: "Tranche de halloumi grillé glissée dans un pain plat avec concombre et menthe." },
          { name: "Olives chypriotes", story: "Olives noires marinées huile d'olive, vin rouge et coriandre." },
          { name: "Soutzoukos", story: "Chaîne d'amandes trempées dans un sirop de raisin doux et séchées." }
        ],
        moyen: [
          { name: "Pita au halloumi", story: "Pita garnie de halloumi grillé, tomate, concombre et menthe." },
          { name: "Souvlaki en cuillère", story: "Mini-portion de cubes de porc grillés et tzatziki en cuillère." },
          { name: "Loukaniko pané", story: "Saucisse au coriandre tranchée et panée jusqu'à dorer." }
        ],
        challenge: [
          { name: "Sheftalia wrap", story: "Pita garnie de sheftalia grillées, oignon rouge et persil, version Limassol." },
          { name: "Koupes festives", story: "Bombes de boulgour farcies viande-pignons, frites en grand format." },
          { name: "Halloumi cheese rolls", story: "Roulés feuilletés au halloumi et sésame, technique du fromage qui ne fond pas." }
        ]
      }
    }
  },
  {
    code: "CZ", name: "Tchéquie", flag: "CZ", artist: "Daniel Zizka", song: "Crossroads", color: "#457b9d", youtubeId: "6ea25aRGpLo",
    dishesInput: {
      apero: {
        facile: [
          { name: "Chlebíčky de base", story: "Tartines tchèques au pain de mie, jambon, œuf dur, mayonnaise et cornichon." },
          { name: "Pickles d'oignon", story: "Petits oignons marinés au vinaigre et clou de girofle." },
          { name: "Salát chuťovka", story: "Salade-tartinade au céleri-rave, jambon et mayo en mini-portions." }
        ],
        moyen: [
          { name: "Nakládaný hermelín", story: "Camembert tchèque mariné dans l'huile aux épices et oignons crus." },
          { name: "Utopenci", story: "Saucisses 'noyées' marinées au vinaigre, oignon et paprika, classique des hospodas." },
          { name: "Bramboráky mini", story: "Galettes croustillantes de pommes de terre râpées à l'ail et marjolaine." }
        ],
        challenge: [
          { name: "Topinky ail-fromage", story: "Tartines frites à l'ail et fromage râpé, snack-apéro des pubs." },
          { name: "Žemlovka salée", story: "Pudding de pain au four avec lardons et fromage, version salée." },
          { name: "Hermelín pané", story: "Camembert pané et frit avec sauce aux airelles, classique des Krčmas." }
        ]
      },
      entree: {
        facile: [
          { name: "Salát z červené řepy", story: "Salade de betteraves au raifort, mayo et œuf dur." },
          { name: "Šopský salát", story: "Tomate-concombre-poivron-fromage râpé, version tchèque du shopska." },
          { name: "Tlačenka", story: "Fromage de tête de porc en gelée à servir avec oignons crus et vinaigre." }
        ],
        moyen: [
          { name: "Bramboračka", story: "Soupe rustique aux pommes de terre, champignons séchés et marjolaine." },
          { name: "Česnečka", story: "Soupe à l'ail crémeuse avec croûtons et fromage, antidote des soirs froids." },
          { name: "Kulajda", story: "Soupe crémeuse aux champignons, œuf poché et aneth, plat de Sumava." }
        ],
        challenge: [
          { name: "Krůtí polévka", story: "Soupe à la dinde, légumes et nouilles, l'âme bohémienne en bol." },
          { name: "Hovězí vývar", story: "Bouillon clair de bœuf aux quenelles de moelle et nouilles fines." },
          { name: "Šunkofleky", story: "Pâtes carrées au four avec jambon, œufs et fromage, comfort food." }
        ]
      },
      plat: {
        facile: [
          { name: "Vepřové žebro", story: "Travers de porc rôtis longuement avec choucroute et knedlíky." },
          { name: "Pečené kuře", story: "Poulet rôti au cumin, ail et marjolaine, plat du dimanche tchèque." },
          { name: "Knedlíky houbové", story: "Knedlíky tchèques aux champignons sautés et ail." }
        ],
        moyen: [
          { name: "Svíčková", story: "Filet de bœuf en sauce crémeuse aux légumes, airelles et chantilly, plat de fête." },
          { name: "Goulash tchèque", story: "Bœuf mijoté au paprika et oignons, sauce épaisse à éponger avec knedlíky." },
          { name: "Vepřo-knedlo-zelo", story: "Trinité tchèque: rôti de porc, knedlíky et choucroute mijotée." }
        ],
        challenge: [
          { name: "Pečená kachna", story: "Canard rôti longuement avec chou rouge braisé et bramborové knedlíky." },
          { name: "Smažený sýr", story: "Edam tchèque pané et frit, servi avec sauce tartare et frites." },
          { name: "Rajská omáčka", story: "Bœuf en sauce tomate sucrée-acide aux knedlíky, classique des cantines." }
        ]
      },
      dessert: {
        facile: [
          { name: "Buchty", story: "Petites brioches tchèques fourrées à la confiture de prunes ou pavot." },
          { name: "Bublanina", story: "Gâteau aux fruits 'qui bout', génoise simple parsemée de cerises ou abricots." },
          { name: "Povidlové buchty", story: "Brioches fourrées à la marmelade de prunes powidl, snacks d'enfance." }
        ],
        moyen: [
          { name: "Koláče", story: "Petits ronds de pâte garnis de pavot, fromage blanc ou prunes, motif décoratif." },
          { name: "Vánočka", story: "Brioche tressée de Noël aux raisins et amandes, technique de tressage 9 brins." },
          { name: "Štrúdl tchèque", story: "Strudel aux pommes en pâte étirée fine, raisins et chapelure beurrée." }
        ],
        challenge: [
          { name: "Medovník", story: "Gâteau au miel multi-couches avec crème, recette praguoise transmise depuis le XIXe." },
          { name: "Punčové řezy", story: "Petits cubes glacés au punch rose, intérieur génoise rhum-confiture." },
          { name: "Větrník", story: "Profiterole géante au choux, crème caramel et glaçage chocolat-caramel." }
        ]
      },
      snacks: {
        facile: [
          { name: "Tatranky", story: "Gaufrettes tchèques fourrées noisette ou cacao, snack iconique de l'enfance." },
          { name: "Topinka", story: "Tartine grillée à l'ail et beurre, snack des pubs." },
          { name: "Hermelín nature", story: "Camembert tchèque tranché à servir avec pickles et pain de seigle." }
        ],
        moyen: [
          { name: "Klobása grillée", story: "Saucisse fumée tchèque grillée avec moutarde et tranche de pain." },
          { name: "Bramborák en wrap", story: "Galette de pomme de terre roulée autour de jambon et choucroute." },
          { name: "Smažený sýr-pita", story: "Edam pané glissé dans un pain pita avec sauce tartare et frites." }
        ],
        challenge: [
          { name: "Knedlíky frits", story: "Tranches de knedlíky frites au beurre, version 'leftover' culte." },
          { name: "Sandwich svíčková", story: "Mini-sandwich au bœuf en sauce crémeuse, version à grignoter." },
          { name: "Goulash en cuillère", story: "Mini-portion de goulash épais en cuillère apéritif avec petit knedlík." }
        ]
      }
    }
  },
  {
    code: "DK", name: "Danemark", flag: "DK", artist: "Søren Torpegaard Lund", song: "Før vi går hjem", color: "#c1121f", youtubeId: "xKzEP9dwoss",
    dishesInput: {
      apero: {
        facile: [
          { name: "Smørrebrød au hareng", story: "Tartine de pain de seigle au hareng mariné, oignon rouge et aneth." },
          { name: "Smørrebrød œuf-crevettes", story: "Pain de seigle, œuf dur tranché, crevettes de fjord et mayonnaise." },
          { name: "Smørrebrød rosbif", story: "Pain de seigle au rosbif froid, oignons frits et raifort." }
        ],
        moyen: [
          { name: "Frikadeller mini", story: "Boulettes de porc et veau aux oignons, à servir froides ou tièdes." },
          { name: "Stjerneskud bouchées", story: "Mini-version du 'shooting star': pain, plie panée, crevettes et caviar danois." },
          { name: "Hindbærsnitter salés", story: "Sablés feuilletés à la confiture de framboise, version salée fromage frais." }
        ],
        challenge: [
          { name: "Æbleflæsk en cuillère", story: "Lard fumé caramélisé aux pommes en cuillère apéritif." },
          { name: "Karrysild canapés", story: "Hareng au curry doux danois sur tartine de seigle." },
          { name: "Stegt sild en bouchée", story: "Hareng frit froid mariné au vinaigre, oignon rouge et aneth." }
        ]
      },
      entree: {
        facile: [
          { name: "Asparges-skinke", story: "Asperges blanches roulées au jambon et sauce hollandaise." },
          { name: "Concombres marinés", story: "Concombres tranchés en agro-doux à l'aneth, accompagnement signature." },
          { name: "Salat med æg", story: "Salade verte aux œufs durs, betterave et mayo crémeuse." }
        ],
        moyen: [
          { name: "Æggekage", story: "Omelette épaisse aux lardons, oignons et ciboulette, parfois avec tomates." },
          { name: "Soupe de chou-fleur", story: "Velouté blanc au chou-fleur danois, crème et muscade." },
          { name: "Soupe au céleri", story: "Soupe danoise au céleri-rave et pomme, parfumée à la marjolaine." }
        ],
        challenge: [
          { name: "Stjerneskud", story: "L'étoile filante: tartine avec plie frite, crevettes, asperges, œufs de lump et mayo." },
          { name: "Smørrebrød de luxe", story: "Trio de tartines hareng-rosbif-crevettes en présentation art déco." },
          { name: "Koldskål", story: "Soupe froide au babeurre, vanille et zeste de citron, classique d'été." }
        ]
      },
      plat: {
        facile: [
          { name: "Frikadeller", story: "Boulettes de porc et veau dorées au beurre, servies avec pommes de terre et chou." },
          { name: "Hakkebøf", story: "Steak haché à l'oignon caramélisé, sauce brune et pommes de terre." },
          { name: "Stegt flæsk", story: "Lard frit croustillant servi avec persil-pommes de terre, plat national danois." }
        ],
        moyen: [
          { name: "Boller i karry", story: "Boulettes de porc en sauce curry douce sur riz blanc, comfort food." },
          { name: "Mørbrad", story: "Filet mignon de porc en sauce crème-champignons et bacon." },
          { name: "Bøf med løg", story: "Steak hach et oignons frits caramélisés sur pommes de terre." }
        ],
        challenge: [
          { name: "Flæskesteg", story: "Rôti de porc danois à la couenne ultra-craquante, chou rouge braisé et pomme de terre." },
          { name: "Tarteletter", story: "Tartelettes feuilletées garnies de poulet en sauce blanche aux asperges." },
          { name: "And med æbler", story: "Canard rôti farci aux pommes et pruneaux, plat de Noël danois." }
        ]
      },
      dessert: {
        facile: [
          { name: "Risengrød", story: "Riz au lait à la cannelle et beurre fondu, dessert d'enfance et Noël." },
          { name: "Drømmekage", story: "Gâteau de rêve à la noix de coco caramélisée, recette de Hjallerup." },
          { name: "Æbleskiver", story: "Beignets ronds danois cuits dans une poêle spéciale, à tremper dans confiture et sucre." }
        ],
        moyen: [
          { name: "Risalamande", story: "Riz au lait froid aux amandes et cerises, dessert obligatoire de la veillée de Noël." },
          { name: "Brunsviger", story: "Gâteau levain au beurre brun et cassonade caramélisée, plat de café danois." },
          { name: "Vaniljekranse", story: "Couronnes de pâte sablée à la vanille, bredele du Noël danois." }
        ],
        challenge: [
          { name: "Kransekage", story: "Tour conique de bagues d'amande et sucre glace, gâteau du Nouvel An danois." },
          { name: "Wienerbrød", story: "Pâte feuilletée danoise à la cardamome avec crème et confiture, technique multi-tours." },
          { name: "Othellolagkage", story: "Gâteau Othello multi-couches: génoise, mousse café et chocolat noir." }
        ]
      },
      snacks: {
        facile: [
          { name: "Pølse i svøb", story: "Saucisse danoise enroulée de bacon et grillée, classique de fête." },
          { name: "Hot dog dansk", story: "Saucisse rouge dans pain mou, oignons frits, rémoulade et concombre." },
          { name: "Lakrids", story: "Réglisse salée danoise, snack à grignoter ou enrobé de chocolat." }
        ],
        moyen: [
          { name: "Smørrebrød cocktail", story: "Mini-tartines de seigle au saumon, hareng ou rosbif, en plateau." },
          { name: "Tarteletter mini", story: "Mini-tartelettes feuilletées au poulet et asperges en sauce." },
          { name: "Pølsebrød", story: "Petit pain garni de saucisses fumées, mayo curry et oignons frits." }
        ],
        challenge: [
          { name: "Æbleskiver farcis", story: "Mini-beignets ronds farcis confiture ou chocolat, technique du retournement." },
          { name: "Wienerbrød miniature", story: "Mini-viennoiseries danoises à la cardamome avec crème, technique feuilletage." },
          { name: "Smushi", story: "Mini-smørrebrød fusion-style, version cocktail des smørrebrød classiques." }
        ]
      }
    }
  },
  {
    code: "EE", name: "Estonie", flag: "EE", artist: "Vanilla Ninja", song: "Too Epic to Be True", color: "#00b4d8", youtubeId: "lOiWuol3t3o",
    dishesInput: {
      apero: {
        facile: [
          { name: "Kiluvõileib", story: "Tartine au beurre garnie de sprat baltique fumé et œuf dur, classique estonien." },
          { name: "Pohla et fromage", story: "Confit d'airelles rouges sur fromage frais et pain de seigle." },
          { name: "Hareng au pain noir", story: "Filet de hareng mariné avec aneth et oignon rouge sur leivake." }
        ],
        moyen: [
          { name: "Pirukad mini", story: "Petits pâtés feuilletés farcis viande ou chou, snack des cafés estoniens." },
          { name: "Kama dip", story: "Tartinade à la farine de kama (céréales grillées), kefir et ciboulette." },
          { name: "Sült tranches", story: "Aspic de viande de porc en gelée tranché à servir avec moutarde." }
        ],
        challenge: [
          { name: "Räim suitsutatud", story: "Hareng baltique fumé sur cracker de seigle, technique du fumage à froid." },
          { name: "Karask au four", story: "Pain plat à la farine d'orge et babeurre, à découper en bouchées." },
          { name: "Verivorst en bouchée", story: "Boudin noir estonien à l'orge perlé en mini-portions, classique de Noël." }
        ]
      },
      entree: {
        facile: [
          { name: "Rosolje", story: "Salade estonienne aux betteraves, hareng, pomme et œuf, mayonnaise crémeuse." },
          { name: "Salade de hareng", story: "Hareng mariné, pomme verte et oignon rouge en salade froide." },
          { name: "Mulgi salat", story: "Salade régionale au kama, kefir et baies de saison." }
        ],
        moyen: [
          { name: "Seljanka", story: "Soupe estonienne aux saucisses fumées, cornichons et olives, version slave." },
          { name: "Hapukoor supp", story: "Soupe à la crème aigre, pommes de terre, aneth et œuf poché." },
          { name: "Kapsasupp", story: "Soupe au chou et porc fumé, plat d'hiver des fermes estoniennes." }
        ],
        challenge: [
          { name: "Verikäkk soupe", story: "Soupe-pot aux quenelles de boudin noir et orge, technique de pochage délicat." },
          { name: "Kalakeedis", story: "Soupe de poisson baltique aux pommes de terre, oignons et aneth." },
          { name: "Mulgipuder en entrée", story: "Purée d'orge et pomme de terre fumée, technique paysanne du Mulgimaa." }
        ]
      },
      plat: {
        facile: [
          { name: "Kotletid", story: "Boulettes plates de porc et bœuf hachés, panées et frites au beurre." },
          { name: "Hapukapsas et porc", story: "Choucroute estonienne à l'orge perlé et porc fumé, plat d'hiver." },
          { name: "Paprika täidis", story: "Poivrons farcis viande hachée, riz et tomate au four." }
        ],
        moyen: [
          { name: "Mulgipuder", story: "Purée d'orge et pomme de terre, lardons et oignons frits, plat-trésor du sud." },
          { name: "Hakklihakaste", story: "Sauce bolognaise estonienne sur macaronis, version simplifiée." },
          { name: "Verivorst rôti", story: "Boudin noir à l'orge rôti au four avec airelles et choucroute, plat de Noël." }
        ],
        challenge: [
          { name: "Sült", story: "Gelée de pieds de porc aux épices, technique du clarification du bouillon." },
          { name: "Soola seapraad", story: "Rôti de porc salé longuement et cuit doux, croûte de gros sel à briser." },
          { name: "Kilu vorm", story: "Gratin de sprats au beurre, oignons et pommes de terre, technique de feuilletage." }
        ]
      },
      dessert: {
        facile: [
          { name: "Kohuke", story: "Petits curd cheese bars enrobés de chocolat, snack-dessert national." },
          { name: "Mannavaht", story: "Mousse de semoule rose à la canneberge, dessert d'enfance estonien." },
          { name: "Pohla kissell", story: "Compote liée d'airelles rouges, à servir avec lait ou semoule." }
        ],
        moyen: [
          { name: "Kringel", story: "Brioche tressée à la cardamome, raisins et amandes, technique de tressage." },
          { name: "Pannukoogid", story: "Crêpes épaisses estoniennes à la confiture de fraises et crème." },
          { name: "Kama mousse", story: "Mousse fouettée à la farine de kama et yaourt aux baies de saison." }
        ],
        challenge: [
          { name: "Vastlakukkel", story: "Brioche festive à la crème fouettée et confiture, gros défi de garnissage." },
          { name: "Šokolaadi-kringel", story: "Kringel garni au chocolat noir et amandes effilées, technique avancée." },
          { name: "Kohu küpsis royal", story: "Gâteau royal au curd cheese en multi-couches avec biscuits émiettés." }
        ]
      },
      snacks: {
        facile: [
          { name: "Saiakesed", story: "Petits pains briochés sucrés à la cannelle et raisins, en sachet." },
          { name: "Pohla mahlas", story: "Jus d'airelles rouges sucré, snack-boisson estonien classique." },
          { name: "Karask plat", story: "Pain plat d'orge à beurrer et garnir de fromage frais." }
        ],
        moyen: [
          { name: "Pirukad lihaga", story: "Petits chaussons farcis à la viande hachée et oignons, snack à manger chaud." },
          { name: "Kohuke maison", story: "Curd cheese bars maison enrobés chocolat et noisettes." },
          { name: "Kalapirukad", story: "Petits chaussons au poisson fumé et oignons, version de bord de Baltique." }
        ],
        challenge: [
          { name: "Verivorst sandwich", story: "Pain noir garni de boudin noir tranché et airelles, version chaude." },
          { name: "Kringel rolls", story: "Petits roulés individuels de kringel à la cardamome et confiture." },
          { name: "Vastlakukkel mini", story: "Mini-brioches Vastlakukkel garnies crème fouettée et confiture, format cocktail." }
        ]
      }
    }
  },
  {
    code: "FI", name: "Finlande", flag: "FI", artist: "Linda Lampenius & Pete Parkkonen", song: "Liekinheitin", color: "#5e60ce", youtubeId: "9bfwNIYb96Q",
    dishesInput: {
      apero: {
        facile: [
          { name: "Karjalanpiirakka mini", story: "Petits chaussons de pâte de seigle garnis de riz au lait, beurrés à l'œuf-beurre." },
          { name: "Leipäjuusto au cloudberry", story: "Fromage couiné finlandais avec confiture de mûres jaunes." },
          { name: "Pulla salée", story: "Petites brioches salées à la cardamome, à servir avec saumon fumé." }
        ],
        moyen: [
          { name: "Mämmi en bouchée", story: "Bouchées de mämmi (pudding de seigle) avec crème vanillée." },
          { name: "Lohitäyte canapés", story: "Tartines au saumon fumé, crème fraîche et aneth." },
          { name: "Riisipiirakka mini", story: "Mini-piirakka aux pommes de terre ou carottes." }
        ],
        challenge: [
          { name: "Kalakukko en bouchée", story: "Tourte de pain au seigle farcie de poisson et lard, en version cocktail." },
          { name: "Sienisalaatti", story: "Salade de champignons des bois marinés à la crème, sur cracker de seigle." },
          { name: "Poronkäristys carpaccio", story: "Renne fumé tranché extra-fin, baies de genièvre et beurre fondu." }
        ]
      },
      entree: {
        facile: [
          { name: "Sienisalaatti finlandais", story: "Salade de chanterelles et lait de gribouille à la crème et oignon." },
          { name: "Rosolli", story: "Salade aux betteraves, pommes, hareng et œuf, version finlandaise du rosolje." },
          { name: "Salade de hareng", story: "Hareng mariné en salade aux pommes de terre et crème aigre." }
        ],
        moyen: [
          { name: "Lohikeitto", story: "Soupe au saumon, pomme de terre, poireaux et aneth, classique des cabanes en bois." },
          { name: "Hernekeitto", story: "Soupe aux pois cassés et porc fumé, traditionnellement servie le jeudi." },
          { name: "Sienikeitto", story: "Soupe crémeuse aux champignons des bois et orge perlé." }
        ],
        challenge: [
          { name: "Kalakukko", story: "Pain de seigle farci de poisson (perche, corégone) et lard, cuit douze heures." },
          { name: "Mustamakkara", story: "Boudin noir de Tampere à l'orge concassé, servi avec confiture d'airelles." },
          { name: "Mämmi froid en entrée", story: "Pudding de seigle malté servi froid avec crème fraîche, plat de Pâques." }
        ]
      },
      plat: {
        facile: [
          { name: "Lihapullat", story: "Boulettes de viande à la crème et airelles, classique national finlandais." },
          { name: "Makaronilaatikko", story: "Gratin de macaronis et viande hachée à la sauce œuf-lait, comfort food." },
          { name: "Karjalanpaisti", story: "Ragoût mijoté de bœuf, agneau et porc aux carottes, plat traditionnel de Carélie." }
        ],
        moyen: [
          { name: "Karjalanpaisti longue", story: "Version longue du ragoût carélien, mijoté toute une nuit dans la cocotte." },
          { name: "Poronkäristys", story: "Émincé de renne sauté au beurre, servi avec purée et confit d'airelles." },
          { name: "Maksalaatikko", story: "Pâté de foie au riz, raisins et marjolaine, plat de cantine emblématique." }
        ],
        challenge: [
          { name: "Lohi-laatikko", story: "Gratin de saumon, pommes de terre et aneth, technique des couches uniformes." },
          { name: "Janssonin kiusaus suomi", story: "Gratin de pommes de terre, oignons et anchois fumés, version finlandaise." },
          { name: "Karjalanpiirakka géant", story: "Pirog géant farci de riz au lait et œuf-beurre, technique de tressage de la pâte." }
        ]
      },
      dessert: {
        facile: [
          { name: "Mansikkakiisseli", story: "Compote liée aux fraises sauvages, à servir avec semoule au lait." },
          { name: "Pulla", story: "Brioche à la cardamome tressée, le fika finlandais par excellence." },
          { name: "Korvapuusti", story: "Roulés à la cannelle et cardamome, étoiles des cafés finlandais." }
        ],
        moyen: [
          { name: "Mustikkapiirakka", story: "Tarte rustique aux myrtilles sauvages, pâte sablée à la cardamome." },
          { name: "Runebergintorttu", story: "Petits gâteaux du poète Runeberg aux amandes, rhum et confiture de framboise." },
          { name: "Tippaleipä", story: "Beignets en spirale aérienne saupoudrés de sucre glace, dessert du 1er mai." }
        ],
        challenge: [
          { name: "Mämmi", story: "Pudding de Pâques au seigle malté lentement germé, technique ancestrale." },
          { name: "Joulutorttu", story: "Étoiles feuilletées de Noël à la confiture de prunes, technique du tressage en étoile." },
          { name: "Kakkoja layered", story: "Gâteau finlandais à étages crème-baies-meringue, version royale de fête." }
        ]
      },
      snacks: {
        facile: [
          { name: "Karjalanpiirakka snack", story: "Mini-pirakkas garnis riz au lait, à grignoter avec œuf-beurre." },
          { name: "Salmiakki", story: "Réglisse salée à l'ammoniaque, le snack culte des Finlandais." },
          { name: "Pulla simple", story: "Petites brioches finlandaises à la cardamome pour le fika." }
        ],
        moyen: [
          { name: "Lohi-burger", story: "Mini-burger de saumon mariné à l'aneth dans pain noir." },
          { name: "Karelska wrap", story: "Pirakka roulé garni d'œuf-beurre et saumon fumé." },
          { name: "Reindeer pita", story: "Pita garnie d'émincé de renne sauté et confiture d'airelles." }
        ],
        challenge: [
          { name: "Kalakukko en bouchée", story: "Mini-portions de tourte au poisson fumé et seigle, fait maison." },
          { name: "Mämmi en cuillère", story: "Mini-portions de mämmi tiède avec crème vanillée." },
          { name: "Tippaleipä cône", story: "Tippaleipä servi en cône avec crème fouettée et confiture." }
        ]
      }
    }
  },
  {
    code: "FR", name: "France", flag: "FR", artist: "Monroe", song: "Regarde !", color: "#0055a4", youtubeId: "ujoCYrvvTYQ",
    dishesInput: {
      apero: {
        facile: [
          { name: "Tapenade", story: "Tartinade provençale aux olives noires, câpres et anchois sur baguette grillée." },
          { name: "Anchoïade", story: "Crème d'anchois au vin et ail, à étaler sur pain de campagne." },
          { name: "Olives marinées", story: "Olives Picholine ou Lucques marinées huile, ail et thym de Provence." }
        ],
        moyen: [
          { name: "Gougères", story: "Petits choux salés au comté, à manger tièdes avec un Bourgogne blanc." },
          { name: "Pissaladière mini", story: "Tarte fine niçoise aux oignons confits, anchois et olives, version cocktail." },
          { name: "Rillettes du Mans", story: "Rillettes de porc en pot, à étaler sur baguette croustillante." }
        ],
        challenge: [
          { name: "Foie gras maison", story: "Foie gras mi-cuit au torchon, technique du déveinage et cuisson basse température." },
          { name: "Tartare de Saint-Jacques", story: "Tartare de noix de Saint-Jacques au yuzu, gingembre et huile de noisette." },
          { name: "Mille-feuille de pissaladière", story: "Pissaladière en mille-feuille feuilleté avec couches d'oignons et tapenade." }
        ]
      },
      entree: {
        facile: [
          { name: "Poireaux vinaigrette", story: "Poireaux pochés tièdes en vinaigrette à la moutarde, l'entrée bistrot." },
          { name: "Œuf mayonnaise", story: "Œuf dur sur lit de salade, généreusement nappé de mayonnaise maison." },
          { name: "Carottes râpées", story: "Carottes râpées fines au persil et vinaigrette citron-huile d'olive." }
        ],
        moyen: [
          { name: "Soupe à l'oignon gratinée", story: "Bouillon parfumé aux oignons caramélisés, croûton et gruyère gratiné." },
          { name: "Quiche lorraine", story: "Pâte brisée garnie de lardons fumés, œufs, crème et muscade." },
          { name: "Salade niçoise", story: "Tomates, thon, anchois, œuf dur, olives noires et haricots verts à l'huile d'olive." }
        ],
        challenge: [
          { name: "Soufflé au fromage", story: "Soufflé au gruyère qui doit monter sans retomber, technique du blanc en neige." },
          { name: "Vol-au-vent", story: "Bouchée à la reine au poulet, ris de veau et champignons en sauce blanche." },
          { name: "Terrine de campagne", story: "Terrine au porc, foie de volaille et cognac, à monter en couches et cuire au bain-marie." }
        ]
      },
      plat: {
        facile: [
          { name: "Croque-monsieur", story: "Sandwich grillé jambon-fromage et béchamel, classique des bistrots." },
          { name: "Steak frites", story: "Bavette poêlée à l'échalote, frites maison à la graisse de canard." },
          { name: "Hachis parmentier", story: "Bœuf haché et purée gratinée au four, plat-confort des familles." }
        ],
        moyen: [
          { name: "Blanquette de veau", story: "Veau mijoté en sauce blanche aux champignons et carottes, comfort food au riz." },
          { name: "Coq au vin", story: "Poulet braisé au vin rouge, lardons, oignons grelot et champignons." },
          { name: "Bœuf bourguignon", story: "Bœuf mijoté longuement au vin de Bourgogne, lardons et oignons." }
        ],
        challenge: [
          { name: "Cassoulet", story: "Plat-monument du Sud-Ouest aux haricots blancs, confit de canard, saucisse et porc." },
          { name: "Bouillabaisse", story: "Soupe-plat de Marseille aux poissons de roche, rouille et croûtons." },
          { name: "Pot-au-feu", story: "Bœuf et os à moelle longuement pochés avec carottes, poireaux et navets." }
        ]
      },
      dessert: {
        facile: [
          { name: "Madeleines", story: "Petits gâteaux à la coquille bombée, beurre noisette et zeste de citron." },
          { name: "Crème caramel", story: "Crème vanille renversée nappée de caramel ambré, dessert d'enfance." },
          { name: "Mousse au chocolat", story: "Mousse aérienne aux œufs et chocolat noir 70%, classique des dimanches." }
        ],
        moyen: [
          { name: "Clafoutis aux cerises", story: "Pâte à crêpes épaisse cuite au four sur cerises non dénoyautées du Limousin." },
          { name: "Tarte Tatin", story: "Tarte renversée aux pommes caramélisées, l'accident heureux des sœurs Tatin." },
          { name: "Profiteroles", story: "Petits choux garnis de glace vanille et nappés de chocolat chaud." }
        ],
        challenge: [
          { name: "Mille-feuille", story: "Trois disques de feuilletage caramélisé séparés par crème pâtissière, glaçage marbré." },
          { name: "Paris-Brest", story: "Couronne de pâte à choux garnie de crème mousseline pralinée." },
          { name: "Saint-Honoré", story: "Gâteau au feuilletage, choux caramélisés et crème chiboust, technique d'assemblage." }
        ]
      },
      snacks: {
        facile: [
          { name: "Saucisson tranches", story: "Saucisson sec aux noisettes ou herbes, à trancher et grignoter." },
          { name: "Camembert sur pain", story: "Camembert AOP fondant sur tartine de pain de campagne." },
          { name: "Cornichons et baguette", story: "Cornichons croquants au vinaigre et tranches de baguette beurrée." }
        ],
        moyen: [
          { name: "Croque mini", story: "Mini-croque-monsieur en bouchées, idéal apéro." },
          { name: "Quiche en bouchée", story: "Mini-quiches lorraines à manger d'une main, snack apéro." },
          { name: "Pain perdu salé", story: "Pain rassis trempé œuf-lait avec lardons et fromage, gratiné au four." }
        ],
        challenge: [
          { name: "Friands feuilletés", story: "Petits friands à la chair à saucisse en pâte feuilletée maison." },
          { name: "Pâté en croûte", story: "Mini-pâtés en croûte au porc et foie gras, technique de chemisage de la pâte." },
          { name: "Vol-au-vent mini", story: "Mini-bouchées à la reine garnies de poulet en sauce, technique du feuilletage." }
        ]
      }
    }
  },
  {
    code: "GE", name: "Géorgie", flag: "GE", artist: "Bzikebi", song: "On Replay", color: "#ef233c", youtubeId: "coh-lygCINY",
    dishesInput: {
      apero: {
        facile: [
          { name: "Lobio en bouchée", story: "Haricots rouges écrasés à la coriandre et noix, à étaler sur mchadi de maïs." },
          { name: "Pkhali variés", story: "Trio de pâtés de légumes verts (épinards, betterave, poireau) à la pâte de noix." },
          { name: "Sulguni grillé", story: "Tranches de fromage frais sulguni grillées jusqu'à dorer, l'apéro géorgien." }
        ],
        moyen: [
          { name: "Khachapuri mini", story: "Petits pains au fromage fondu de Géorgie, version cocktail à grignoter chaud." },
          { name: "Lobiani mini", story: "Petits pains plats farcis aux haricots rouges et lard fumé." },
          { name: "Mtsvadi en cuillère", story: "Cubes de porc marinés au vin et grenade en mini-portion sur cuillère." }
        ],
        challenge: [
          { name: "Khinkali mini", story: "Petits raviolis à la viande, juteux à percer délicatement, technique du pli en bourse." },
          { name: "Badrijani Nigvzit", story: "Aubergines fines roulées garnies de pâte de noix et grenade, formes parfaites à former." },
          { name: "Adjaruli khachapuri mini", story: "Petits pains-bateaux au fromage avec œuf coulant au cœur, version cocktail." }
        ]
      },
      entree: {
        facile: [
          { name: "Salade géorgienne aux noix", story: "Tomates et concombres avec pâte de noix, ail et herbes du Caucase." },
          { name: "Mchadi avec lobio", story: "Galette de maïs sans levain accompagnée de purée de haricots rouges." },
          { name: "Pkhali d'épinards", story: "Pâté d'épinards à la pâte de noix, ail et coriandre, formé en boules." }
        ],
        moyen: [
          { name: "Chikhirtma", story: "Soupe au poulet liée à l'œuf et vinaigre, parfumée à la coriandre fraîche." },
          { name: "Lobio en pot", story: "Haricots rouges en pot de terre avec lard, oignon et épices svanéties." },
          { name: "Adjapsandali", story: "Ratatouille géorgienne aux aubergines, poivrons et tomates, parfumée au khmeli suneli." }
        ],
        challenge: [
          { name: "Kuchmachi", story: "Plat d'abats de poulet sautés au vinaigre, grenade et noix concassées." },
          { name: "Chakapuli", story: "Ragoût d'agneau de printemps aux estragon, prunes vertes et vin blanc." },
          { name: "Khinkali entrée", story: "Plat ancestral de raviolis géorgiens à pincer en bourse et siroter." }
        ]
      },
      plat: {
        facile: [
          { name: "Mtsvadi", story: "Brochettes de porc marinées au vin de Kakhétie et grillées sur sarments." },
          { name: "Tabaka", story: "Poulet entier aplati et grillé sous presse à l'ail et coriandre." },
          { name: "Ostri", story: "Ragoût de bœuf en sauce tomate épicée à la coriandre, sur riz pilaf." }
        ],
        moyen: [
          { name: "Chakhokhbili", story: "Poulet mijoté aux tomates fraîches, oignons et coriandre, plat-réflexe géorgien." },
          { name: "Satsivi", story: "Poulet froid en sauce de noix, ail et safran d'Iméreth, plat de fête." },
          { name: "Kharcho", story: "Soupe-plat épicée au bœuf, riz, noix et tklapi (pâte de fruits)." }
        ],
        challenge: [
          { name: "Adjaruli khachapuri", story: "Pain-bateau au fromage fondu et œuf coulant, à mélanger à la cuillère." },
          { name: "Khinkali festifs", story: "Grands raviolis géorgiens à pincer en 18 plis exactement selon la tradition." },
          { name: "Chakapuli d'agneau", story: "Ragoût d'agneau aux estragon, prunes acidulées et vin blanc, plat de Pâques." }
        ]
      },
      dessert: {
        facile: [
          { name: "Churchkhela", story: "Chapelets de noix trempés dans du jus de raisin épaissi puis séchés au soleil." },
          { name: "Pelamushi", story: "Pudding au jus de raisin et farine de maïs, dessert ancestral de la vendange." },
          { name: "Tatara", story: "Pudding au jus de raisin avec farine de blé, version plus douce du pelamushi." }
        ],
        moyen: [
          { name: "Gozinaki", story: "Brittle aux noix et miel coupé en losanges, dessert obligatoire du Nouvel An." },
          { name: "Nazuki", story: "Brioche d'Iméreth aux raisins, cannelle et clous de girofle, à découper en parts." },
          { name: "Tklapi", story: "Pâte de fruits séchée au soleil, à grignoter en feuilles roulées." }
        ],
        challenge: [
          { name: "Janjukha", story: "Variante festive de la churchkhela aux fruits secs et épices, technique du dipping." },
          { name: "Pelamushi cérémoniel", story: "Pudding aux noix et raisin servi en grandes tranches décoratives." },
          { name: "Chiri", story: "Pâte de fruits séchée géorgienne en couches fines, technique du séchage solaire." }
        ]
      },
      snacks: {
        facile: [
          { name: "Mchadi", story: "Galette de maïs simple sans levain, à servir tiède avec sulguni." },
          { name: "Lavash géorgien", story: "Pain plat fin à rouler avec fromage frais et herbes." },
          { name: "Tonis puri", story: "Pain géorgien cuit collé contre la paroi du four tone, à arracher chaud." }
        ],
        moyen: [
          { name: "Khachapuri en bouchée", story: "Pain au fromage en mini-format à grignoter pendant les performances." },
          { name: "Lobiani roulé", story: "Roulé de pâte aux haricots rouges et lard, à trancher en mini-portions." },
          { name: "Kupati grillé", story: "Saucisse de porc géorgienne aux épices, à griller au charbon." }
        ],
        challenge: [
          { name: "Khinkali en panier", story: "Khinkali servis en petits paniers de bambou, à attraper par la queue." },
          { name: "Khachapuri ossète", story: "Khachapuri d'Ossétie avec pomme de terre et fromage, technique de garnissage." },
          { name: "Mtsvadi-pita", story: "Brochettes de porc géorgiennes glissées dans pita avec ajika rouge." }
        ]
      }
    }
  },
  {
    code: "DE", name: "Allemagne", flag: "DE", artist: "Sarah Engels", song: "Fire", color: "#fca311", youtubeId: "AzvRc3eH_rA",
    dishesInput: {
      apero: {
        facile: [
          { name: "Bretzels au gros sel", story: "Bretzels chauds salés au gros sel, à servir avec moutarde douce." },
          { name: "Obatzda", story: "Tartinade bavaroise au camembert, beurre, oignon et paprika, sur pain de seigle." },
          { name: "Mettbrötchen", story: "Pain rond garni de mett (porc cru épicé) et oignons crus, plat-apéro allemand." }
        ],
        moyen: [
          { name: "Kartoffelpuffer mini", story: "Mini-galettes de pommes de terre râpées dorées, à tremper dans la compote." },
          { name: "Currywurst en cuillère", story: "Saucisses tranchées en sauce curry-tomate sucrée, mini-portions." },
          { name: "Leberkäse en bouchées", story: "Pain de viande bavarois tranché et grillé, version apéro avec moutarde douce." }
        ],
        challenge: [
          { name: "Sauerbraten en cuillère", story: "Bœuf mariné au vinaigre en mini-portion sur cuillère apéritif." },
          { name: "Maultaschen mini", story: "Petits raviolis souabes farcis viande-épinards, technique du pliage à la main." },
          { name: "Speckknödel pané", story: "Quenelles de pain au lard tranchées et panées, version street food." }
        ]
      },
      entree: {
        facile: [
          { name: "Gurkensalat", story: "Salade de concombre à l'aneth et crème fraîche, l'entrée des étés allemands." },
          { name: "Käsesalat", story: "Salade de fromage Edam coupé en allumettes, oignon rouge et persil." },
          { name: "Heringssalat", story: "Salade de hareng aux pommes, betteraves et concombres marinés." }
        ],
        moyen: [
          { name: "Kartoffelsuppe", story: "Velouté de pommes de terre, lardons fumés et marjolaine, comfort allemand." },
          { name: "Linsensuppe", story: "Soupe-plat aux lentilles vertes, lardons et saucisses fumées." },
          { name: "Maultaschen au bouillon", story: "Raviolis souabes pochés en bouillon clair de bœuf et persil." }
        ],
        challenge: [
          { name: "Spargelsuppe", story: "Velouté d'asperges blanches au beurre et muscade, plat de printemps allemand." },
          { name: "Königsberger Klopse en entrée", story: "Boulettes de veau aux câpres en sauce blanche, mini-portions élégantes." },
          { name: "Hochzeitssuppe", story: "Soupe de mariage avec quenelles de viande, semoule et œuf, technique délicate." }
        ]
      },
      plat: {
        facile: [
          { name: "Bratwurst-choucroute", story: "Saucisses grillées avec choucroute braisée et moutarde de Düsseldorf." },
          { name: "Schnitzel allemand", story: "Escalope de porc panée à la chapelure et frite au beurre clarifié." },
          { name: "Frikadellen", story: "Boulettes plates de porc et bœuf à la moutarde et oignons, à servir avec salade." }
        ],
        moyen: [
          { name: "Sauerbraten", story: "Rôti de bœuf mariné quatre jours au vinaigre, sauce aux pain d'épices et raisins." },
          { name: "Königsberger Klopse", story: "Boulettes de veau au câpres en sauce blanche acidulée, plat de Königsberg." },
          { name: "Rouladen", story: "Rouleaux de bœuf farcis cornichon, lard et oignon, sauce brune." }
        ],
        challenge: [
          { name: "Schweinshaxe", story: "Jarret de porc bavarois rôti à la peau ultra-craquante, classique d'Oktoberfest." },
          { name: "Eisbein", story: "Jambonneau de porc poché à la choucroute et purée de pois, plat berlinois." },
          { name: "Rinderbraten au four", story: "Rôti de bœuf braisé en cocotte avec carottes, oignons et bière brune." }
        ]
      },
      dessert: {
        facile: [
          { name: "Apfelmus", story: "Compote de pommes allemande à la cannelle et clou de girofle." },
          { name: "Rote Grütze", story: "Compote rouge aux fruits rouges et amidon, à servir avec crème vanille." },
          { name: "Quarkkäulchen", story: "Petits beignets au quark allemand, raisins et cannelle, à la poêle." }
        ],
        moyen: [
          { name: "Bienenstich", story: "Brioche garnie de crème vanille avec couche d'amandes caramélisées sur le dessus." },
          { name: "Apfelstrudel allemand", story: "Strudel aux pommes en pâte étirée fine, raisins et cannelle au beurre." },
          { name: "Käsekuchen", story: "Cheesecake allemand au quark sur pâte sablée, plus léger que la version américaine." }
        ],
        challenge: [
          { name: "Schwarzwälder Kirschtorte", story: "Forêt-Noire: génoise au chocolat, kirsch, crème fouettée et cerises griottes." },
          { name: "Baumkuchen", story: "Gâteau-arbre cuit couche par couche à la broche, technique allemande ancestrale." },
          { name: "Frankfurter Kranz", story: "Couronne de génoise garnie crème au beurre praliné et amandes caramélisées." }
        ]
      },
      snacks: {
        facile: [
          { name: "Brezel chaud", story: "Bretzel mou au gros sel, snack de boulangerie allemand." },
          { name: "Wurstsalat", story: "Salade de saucisse de Lyon coupée en lanières, vinaigrette à l'oignon." },
          { name: "Lebkuchen", story: "Pain d'épices nurembergeois aux amandes et écorces confites." }
        ],
        moyen: [
          { name: "Currywurst", story: "Saucisse berlinoise tranchée nappée de sauce curry-tomate, frites et pain mou." },
          { name: "Döner kebab allemand", story: "Sandwich kebab inventé à Berlin: pain pita, viande et sauce yaourt-ail." },
          { name: "Bockwurst", story: "Saucisse fumée à la moutarde et bretzel, snack de Biergarten." }
        ],
        challenge: [
          { name: "Maultaschen frits", story: "Raviolis souabes tranchés et poêlés au beurre avec œuf et oignon, technique du croustillant." },
          { name: "Kartoffelpuffer XL", story: "Galette géante de pommes de terre frites, à découper en parts avec compote." },
          { name: "Käsespätzle mini", story: "Mini-portions de spätzle gratinés au fromage de montagne et oignons frits." }
        ]
      }
    }
  },
  {
    code: "GR", name: "Grèce", flag: "GR", artist: "Akylas", song: "Ferto", color: "#118ab2", youtubeId: "NGwNTd_DA9s",
    dishesInput: {
      apero: {
        facile: [
          { name: "Tzatziki et pita", story: "Yaourt épais, concombre, ail et menthe sur pita chaude grillée." },
          { name: "Olives Kalamata", story: "Olives violettes de Messénie marinées huile et origan." },
          { name: "Tirokafteri", story: "Tartinade de feta-piment doux à étaler sur pain pita ou crackers." }
        ],
        moyen: [
          { name: "Spanakopita", story: "Triangles de pâte filo aux épinards et feta, technique du pliage." },
          { name: "Tyropitakia", story: "Petits triangles de pâte filo au fromage frais et feta, à servir tièdes." },
          { name: "Dolmadakia", story: "Petites feuilles de vigne farcies au riz, oignon et menthe à l'huile d'olive." }
        ],
        challenge: [
          { name: "Saganaki", story: "Fromage kefalotyri pané et flambé à l'ouzo en table, spectacle d'apéro grec." },
          { name: "Kolokithokeftedes", story: "Beignets de courgettes à la feta et menthe, technique de l'égouttage." },
          { name: "Octopus à l'huile", story: "Tentacules de poulpe pochés et grillés au charbon, huile d'olive et origan." }
        ]
      },
      entree: {
        facile: [
          { name: "Horiatiki", story: "Salade villageoise tomate-concombre-feta-olives sans laitue, vraie recette grecque." },
          { name: "Choriatiki melitzanes", story: "Salade d'aubergines grillées au four, tomates et feta émiettée." },
          { name: "Salade fava", story: "Purée de pois cassés à l'huile d'olive, oignon rouge et câpres de Santorin." }
        ],
        moyen: [
          { name: "Avgolemono", story: "Soupe au poulet, riz et œuf-citron, l'âme acidulée du repas grec." },
          { name: "Fasolada", story: "Soupe aux haricots blancs, tomate et céleri, plat populaire grec." },
          { name: "Kreatosoupa", story: "Soupe-plat à la viande, légumes et œuf-citron, version copieuse." }
        ],
        challenge: [
          { name: "Gemista", story: "Tomates et poivrons farcis au riz, herbes et raisins, longuement cuits au four." },
          { name: "Stifado de poulpe", story: "Poulpe braisé au vin rouge et oignons grelot, plat des îles Cyclades." },
          { name: "Briam", story: "Légumes du jardin (courgette, aubergine, tomate) cuits au four en couches, plat d'été." }
        ]
      },
      plat: {
        facile: [
          { name: "Souvlaki", story: "Brochettes de porc ou poulet marinées origan-citron, grillées au charbon." },
          { name: "Gyros", story: "Pita garnie de viande tournée, tzatziki, tomate, oignon et frites grecques." },
          { name: "Keftedes", story: "Boulettes de viande grecques aux herbes et menthe, frites ou grillées." }
        ],
        moyen: [
          { name: "Moussaka", story: "Aubergines, viande hachée et béchamel gratinées, monument de la cuisine grecque." },
          { name: "Pastitsio", story: "Gratin de macaroni à la viande hachée et béchamel parfumée à la cannelle." },
          { name: "Kleftiko grec", story: "Agneau scellé en papillote au citron, ail et romarin, longuement cuit." }
        ],
        challenge: [
          { name: "Kokoras krasatos", story: "Coq braisé au vin rouge avec petits oignons et cannelle, plat de fête." },
          { name: "Chtapodi krasato", story: "Poulpe braisé au vin de Crète et tomates concassées, technique de tendreté." },
          { name: "Arnaki sto fourno", story: "Agneau de Pâques rôti au four avec pommes de terre, citron et origan." }
        ]
      },
      dessert: {
        facile: [
          { name: "Loukoumades", story: "Beignets ronds dorés trempés dans le miel, à saupoudrer de cannelle et noix." },
          { name: "Halva", story: "Halva à la semoule et huile d'olive aux raisins et amandes, dessert d'enfance." },
          { name: "Karydopita", story: "Gâteau aux noix imbibé de sirop au miel et cannelle, plat de café." }
        ],
        moyen: [
          { name: "Galaktoboureko", story: "Pâte filo croustillante garnie de crème de semoule, sirop à la fleur d'oranger." },
          { name: "Portokalopita", story: "Gâteau-crumble à l'orange en pâte filo froissée, sirop au zeste d'orange." },
          { name: "Bougatsa sucrée", story: "Pâte filo à la crème vanille, sucre glace et cannelle, classique de Thessalonique." }
        ],
        challenge: [
          { name: "Baklava grec", story: "Pâte filo en multi-couches au beurre et noix concassées, sirop au miel et cannelle." },
          { name: "Kourabiedes", story: "Petits gâteaux sablés aux amandes, saupoudrés de sucre glace, biscuits de Noël." },
          { name: "Melomakarona", story: "Petits gâteaux à l'huile d'olive et orange, trempés dans le miel et noix concassées." }
        ]
      },
      snacks: {
        facile: [
          { name: "Pita au tzatziki", story: "Pita grecque chaude avec dip au tzatziki et olives Kalamata." },
          { name: "Saganaki bites", story: "Mini-tranches de fromage saganaki à la poêle, citron et origan." },
          { name: "Olives à l'origan", story: "Olives noires marinées huile d'olive et origan séché de Crète." }
        ],
        moyen: [
          { name: "Tirokafteri sandwich", story: "Pain grillé au tirokafteri (feta-piment) et tomates marinées." },
          { name: "Loukaniko", story: "Saucisse grecque à l'orange et fenouil, grillée et glissée dans pita." },
          { name: "Spanakopita en pita", story: "Pita garnie d'épinards-feta façon spanakopita roulée." }
        ],
        challenge: [
          { name: "Octopus grilled snacks", story: "Tentacules de poulpe en bouchées grillées au charbon, mini-portions." },
          { name: "Bougatsa salée", story: "Pâte filo froissée garnie de fromage frais et viande hachée, technique multi-couches." },
          { name: "Kataifi salé", story: "Cheveux d'ange roulés autour de feta-épinards, version salée à frire." }
        ]
      }
    }
  },
  {
    code: "IL", name: "Israël", flag: "IL", artist: "Noam Bettan", song: "Michelle", color: "#3a86ff", youtubeId: "xWCnWSoG8nI",
    dishesInput: {
      apero: {
        facile: [
          { name: "Houmous-pita", story: "Crème de pois chiches au tahini, citron et ail sur pita chaude." },
          { name: "Baba ghanoush", story: "Caviar d'aubergines fumées au tahini et grenade, à étaler sur pita." },
          { name: "Olives à la coriandre", story: "Olives vertes craquées marinées coriandre, ail et citron." }
        ],
        moyen: [
          { name: "Boureka miniatures", story: "Petits feuilletés farcis fromage, épinards ou pomme de terre, à servir tièdes." },
          { name: "Sabich en bouchée", story: "Mini-version du sandwich aubergines-œuf dur-amba sur pita." },
          { name: "Tabbouleh israélien", story: "Tabbouleh de boulgour aux herbes, tomate et citron, version israélienne." }
        ],
        challenge: [
          { name: "Falafel artisanal", story: "Boulettes de pois chiches crus aux herbes, frites avec sauce tahini." },
          { name: "Malabi salé", story: "Crème blanche au lait au za'atar, version salée de l'apéro fusion." },
          { name: "Shakshuka miniature", story: "Œufs pochés en mini-cocottes individuelles dans sauce tomate-poivron." }
        ]
      },
      entree: {
        facile: [
          { name: "Salade israélienne", story: "Tomates, concombres, oignon coupés très fin avec citron et persil." },
          { name: "Soupe de lentilles", story: "Soupe aux lentilles rouges au cumin et citron, plat-réflexe israélien." },
          { name: "Salade de tahini", story: "Salade tomate-concombre nappée de sauce tahini-citron-ail." }
        ],
        moyen: [
          { name: "Kubbeh soup", story: "Soupe de quenelles farcies à la viande à base de boulgour, version irakienne d'Israël." },
          { name: "Yerushalmi mixed grill", story: "Mélange grillé de poulet, foie et cœur épicés, classique du marché de Jérusalem." },
          { name: "Hummus mashawsha", story: "Houmous chaud avec pois chiches entiers, technique de cuisson lente." }
        ],
        challenge: [
          { name: "Gefilte fish", story: "Quenelles de poisson en bouillon, plat de Shabbat ashkénaze à mouler à la main." },
          { name: "Cholent en entrée", story: "Mini-portion de ragoût de Shabbat aux haricots, viande et pomme de terre." },
          { name: "Ptitim aux légumes", story: "Couscous israélien rond aux légumes rôtis et bouillon, technique des grains." }
        ]
      },
      plat: {
        facile: [
          { name: "Sabich", story: "Pita garnie d'aubergines frites, œuf dur, salade et amba." },
          { name: "Schnitzel israélien", story: "Escalope de poulet panée façon européenne, l'icône du déjeuner israélien." },
          { name: "Shakshuka", story: "Œufs pochés en sauce tomate-poivron-cumin, à éponger avec pita." }
        ],
        moyen: [
          { name: "Mejadra", story: "Riz aux lentilles brunes et oignons frits caramélisés, plat ancestral du Levant." },
          { name: "Maqluba", story: "Plat 'à l'envers' de riz, légumes et viande renversé en plat de service." },
          { name: "Hamin", story: "Cousin sépharade du cholent, ragoût longuement mijoté pour Shabbat." }
        ],
        challenge: [
          { name: "Cholent", story: "Ragoût ashkénaze de Shabbat aux haricots, orge, bœuf et œufs cuits 12h." },
          { name: "Gondi", story: "Boulettes persanes au pois chiche, dinde et cardamome, technique délicate du moelleux." },
          { name: "Kubbeh", story: "Quenelles farcies de boulgour à monter à la main, plat irakien des fêtes." }
        ]
      },
      dessert: {
        facile: [
          { name: "Halva au tahini", story: "Halva sésame-sucre coupé en cubes, croustillant et fondant à la fois." },
          { name: "Malabi", story: "Crème blanche à l'eau de rose et sirop de fleur, fraîcheur du Levant." },
          { name: "Sufganiyot", story: "Beignets ronds farcis confiture, dessert de Hanoukka." }
        ],
        moyen: [
          { name: "Rugelach", story: "Petits roulés feuilletés au chocolat, cannelle et noix, technique de roulage." },
          { name: "Babka", story: "Brioche tressée au chocolat ou cannelle, technique du tressage en spirale." },
          { name: "Kanafeh", story: "Pâte filo râpée garnie de fromage frais, sirop à la fleur d'oranger et pistaches." }
        ],
        challenge: [
          { name: "Knafeh nabulsi", story: "Knafeh de Naplouse au fromage akawi, sirop d'eau de rose, technique du grillage rouge." },
          { name: "Pavlova israélienne", story: "Meringue géante avec crème mascarpone et fruits exotiques, technique de la meringue craquante." },
          { name: "Bougatsa fusion", story: "Pâte filo aux noix et tahini avec sirop de date, technique du multi-couches." }
        ]
      },
      snacks: {
        facile: [
          { name: "Pita-houmous", story: "Pita chaude avec houmous, paprika et huile d'olive en goûter." },
          { name: "Falafel snack", story: "Boulettes de pois chiches frites à grignoter avec tahini." },
          { name: "Bagel israélien", story: "Bagel sésame-cumin israélien, plus mou que la version new-yorkaise." }
        ],
        moyen: [
          { name: "Sabich-pita", story: "Mini-pitas garnies aubergines, œuf et amba, version street food." },
          { name: "Boureka individuel", story: "Feuilleté individuel au fromage ou pommes de terre épicées." },
          { name: "Shakshuka mini", story: "Œufs pochés en mini-poêlons individuels avec sauce tomate." }
        ],
        challenge: [
          { name: "Mejadra mini", story: "Mini-portions de riz-lentilles-oignons frits en cuillère apéro." },
          { name: "Knafeh-pita", story: "Pita farcie au knafeh chaud, version street food de Jérusalem." },
          { name: "Cholent en bouchée", story: "Ragoût de Shabbat en bouchée individuelle, technique du concentré." }
        ]
      }
    }
  },
  {
    code: "IT", name: "Italie", flag: "IT", artist: "Sal Da Vinci", song: "Per sempre sì", color: "#2d6a4f", youtubeId: "V406FAGkhyQ",
    dishesInput: {
      apero: {
        facile: [
          { name: "Bruschette pomodoro", story: "Pain grillé frotté à l'ail, garni de tomates fraîches au basilic et huile d'olive." },
          { name: "Olives Cerignola", story: "Grosses olives vertes des Pouilles à l'ail et fenouil, snack apéritif." },
          { name: "Tarallini", story: "Petits anneaux de pain dur des Pouilles au fenouil, à grignoter avec un Aperol." }
        ],
        moyen: [
          { name: "Arancini siciliens", story: "Boulettes de risotto safran farcies viande-petits pois, panées et frites." },
          { name: "Supplì romains", story: "Croquettes de risotto à la tomate avec mozzarella filante au cœur." },
          { name: "Mozzarella in carrozza", story: "Sandwich de mozzarella pané et frit, à servir tiède aux anchois." }
        ],
        challenge: [
          { name: "Vitello tonnato canapé", story: "Veau froid tranché extra-fin nappé de sauce thon-mayonnaise-câpres, en mini-toast." },
          { name: "Polpette al sugo bouchées", story: "Mini-boulettes de viande à la napolitaine en sauce tomate, en cuillère." },
          { name: "Crocchè di patate", story: "Croquettes napolitaines de pommes de terre farcies mozzarella, frites." }
        ]
      },
      entree: {
        facile: [
          { name: "Caprese", story: "Tomates, mozzarella di bufala et basilic à l'huile d'olive, drapeau italien comestible." },
          { name: "Insalata di rinforzo", story: "Salade napolitaine au chou-fleur, anchois et câpres, plat de Noël." },
          { name: "Bresaola con rucola", story: "Bresaola de Valteline tranchée fine, roquette, parmesan et citron." }
        ],
        moyen: [
          { name: "Ribollita", story: "Soupe toscane au pain rassis, haricots cannellini et chou noir, plat paysan." },
          { name: "Pasta e fagioli", story: "Soupe-pâtes aux haricots blancs et romarin, plat-réconfort des nonnas." },
          { name: "Vellutata di zucca", story: "Velouté de courge butternut au parmesan et amaretti émiettés." }
        ],
        challenge: [
          { name: "Vitello tonnato", story: "Plat piémontais de veau froid en sauce thon-mayonnaise-câpres, technique du froid." },
          { name: "Carpaccio di manzo", story: "Bœuf cru tranché ultra-fin, parmesan, huile et citron, technique de Cipriani." },
          { name: "Burrata pugliese", story: "Burrata des Pouilles éclatée sur tomates anciennes et anchois, simplicité maîtrisée." }
        ]
      },
      plat: {
        facile: [
          { name: "Pasta al pomodoro", story: "Spaghetti à la sauce tomate fraîche, ail, basilic et huile d'olive vierge." },
          { name: "Pollo arrosto", story: "Poulet rôti aux herbes (romarin, sauge), citron et pommes de terre." },
          { name: "Risotto bianco", story: "Risotto blanc au parmesan et beurre, mantecatura traditionnelle." }
        ],
        moyen: [
          { name: "Lasagne alla bolognese", story: "Lasagnes en couches: ragù bolognais, béchamel et parmesan, gratin parfait." },
          { name: "Risotto alla milanese", story: "Risotto au safran et os à moelle, classique des dimanches milanais." },
          { name: "Saltimbocca alla romana", story: "Escalopes de veau au prosciutto et sauge, déglacées au vin blanc." }
        ],
        challenge: [
          { name: "Osso buco", story: "Jarret de veau braisé longuement au vin blanc et bouillon, gremolata finale." },
          { name: "Ragù bolognais 6h", story: "Sauce bolognaise mijotée six heures avec lait, vin et soffritto, technique de Bologne." },
          { name: "Brasato al Barolo", story: "Bœuf piémontais braisé 24h au Barolo et légumes, plat de noces." }
        ]
      },
      dessert: {
        facile: [
          { name: "Tiramisu", story: "Mascarpone, café, biscuits Savoiardi et cacao, le dessert italien le plus copié." },
          { name: "Panna cotta", story: "Crème cuite au sirop de fruits rouges ou caramel, simplicité piémontaise." },
          { name: "Affogato", story: "Boule de glace vanille noyée d'un espresso brûlant, dessert minute." }
        ],
        moyen: [
          { name: "Cannoli siciliens", story: "Tubes croustillants frits garnis de ricotta sucrée, pistaches et fruits confits." },
          { name: "Sfogliatelle", story: "Pâte feuilletée napolitaine en éventail garnie ricotta-semoule-cannelle, technique des couches." },
          { name: "Zeppole di San Giuseppe", story: "Beignets choux à la crème pâtissière et amarena, dessert du 19 mars." }
        ],
        challenge: [
          { name: "Cassata sicilienne", story: "Génoise imbibée à la ricotta sucrée, fruits confits et pâte d'amande, technique de glacage." },
          { name: "Pastiera napoletana", story: "Tarte de Pâques napolitaine au blé, ricotta, fleur d'oranger et fruits confits." },
          { name: "Millefoglie", story: "Mille-feuille italien avec crème pâtissière vanille et glaçage marbré." }
        ]
      },
      snacks: {
        facile: [
          { name: "Focaccia", story: "Pain plat ligure à l'huile d'olive et romarin, à grignoter ou tartiner." },
          { name: "Grissini", story: "Bâtonnets de pain croquants turinois à enrouler de prosciutto." },
          { name: "Crostini con olive", story: "Petites tartines aux olives noires et anchois sur pain toscan grillé." }
        ],
        moyen: [
          { name: "Pizzette", story: "Mini-pizzas tomate-mozzarella, snack apéritif italien des fêtes." },
          { name: "Suppli al telefono", story: "Croquettes de risotto avec mozzarella filante qui s'étire en téléphone à la dégustation." },
          { name: "Panzerotti pugliesi", story: "Chaussons frits des Pouilles à la mozzarella et tomate, à manger très chauds." }
        ],
        challenge: [
          { name: "Bombette pugliesi", story: "Petits rouleaux de longe de porc farcis fromage, grillés sur fournil de pierre." },
          { name: "Calzoni fritti", story: "Mini-calzones napolitains frits aux ricotta et provola, technique de pliage." },
          { name: "Erbazzone reggiano", story: "Tarte salée d'Émilie aux blettes, parmesan et lard, technique de la pâte fine." }
        ]
      }
    }
  },
  {
    code: "LV", name: "Lettonie", flag: "LV", artist: "Atvara", song: "Ēnā", color: "#9d0208", youtubeId: "6C2ivaB5D00",
    dishesInput: {
      apero: {
        facile: [
          { name: "Pain noir et beurre-anchois", story: "Tranches de pain noir letton avec beurre fouetté aux anchois." },
          { name: "Sklandrausis salé", story: "Tartelette de pâte de seigle au carotte salée, version classique des Latgales." },
          { name: "Hareng à l'oignon", story: "Filet de hareng mariné aux oignons rouges et aneth sur seigle." }
        ],
        moyen: [
          { name: "Piragi mini", story: "Petits pâtés feuilletés en croissant farcis lard-oignon, snack iconique letton." },
          { name: "Sprats en feuilleté", story: "Petites tartines de sprats fumés à l'huile d'olive sur pâte feuilletée." },
          { name: "Skābo gurķu sviestmaize", story: "Tartine de pain noir avec cornichons aigres et beurre frais." }
        ],
        challenge: [
          { name: "Hareng au vinaigre", story: "Hareng mariné Letton avec marinade vinaigre-épices, technique de salage." },
          { name: "Pīrāgs en gelée", story: "Aspic letton de viande et légumes, technique du clarification." },
          { name: "Kartupeļu pankūkas mini", story: "Mini-galettes de pommes de terre crème aigre et baies." }
        ]
      },
      entree: {
        facile: [
          { name: "Rosolye letton", story: "Salade aux betteraves, hareng, pommes et œufs, version lettone du rosolje." },
          { name: "Saldskābā kāposti", story: "Choucroute douce-amère lettone aux cumin, plat-réflexe d'hiver." },
          { name: "Salade de betterave", story: "Betteraves râpées à la crème aigre, raifort et aneth." }
        ],
        moyen: [
          { name: "Frikadeļu zupa", story: "Soupe lettone aux mini-boulettes de porc-bœuf et légumes-racines." },
          { name: "Skābeņu zupa", story: "Soupe à l'oseille et œuf dur, plat de printemps letton." },
          { name: "Aukstā zupa", story: "Soupe froide de betterave au kefir et concombre, l'été letton en bol." }
        ],
        challenge: [
          { name: "Pelēkie zirņi en entrée", story: "Pois gris lettons aux lardons et oignons, version mini-entrée." },
          { name: "Aspika kotlete", story: "Boulettes en aspic de viande, technique de la gelée claire." },
          { name: "Sklandrausis ouvert", story: "Tartelette aux carottes, pommes de terre et crème aigre, dessert-ovaire mais ici en entrée." }
        ]
      },
      plat: {
        facile: [
          { name: "Pelēkie zirņi ar speķi", story: "Pois gris lettons aux lardons et oignons frits, plat-trésor letton." },
          { name: "Kotletes", story: "Boulettes de viande pochées avec sauce blanche et purée." },
          { name: "Karbonāde lettone", story: "Côte de porc panée à la lettone, plus épaisse que la version russe." }
        ],
        moyen: [
          { name: "Cīsiņi-kāposti", story: "Saucisses fumées sur choucroute aux baies de genièvre et pommes." },
          { name: "Žāvēta gaļa", story: "Viande séchée et fumée lettonne, à servir avec choucroute et pomme de terre." },
          { name: "Sēņu mērce", story: "Sauce aux champignons des bois sur galettes de pommes de terre, technique des forêts lettones." }
        ],
        challenge: [
          { name: "Cūkas šaulētājs", story: "Cochon de lait rôti à la peau craquante, plat de fête letton, technique de cuisson basse." },
          { name: "Kotletes ar krējumu", story: "Boulettes lettones en sauce crème, technique du moelleux." },
          { name: "Foreles cepetis", story: "Truite entière au four au beurre et aneth, plat des lacs lettons." }
        ]
      },
      dessert: {
        facile: [
          { name: "Biezpiena sieriņš", story: "Curd cheese bars enrobés de chocolat ou nature, snack-dessert national." },
          { name: "Maizes zupa", story: "Soupe de pain noir letton aux fruits secs et crème fouettée, dessert ancestral." },
          { name: "Buberts", story: "Pudding de semoule à la crème fouettée et confiture de canneberges." }
        ],
        moyen: [
          { name: "Klingeris", story: "Brioche tressée géante en bretzel pour les fêtes, raisins et amandes effilées." },
          { name: "Pīrādziņi sucrés", story: "Mini-pâtés feuilletés sucrés à la confiture de prunes ou pommes." },
          { name: "Saldais maizes pudiņš", story: "Pudding sucré de pain noir letton aux pommes et cannelle." }
        ],
        challenge: [
          { name: "Alexander cake", story: "Gâteau letton du XIXe à étages avec confiture de framboise et glaçage rose." },
          { name: "Riekstkoks", story: "Gâteau-arbre aux noix et caramel, technique des couches superposées." },
          { name: "Lapu kūka", story: "Gâteau-feuilles letton à 16 fines couches, technique d'assemblage minutieuse." }
        ]
      },
      snacks: {
        facile: [
          { name: "Sklandrausis", story: "Tartelette en pâte de seigle aux carottes et pommes de terre sucrées." },
          { name: "Pīrāgi mini", story: "Petits chaussons en croissant garnis lard et oignon, snack letton signature." },
          { name: "Klučkas", story: "Petits dumplings ronds aux baies des forêts, à grignoter chauds." }
        ],
        moyen: [
          { name: "Speķrauši", story: "Pains plats lettons garnis de lardons fumés et oignons, technique de la pâte levée." },
          { name: "Smiltskūka", story: "Gâteau-sablé letton aux amandes, à grignoter avec un café." },
          { name: "Karbonāde-pita", story: "Pita garnie de carbonade lettone, choucroute et raifort." }
        ],
        challenge: [
          { name: "Riekstkoks individuel", story: "Mini-gâteaux-arbres aux noix avec couches de caramel, technique d'assemblage." },
          { name: "Klingeris bouchées", story: "Mini-portions de klingeris tressé aux amandes et raisins." },
          { name: "Pīrādziņi farcis fusion", story: "Pīrādziņi salés-sucrés farcis fromage frais et baies des bois." }
        ]
      }
    }
  },
  {
    code: "LT", name: "Lituanie", flag: "LT", artist: "Lion Ceccah", song: "Sólo quiero más", color: "#70e000", youtubeId: "0H-PXnbhG7A",
    dishesInput: {
      apero: {
        facile: [
          { name: "Pain noir à l'ail", story: "Tranches de pain de seigle frottées à l'ail et grillées, snack-apéro lituanien." },
          { name: "Skilandis tranches", story: "Saucisson lituanien fumé à la moutarde et coriandre, à trancher fin." },
          { name: "Aspic kiaušienis", story: "Œufs en gelée à la lituanienne avec aneth et oignon vert." }
        ],
        moyen: [
          { name: "Kepta duona", story: "Pain noir frit à l'huile et frotté à l'ail, snack des bars lituaniens." },
          { name: "Varškė tartinade", story: "Curd cheese frais avec ciboulette, radis et aneth sur pain de seigle." },
          { name: "Bulviniai blynai mini", story: "Mini-galettes de pommes de terre râpées à la crème aigre." }
        ],
        challenge: [
          { name: "Cepelinai mini", story: "Petits zeppelins de pommes de terre farcis viande, à servir en mini-portions." },
          { name: "Kibinai en bouchée", story: "Petits pâtés feuilletés des Karaïmes farcis viande hachée et oignons." },
          { name: "Skilandis maison", story: "Charcuterie lituanienne fumée à l'estomac de porc, technique ancestrale." }
        ]
      },
      entree: {
        facile: [
          { name: "Šaltibarščiai", story: "Soupe froide rose vif à la betterave, kefir, concombre et œuf dur, l'été lituanien." },
          { name: "Salade de hareng", story: "Hareng mariné aux pommes de terre et oignons rouges en salade fraîche." },
          { name: "Kefiras-agurkai", story: "Soupe froide de kefir aux concombres et aneth, plat-réflexe lituanien." }
        ],
        moyen: [
          { name: "Borsch lituanien", story: "Soupe à la betterave et viande, plus douce que la version ukrainienne." },
          { name: "Kopūstų sriuba", story: "Soupe au chou et lard fumé, plat de cantine lituanien." },
          { name: "Burokėlių sriuba", story: "Soupe à la betterave chaude avec œuf dur et crème aigre." }
        ],
        challenge: [
          { name: "Kibinai", story: "Pâtés feuilletés en demi-lune des Karaïmes farcis agneau-oignon, technique de pliage." },
          { name: "Vėdarai", story: "Boudins de pommes de terre rappées et lard, longuement rôtis au four." },
          { name: "Šaltibarščiai festif", story: "Version royale de la soupe froide rose, technique de la coloration intense." }
        ]
      },
      plat: {
        facile: [
          { name: "Cepelinai", story: "Zeppelins de pommes de terre râpées farcis viande, sauce lardons et crème aigre." },
          { name: "Bulviniai blynai", story: "Galettes de pommes de terre lituaniennes, plus épaisses que les latkes." },
          { name: "Kotletai", story: "Boulettes plates lituaniennes de porc-bœuf, panées et frites." }
        ],
        moyen: [
          { name: "Kugelis", story: "Gratin de pommes de terre râpées et lardons, longuement cuit au four." },
          { name: "Balandėliai", story: "Choux farcis lituaniens à la viande hachée et riz, sauce tomate-crème." },
          { name: "Vėdarai au four", story: "Boudins de pommes de terre lituaniens cuits au four au lard." }
        ],
        challenge: [
          { name: "Kepta antis", story: "Canard rôti aux pommes et marjolaine, technique des fermes lituaniennes." },
          { name: "Žemaitijos blynai", story: "Crêpes-galettes de Žemaitija aux foies de poulet et lardons fumés." },
          { name: "Cepelinai à la sauce sauvage", story: "Zeppelins de Vilnius en sauce aux champignons des bois." }
        ]
      },
      dessert: {
        facile: [
          { name: "Tinginys", story: "Saucisson sucré 'fainéant' aux biscuits, beurre et cacao, à trancher froid." },
          { name: "Spurgos", story: "Beignets ronds saupoudrés de sucre, cousins lituaniens des sufganiyot." },
          { name: "Sausainiai", story: "Petits biscuits sablés au beurre et confiture, classiques de fika lituanien." }
        ],
        moyen: [
          { name: "Naminis šokoladas", story: "Chocolat 'maison' lituanien aux noix et raisins secs, à trancher." },
          { name: "Šakotis", story: "Gâteau-arbre cuit à la broche en couches successives, dessert de mariage." },
          { name: "Skruzdėlynas", story: "'Fourmilière' aux feuilles de pâte friées et miel, technique de l'assemblage en pyramide." }
        ],
        challenge: [
          { name: "Šakotis cérémoniel", story: "Šakotis géant aux 24 couches dorées, technique du tournage à la broche pendant des heures." },
          { name: "Medutis", story: "Gâteau au miel multi-couches avec crème, dessert de fête lituanien." },
          { name: "Tortas Karalius", story: "Gâteau royal aux 12 couches alternant génoise et crème caramel." }
        ]
      },
      snacks: {
        facile: [
          { name: "Kibinai snack", story: "Mini-pâtés des Karaïmes à grignoter chauds, classique de Trakai." },
          { name: "Skilandis sandwich", story: "Pain de seigle garni de skilandis tranché et concombres aigres." },
          { name: "Tinginys cube", story: "Cubes de saucisson sucré aux biscuits et chocolat, snack à trancher." }
        ],
        moyen: [
          { name: "Cepelinai mini", story: "Mini-zeppelins en bouchées avec sauce crème-lardons, technique du petit format." },
          { name: "Bulviniai blynai-saumon", story: "Galettes de pommes de terre garnies de saumon mariné et crème aigre." },
          { name: "Žagarėliai", story: "Bandes de pâte frite saupoudrées de sucre glace, snack lituanien des fêtes." }
        ],
        challenge: [
          { name: "Skilandis-pita", story: "Pita garnie de skilandis tranché et choucroute lituanienne." },
          { name: "Žemaitiškas blynas", story: "Mini-crêpes de Žemaitija aux foies de poulet, version street food." },
          { name: "Vėdarai en bouchée", story: "Boudins de pommes de terre tranchés en mini-portions au lard." }
        ]
      }
    }
  },
  {
    code: "LU", name: "Luxembourg", flag: "LU", artist: "Eva Marija", song: "Mother Nature", color: "#00b4d8", youtubeId: "DmVfJSRqgnI",
    dishesInput: {
      apero: {
        facile: [
          { name: "Tartines au Kachkéis", story: "Tartines de pain de seigle au fromage cuit luxembourgeois et moutarde." },
          { name: "Wäinzossiss tranches", story: "Saucisse au Riesling tranchée et poêlée, snack-apéro mosellan." },
          { name: "Mini-bouchée pâté", story: "Mini-bouchées en pâte feuilletée garnies de pâté maison luxembourgeois." }
        ],
        moyen: [
          { name: "Gromperekichelcher", story: "Galettes croustillantes de pommes de terre râpées, oignons et persil." },
          { name: "Mini-Rieslingspaschtéit", story: "Petits pâtés en croûte au veau et porc dans gelée au Riesling." },
          { name: "Träipen tranches", story: "Boudin noir luxembourgeois tranché et grillé avec compote de pommes." }
        ],
        challenge: [
          { name: "Kachkéis fait maison", story: "Fromage cuit luxembourgeois au babeurre, moutarde et carvi, technique de la fermentation." },
          { name: "Mini-Pâté en croûte", story: "Petits pâtés en croûte au porc luxembourgeois et foie de volaille au cognac." },
          { name: "Bouchée à la moutarde", story: "Bouchée feuilletée garnie de moutarde de Luxembourg et lardons fumés." }
        ]
      },
      entree: {
        facile: [
          { name: "Salade de pommes de terre lux", story: "Pommes de terre tièdes, vinaigrette à la moutarde luxembourgeoise et persil." },
          { name: "Bouneschlupp", story: "Soupe luxembourgeoise aux haricots verts, pommes de terre et lard fumé." },
          { name: "Soupe au lait moselle", story: "Soupe au lait, oignons et pommes de terre, plat-réflexe rural luxembourgeois." }
        ],
        moyen: [
          { name: "Käschtensupp", story: "Velouté de châtaignes luxembourgeois à la crème et lard fumé." },
          { name: "Esaü", story: "Soupe-plat aux lentilles vertes et lardons, version luxembourgeoise." },
          { name: "F'rell am Rèisleck léger", story: "Truite mosellane délicatement pochée au Riesling, version entrée." }
        ],
        challenge: [
          { name: "Träipen et compote", story: "Boudin noir luxembourgeois grillé avec compote de pommes-rhubarbe maison." },
          { name: "Bouneschlupp royale", story: "Bouneschlupp de fête avec saucisse au Riesling et lard fumé d'Ardennes." },
          { name: "Hierenges am Rèisleck", story: "Hareng au Riesling et oignons confits, plat-trésor mosellan." }
        ]
      },
      plat: {
        facile: [
          { name: "Wäinzossiss-purée", story: "Saucisse au Riesling poêlée sur purée de pommes de terre à la crème." },
          { name: "Hong am Rèisleck", story: "Poulet au Riesling, champignons et crème, plat de fête luxembourgeois." },
          { name: "Schniederfleesch", story: "Bœuf séché et fumé luxembourgeois tranché fin avec choucroute." }
        ],
        moyen: [
          { name: "Kniddelen", story: "Quenelles luxembourgeoises de pâte à la crème et lardons fumés." },
          { name: "Judd mat Gaardebounen", story: "Plat national: collier de porc fumé sur fèves des marais et pommes de terre." },
          { name: "Träipen au four", story: "Boudin noir luxembourgeois cuit au four avec compote et purée." }
        ],
        challenge: [
          { name: "F'rell am Rèisleck", story: "Truite entière au Riesling, échalotes et crème, technique du pochage parfait." },
          { name: "Cochon de lait luxembourgeois", story: "Cochon de lait rôti à la peau ultra-craquante, plat des kermesses." },
          { name: "Schweinebraten lux", story: "Rôti de porc luxembourgeois mariné à la bière et carvi, longuement braisé." }
        ]
      },
      dessert: {
        facile: [
          { name: "Quetschentaart", story: "Tarte aux quetsches d'automne sur pâte brisée à la cannelle." },
          { name: "Mehlspeis", story: "Pudding sucré aux raisins et cannelle, dessert d'enfance luxembourgeois." },
          { name: "Verwurelter", story: "Petits beignets en torsade saupoudrés de sucre, snack-dessert mosellan." }
        ],
        moyen: [
          { name: "Bamkuch", story: "Cousin luxembourgeois du Baumkuchen, gâteau-arbre cuit en couches." },
          { name: "Rieslingspudding", story: "Pudding luxembourgeois au Riesling et raisins, dessert estival mosellan." },
          { name: "Buurefroustigkeet", story: "'Petit-déjeuner du paysan' aux pommes, raisins et cannelle, en dessert chaud." }
        ],
        challenge: [
          { name: "Hatzkuch", story: "Gâteau-cœur luxembourgeois aux noix et au miel, technique du moulage en cœur." },
          { name: "Kachkéiskuch sucré", story: "Cheesecake au Kachkéis luxembourgeois et raisins, technique de l'équilibre salé-sucré." },
          { name: "Pèierscht", story: "Brioche luxembourgeoise de Pâques tressée aux raisins et amandes, technique de tressage." }
        ]
      },
      snacks: {
        facile: [
          { name: "Bamkuch tranches", story: "Tranches du gâteau-arbre luxembourgeois à grignoter avec un café." },
          { name: "Verwurelter snack", story: "Beignets torsadés saupoudrés de sucre, snack des kermesses." },
          { name: "Pâté en croûte tranches", story: "Tranches de pâté en croûte luxembourgeois avec cornichons aigres." }
        ],
        moyen: [
          { name: "Mini-Pâté lux", story: "Mini-pâtés en croûte individuels au porc et foie de volaille." },
          { name: "Gromperekichelcher snack", story: "Mini-galettes de pommes de terre à grignoter chaudes." },
          { name: "Wäinzossiss bouchée", story: "Mini-saucisses au Riesling en cuillère apéritive." }
        ],
        challenge: [
          { name: "Bouchée à la reine lux", story: "Bouchée luxembourgeoise au veau, ris et champignons, technique du feuilletage." },
          { name: "Pèierscht en cuillère", story: "Mini-portions de brioche pèierscht avec compote de quetsches." },
          { name: "Träipen mini", story: "Bouchées de boudin noir luxembourgeois avec compote de rhubarbe." }
        ]
      }
    }
  },
  {
    code: "MT", name: "Malte", flag: "MT", artist: "Aidan", song: "Bella", color: "#ef476f", youtubeId: "CW6mQLBh6Js",
    dishesInput: {
      apero: {
        facile: [
          { name: "Galletti et bigilla", story: "Crackers maltais avec tartinade de fèves bigilla, classique des bars de La Valette." },
          { name: "Ġbejniet", story: "Petits fromages frais maltais à l'huile d'olive, poivre et tomate séchée." },
          { name: "Olives à la coriandre", story: "Olives noires marinées à la coriandre, ail et menthe." }
        ],
        moyen: [
          { name: "Pastizzi", story: "Petits feuilletés maltais en losange aux pois cassés ou à la ricotta." },
          { name: "Qassatat", story: "Petits pains feuilletés ronds farcis épinards-anchois ou pois cassés." },
          { name: "Helwa Bouchée", story: "Mini-bouchées de helwa maltaise au sésame et amandes." }
        ],
        challenge: [
          { name: "Bragioli mini", story: "Petits paupiettes de bœuf farcies à la chapelure et œuf, en cuillère." },
          { name: "Octopus à l'huile", story: "Tentacules de poulpe poché au laurier et huile d'olive de Gozo." },
          { name: "Soppa tal-armla bouchée", story: "Soupe-veuve aux légumes et œuf poché en mini-portions." }
        ]
      },
      entree: {
        facile: [
          { name: "Insalata Maltija", story: "Salade maltaise aux tomates anciennes, oignons rouges, ġbejna et capers." },
          { name: "Bigilla et galletti", story: "Tartinade de fèves bigilla servie avec crackers maltais." },
          { name: "Imqarrun", story: "Salade de macaroni à la viande hachée et œuf dur, plat estival maltais." }
        ],
        moyen: [
          { name: "Soppa tal-armla", story: "Soupe-veuve aux légumes du jardin et œuf poché au cœur, plat de carême maltais." },
          { name: "Aljotta", story: "Soupe maltaise au poisson, ail, tomate et riz, plat de pêcheurs." },
          { name: "Minestra maltaise", story: "Soupe minestrone maltaise aux légumes et tomate, plat hivernal." }
        ],
        challenge: [
          { name: "Lampuki pie en entrée", story: "Mini-tourtes au lampuki (mahi-mahi) en saison automnale, technique de la pâte." },
          { name: "Stuffat tal-fenek mini", story: "Mini-portions de ragoût de lapin au vin rouge, plat national maltais." },
          { name: "Timpana mini", story: "Mini-pâtés en croûte aux macaronis et viande hachée, plat de fête." }
        ]
      },
      plat: {
        facile: [
          { name: "Stuffat tal-laħam", story: "Ragoût de bœuf maltais aux pommes de terre, oignons et marsala." },
          { name: "Ross il-forn", story: "Riz au four maltais à la viande hachée et œufs, plat de cantine." },
          { name: "Imqarrun il-forn", story: "Macaronis au four à la viande hachée et tomate, gratinés au pecorino." }
        ],
        moyen: [
          { name: "Bragioli", story: "Paupiettes de bœuf farcies à la chapelure et œufs durs, longuement mijotées." },
          { name: "Lampuki pie", story: "Tourte au lampuki (poisson de saison), légumes et olives, plat d'automne." },
          { name: "Soppa tal-armla XL", story: "Version familiale de la soupe-veuve servie en grand bol avec œuf entier." }
        ],
        challenge: [
          { name: "Stuffat tal-fenek", story: "Ragoût de lapin au vin rouge, ail et marsala, monument culinaire de Malte." },
          { name: "Timpana", story: "Pâté en croûte géant aux macaronis, viande hachée et œufs, technique du chemisage." },
          { name: "Fenkata", story: "Festin du lapin: spaghetti au foie de lapin puis lapin braisé, célébration du 29 juin." }
        ]
      },
      dessert: {
        facile: [
          { name: "Imqaret", story: "Beignets en losange farcis pâte de dattes au zeste de citron." },
          { name: "Helwa tat-Tork", story: "Halva maltaise aux amandes et sésame, importée des Ottomans." },
          { name: "Figolli simples", story: "Petits gâteaux de Pâques aux amandes en forme de personnages, version simple." }
        ],
        moyen: [
          { name: "Kannoli maltais", story: "Tubes croustillants frits garnis de ricotta sucrée et fruits confits." },
          { name: "Pastizzi tal-irkotta", story: "Pastizzi à la ricotta sucrée, technique du feuilletage maltais." },
          { name: "Pizzelle maltaises", story: "Gaufres fines au fer, pliées en cône et garnies de crème ou fruits." }
        ],
        challenge: [
          { name: "Figolli de Pâques", story: "Grands biscuits aux amandes en forme d'agneaux ou colombes, technique de glaçage." },
          { name: "Prinjolata", story: "Gâteau-pyramide blanc en biscuits, amandes et chocolat, dessert du Carnaval." },
          { name: "Qubbajt", story: "Nougat blanc maltais aux amandes et miel, technique de la cuisson au cuivre." }
        ]
      },
      snacks: {
        facile: [
          { name: "Pastizzi snack", story: "Pastizzi chauds à la sortie du four, snack de rue maltais." },
          { name: "Ħobż biż-żejt", story: "Pain rond maltais frotté à la tomate, olives, capers et thon." },
          { name: "Galletti croustilles", story: "Crackers maltais ronds à grignoter nature ou avec bigilla." }
        ],
        moyen: [
          { name: "Ħobż biż-żejt garni", story: "Pain plat maltais avec mozzarella, anchois, pommes de terre et tomate." },
          { name: "Imqarrun en bouchée", story: "Mini-portions de macaronis au four en cuillère apéritif." },
          { name: "Bigilla wraps", story: "Wraps de pain plat maltais avec bigilla, oignon et concombre." }
        ],
        challenge: [
          { name: "Lampuki sandwich", story: "Sandwich au lampuki (mahi-mahi) grillé, légumes du jardin et tartare." },
          { name: "Fenek-pita", story: "Pita garnie de lapin braisé, oignons confits et persil, version street food." },
          { name: "Timpana en cuillère", story: "Mini-portions de pâté en croûte aux macaronis en cuillère apéro." }
        ]
      }
    }
  },
  {
    code: "MD", name: "Moldavie", flag: "MD", artist: "Satoshi", song: "Viva, Moldova!", color: "#ffbe0b", youtubeId: "SViojHjNSzc",
    dishesInput: {
      apero: {
        facile: [
          { name: "Salată de vinete", story: "Caviar d'aubergines moldave au tournesol, oignon et tomate, sur pain rustique." },
          { name: "Salată de icre", story: "Tartinade d'œufs de carpe moldaves crémeuse, à étaler sur toast." },
          { name: "Mititei mini", story: "Petites saucisses sans peau aux épices, grillées au charbon, version cocktail." }
        ],
        moyen: [
          { name: "Plăcinte miniatures", story: "Petites galettes pochées ou frites farcies fromage frais ou pommes." },
          { name: "Tochitură en cuillère", story: "Mini-portions de ragoût de porc en cuillère apéritif." },
          { name: "Sarmale mini", story: "Mini-feuilles de chou farcies au riz et viande hachée." }
        ],
        challenge: [
          { name: "Răcituri", story: "Aspic moldave de pieds de porc à l'ail, technique de la gelée claire." },
          { name: "Mămăligă-brânză bouchées", story: "Polenta moldave au fromage blanc en bouchées, sur cuillère apéro." },
          { name: "Cârnați maison", story: "Saucisses moldaves au porc fumé et ail, technique du séchage maison." }
        ]
      },
      entree: {
        facile: [
          { name: "Salată de legume", story: "Salade moldave aux tomates, concombres, poivrons et oignon rouge." },
          { name: "Borș moldave", story: "Soupe acidulée au son de blé fermenté, classique des cantines moldaves." },
          { name: "Ciorbă de varză", story: "Soupe au chou et viande de porc à l'aneth et crème aigre." }
        ],
        moyen: [
          { name: "Zeamă", story: "Soupe-plat moldave au poulet, nouilles maison et son fermenté." },
          { name: "Plăcinte aux feuilles", story: "Plăcinte moldave en pâte étirée fine farcie fromage blanc et aneth." },
          { name: "Borș de pește", story: "Soupe au poisson de Dniestr et son fermenté, plat des pêcheurs." }
        ],
        challenge: [
          { name: "Plăcinte poale-n brâu", story: "Plăcinte 'jupes-en-ceinture' aux quatre coins repliés, technique de pliage." },
          { name: "Sarmale mici", story: "Mini-rouleaux de feuilles de vigne ou chou farcis riz-viande, technique du roulage." },
          { name: "Colțunași", story: "Petits raviolis moldaves aux fromage blanc, pochés en bouillon." }
        ]
      },
      plat: {
        facile: [
          { name: "Mămăligă cu brânză", story: "Polenta moldave au fromage frais et crème aigre, plat-réflexe paysan." },
          { name: "Tochitură", story: "Ragoût de porc moldave au paprika et lardons, servi sur mămăligă." },
          { name: "Cârnați grillés", story: "Saucisses fumées maison grillées avec moutarde et choucroute." }
        ],
        moyen: [
          { name: "Sarmale moldave", story: "Choux fermenté farci viande-riz longuement mijoté à la crème aigre." },
          { name: "Tocană moldave", story: "Ragoût de bœuf aux pommes de terre et paprika doux, plat-réconfort." },
          { name: "Mititei moldaves", story: "Saucisses sans peau de viande hachée aux épices, grillées au feu." }
        ],
        challenge: [
          { name: "Răsol", story: "Bœuf longuement bouilli aux légumes-racines, plat de fête moldave." },
          { name: "Drob de miel", story: "Pain de viande d'agneau aux abats, herbes et œufs, plat de Pâques." },
          { name: "Cușma lui Guguță salée", story: "Plat technique de pommes de terre, viande et fromage en couches." }
        ]
      },
      dessert: {
        facile: [
          { name: "Cușma lui Guguță", story: "Gâteau-bonnet moldave aux crêpes, crème fouettée et cerises, technique de l'assemblage." },
          { name: "Plăcinte sucrées", story: "Galettes moldaves aux pommes ou fromage blanc sucré." },
          { name: "Compot de fructe", story: "Compote moldave de fruits secs au miel et cannelle." }
        ],
        moyen: [
          { name: "Pască", story: "Brioche-tarte de Pâques au fromage frais et raisins, dessert religieux." },
          { name: "Făget", story: "Gâteau aux noix et meringue moldave, technique des couches." },
          { name: "Plăcinte cu mere", story: "Plăcinte aux pommes et cannelle en pâte fine étirée à la main." }
        ],
        challenge: [
          { name: "Cozonac multi-couches", story: "Brioche tressée moldave au pavot et noix en spirales décoratives." },
          { name: "Tort cu nucă", story: "Gâteau aux noix moldave en multi-couches avec crème caramel." },
          { name: "Pască de Pâques", story: "Pască festive en double-pâte tressée, technique du décor en croix." }
        ]
      },
      snacks: {
        facile: [
          { name: "Plăcinte snack", story: "Petites galettes moldaves chaudes farcies fromage blanc et aneth." },
          { name: "Brânză cu mămăligă", story: "Cubes de polenta moldave avec fromage frais et crème aigre." },
          { name: "Cașcaval frit", story: "Tranches de fromage de brebis moldave panées et frites." }
        ],
        moyen: [
          { name: "Mititei wraps", story: "Lavash roulé autour de mititei grillés et oignons crus." },
          { name: "Plăcinte au fromage individuelles", story: "Mini-plăcinte rondes farcies fromage blanc et aneth, à grignoter chaudes." },
          { name: "Mămăligă en cuillère", story: "Mini-portions de polenta avec fromage et crème en cuillère apéritive." }
        ],
        challenge: [
          { name: "Sarmale en bouchée", story: "Mini-sarmale individuelles servies en cuillère avec crème aigre." },
          { name: "Tochitură mini", story: "Mini-portions de ragoût de porc moldave en bouchée." },
          { name: "Cușma mini", story: "Mini-versions du gâteau-bonnet en mini-portions individuelles." }
        ]
      }
    }
  },
  {
    code: "ME", name: "Monténégro", flag: "ME", artist: "Tamara Živković", song: "Nova zora", color: "#d00000", youtubeId: "nuvy2d60HbI",
    dishesInput: {
      apero: {
        facile: [
          { name: "Pršut Njeguški", story: "Jambon cru fumé du village de Njeguši, à servir avec fromage de Pljevlja." },
          { name: "Kajmak et pain", story: "Crème caillée monténégrine sur pain plat tiède, simplicité maîtrisée." },
          { name: "Olives noires marinées", story: "Olives noires de Bar marinées huile et romarin." }
        ],
        moyen: [
          { name: "Kačamak miniature", story: "Mini-portions de polenta monténégrine au kajmak et fromage de chèvre." },
          { name: "Cicvara mini", story: "Polenta crémeuse au kajmak en mini-portions, plat de bergers." },
          { name: "Pršut sur figues", story: "Bouchées de pršut Njeguški et figues fraîches au miel de châtaignier." }
        ],
        challenge: [
          { name: "Punjene paprike mini", story: "Mini-poivrons farcis riz et viande hachée, technique du remplissage délicat." },
          { name: "Sjenica fromage et pain", story: "Fromage de Sjenica fumé sur pain plat avec compote de poire." },
          { name: "Brodet en cuillère", story: "Mini-portions de soupe de poisson de Skadar en cuillère apéritive." }
        ]
      },
      entree: {
        facile: [
          { name: "Salade tomates monténégrine", story: "Tomates anciennes, oignon rouge, fromage de Pljevlja et olives." },
          { name: "Riblja čorba", story: "Soupe de poisson du lac Skadar au paprika et persil." },
          { name: "Salade de poulpe", story: "Poulpe poché refroidi, pommes de terre et persil à l'huile d'olive." }
        ],
        moyen: [
          { name: "Pita zeljanica", story: "Tourte aux blettes et fromage frais en pâte fine étirée, version monténégrine." },
          { name: "Mantije", story: "Petits raviolis monténégrins farcis viande hachée, en bouillon ou poêlés." },
          { name: "Lozovaca-marinade", story: "Charcuterie marinée à la lozovaca (eau-de-vie de raisin), technique des montagnes." }
        ],
        challenge: [
          { name: "Pita od krompira", story: "Tourte aux pommes de terre et fromage frais en pâte fine, plat des bergers." },
          { name: "Brodet de poisson", story: "Soupe-ragoût de poissons du Skadar au vin et tomate, plat lacustre." },
          { name: "Sarma monténégrine", story: "Choux fermenté farci au riz, viande et raisins secs, technique des balkans." }
        ]
      },
      plat: {
        facile: [
          { name: "Ćevapi", story: "Petites saucisses sans peau aux épices, grillées au charbon avec lepinja." },
          { name: "Pljeskavica", story: "Steak haché géant aux épices, grillé et garni d'oignons crus et kajmak." },
          { name: "Krap u tave", story: "Carpe du lac Skadar poêlée au beurre, ail et persil." }
        ],
        moyen: [
          { name: "Japrak", story: "Feuilles de chou ou de vigne farcies au riz et viande, plat-réflexe monténégrin." },
          { name: "Riblji paprikaš", story: "Ragoût de poissons du lac Skadar au paprika doux et oignons." },
          { name: "Cicvara au fromage", story: "Polenta crémeuse au kajmak et fromage frais des montagnes." }
        ],
        challenge: [
          { name: "Ispod sača", story: "Plat cuit sous une cloche en fonte ensevelie sous les braises, technique balkanique." },
          { name: "Jagnjetina ispod sača", story: "Agneau de Durmitor cuit sous cloche avec pommes de terre et romarin." },
          { name: "Brodet de Skadar", story: "Soupe-ragoût de poissons du lac Skadar au vin Vranac, technique d'assemblage." }
        ]
      },
      dessert: {
        facile: [
          { name: "Priganice au miel", story: "Petits beignets monténégrins arrosés de miel et fromage blanc." },
          { name: "Krempita", story: "Mille-feuille à la crème vanille, version monténégrine de la kremšnita." },
          { name: "Palačinke aux noix", story: "Crêpes monténégrines fourrées aux noix concassées et confiture." }
        ],
        moyen: [
          { name: "Ratluk", story: "Loukoum monténégrin parfumé à la rose ou au figue, technique du sirop." },
          { name: "Kremšnita monténégrine", story: "Mille-feuille à la crème vanille épaisse et pâte feuilletée, dessert de café." },
          { name: "Tufahija", story: "Pommes pochées au sirop, farcies aux noix et nappées de chantilly." }
        ],
        challenge: [
          { name: "Tulumba", story: "Beignets cannelés monténégrins trempés dans un sirop au miel, technique de la pâte." },
          { name: "Ribarsko mliječno", story: "Pudding au lait des pêcheurs de Skadar aux baies sauvages." },
          { name: "Pita od grožđa", story: "Tarte fine aux raisins de Crmnica et noix, technique de la pâte étirée." }
        ]
      },
      snacks: {
        facile: [
          { name: "Priganice mini", story: "Mini-beignets monténégrins à grignoter chauds avec confiture de figues." },
          { name: "Pršut sandwich", story: "Pain plat monténégrin garni de pršut Njeguški et fromage frais." },
          { name: "Kajmak sur pain", story: "Tartine au kajmak monténégrin avec fines tranches de tomate." }
        ],
        moyen: [
          { name: "Burek monténégrin", story: "Pâte filo roulée farcie viande ou fromage, plat-snack des bars." },
          { name: "Pita feta-épinards", story: "Pita aux épinards et feta de Pljevlja en pâte fine étirée." },
          { name: "Pljeskavica mini", story: "Mini-burgers monténégrins aux épices avec oignons crus." }
        ],
        challenge: [
          { name: "Ispod sača bouchée", story: "Mini-portions cuites sous cloche en cuillère apéro." },
          { name: "Brodet en bouchée", story: "Mini-bouchées de soupe-ragoût de poisson en cuillère individuelle." },
          { name: "Mantije en cuillère", story: "Mini-raviolis monténégrins en cuillère avec yaourt à l'ail." }
        ]
      }
    }
  },
  {
    code: "NO", name: "Norvège", flag: "NO", artist: "Jonas Lovv", song: "Ya Ya Ya", color: "#023e8a", youtubeId: "MasllzWk_bQ",
    dishesInput: {
      apero: {
        facile: [
          { name: "Lefse au fromage", story: "Pain plat norvégien aux pommes de terre garni de fromage frais et aneth." },
          { name: "Brunost et crackers", story: "Fromage brun caramélisé au lait de chèvre, en fines tranches sur knäckebröd." },
          { name: "Hareng mariné", story: "Filet de hareng mariné au vinaigre et oignon rouge sur pain de seigle." }
        ],
        moyen: [
          { name: "Mini-fiskekaker", story: "Petites galettes de poisson blanc à la crème et muscade, dorées au beurre." },
          { name: "Smørrebrød gravlax", story: "Tartine au saumon mariné aneth-sucre-sel, sauce moutarde douce." },
          { name: "Gomme-tartine", story: "Tartine au gommost (fromage brun de chèvre) et mûres jaunes." }
        ],
        challenge: [
          { name: "Rakfisk en cuillère", story: "Truite fermentée au sel pendant trois mois, en mini-portion sur pain de seigle." },
          { name: "Lutefisk en bouchée", story: "Morue séchée réhydratée à la soude, version mini avec lard et purée de pois." },
          { name: "Pinnekjøtt mini", story: "Mini-côtes d'agneau salées et fumées, plat de Noël en bouchée." }
        ]
      },
      entree: {
        facile: [
          { name: "Salade de concombre", story: "Concombre tranché à l'aneth et vinaigre, accompagnement classique." },
          { name: "Sodd", story: "Soupe norvégienne aux boulettes d'agneau et carottes, plat-réflexe rural." },
          { name: "Fiskesuppe légère", story: "Soupe de poisson aux légumes-racines et crème, version aérienne." }
        ],
        moyen: [
          { name: "Rømmegrøt", story: "Bouillie norvégienne à la crème aigre et beurre fondu, dessert salé technique." },
          { name: "Fiskesuppe complète", story: "Soupe norvégienne au saumon, cabillaud, légumes et crème, plat-réflexe côtier." },
          { name: "Kjøttsuppe", story: "Soupe-pot d'agneau aux pommes de terre, navets et persil, plat-réflexe d'hiver." }
        ],
        challenge: [
          { name: "Rakfisk", story: "Truite fermentée trois mois au sel, technique ancestrale des montagnes norvégiennes." },
          { name: "Lutefisk", story: "Morue séchée réhydratée à la lessive de soude, plat-tradition du Nord." },
          { name: "Sursild platter", story: "Plateau de harengs marinés en cinq sauces (curry, moutarde, tomate, aneth, oignon)." }
        ]
      },
      plat: {
        facile: [
          { name: "Fiskekaker", story: "Galettes de poisson blanc panées au beurre, sauce blanche aux crevettes." },
          { name: "Kjøttkaker", story: "Boulettes de viande norvégiennes en sauce brune et purée de pois." },
          { name: "Lapskaus", story: "Ragoût norvégien aux restes de viande et légumes, plat de cantine." }
        ],
        moyen: [
          { name: "Fårikål", story: "Plat national: agneau et chou cuits ensemble avec poivre, plat d'automne." },
          { name: "Kjøttboller norvégiennes", story: "Boulettes en sauce crème aux airelles et pommes de terre, version norvégienne." },
          { name: "Bacalao norvégien", story: "Morue séchée mijotée à la tomate, oignons et olives, héritage portugais." }
        ],
        challenge: [
          { name: "Pinnekjøtt", story: "Côtes d'agneau salées et fumées, cuites à la vapeur sur baguettes de bouleau, plat de Noël." },
          { name: "Lutefisk plat principal", story: "Morue à la soude servie avec lard, purée de pois et beurre fondu, plat festif." },
          { name: "Smalahove", story: "Tête de mouton entière fumée et cuite, plat ancestral norvégien à présenter entière." }
        ]
      },
      dessert: {
        facile: [
          { name: "Krumkake", story: "Gaufrettes norvégiennes en cône fines au cardamome, à servir avec crème fouettée." },
          { name: "Riskrem", story: "Riz au lait froid aux amandes et coulis de fraises, dessert de Noël traditionnel." },
          { name: "Skolebrød", story: "Brioches norvégiennes garnies de crème vanille et noix de coco." }
        ],
        moyen: [
          { name: "Multekrem", story: "Crème fouettée aux mûres jaunes des marais, dessert de fête norvégien." },
          { name: "Fyrstekake", story: "Tarte princière aux amandes et cardamome avec treillis de pâte." },
          { name: "Bløtkake", story: "Gâteau d'anniversaire norvégien à la crème fouettée et fraises." }
        ],
        challenge: [
          { name: "Kvæfjordkake", story: "'Le meilleur gâteau du monde': génoise, meringue, amandes et crème vanille." },
          { name: "Kransekake", story: "Tour de couronnes d'amandes et sucre glace, gâteau du 17 mai et mariages." },
          { name: "Kanelboller géants", story: "Brioches géantes à la cannelle et cardamome, technique du tressage en spirale." }
        ]
      },
      snacks: {
        facile: [
          { name: "Brunost sandwich", story: "Tranche de pain au fromage brun caramélisé, snack norvégien iconique." },
          { name: "Lefse roll", story: "Lefse roulée au beurre, sucre et cannelle, à grignoter pendant le concours." },
          { name: "Smultringer", story: "Beignets ronds norvégiens au cardamome et sucre, snack de fête." }
        ],
        moyen: [
          { name: "Pølse i lompe", story: "Hot dog norvégien dans pain plat aux pommes de terre, oignons frits et moutarde." },
          { name: "Skillingsboller", story: "Brioches à la cannelle de Bergen, à grignoter avec un café fort." },
          { name: "Solo-frukt", story: "Fruits secs norvégiens (canneberges, mûres jaunes) en mélange à grignoter." }
        ],
        challenge: [
          { name: "Rakfisk en bouchée", story: "Mini-portions de truite fermentée sur knäckebröd, version cocktail." },
          { name: "Smalahove mini", story: "Mini-portions de viande de tête de mouton fumée, version dégustation." },
          { name: "Lutefisk en cuillère", story: "Mini-portions de morue à la soude en cuillère avec lard et purée." }
        ]
      }
    }
  },
  {
    code: "PL", name: "Pologne", flag: "PL", artist: "Alicja", song: "Pray", color: "#dc2f02", youtubeId: "q78cnYIoF9Y",
    dishesInput: {
      apero: {
        facile: [
          { name: "Ogórki kiszone", story: "Cornichons polonais lacto-fermentés à l'aneth et ail, snack-apéro slave." },
          { name: "Pierogi mini", story: "Petits raviolis polonais farcis fromage-pomme de terre, en mini-format." },
          { name: "Smalec", story: "Saindoux polonais aux lardons et oignons, à étaler sur pain de seigle." }
        ],
        moyen: [
          { name: "Pierogi ruskie", story: "Raviolis polonais farcis pommes de terre et fromage blanc, dorés au beurre." },
          { name: "Krokiety", story: "Petites crêpes polonaises roulées et panées, farcies viande ou champignons." },
          { name: "Tatar wołowy mini", story: "Tartare de bœuf polonais au cornichon et oignon, en mini-portions." }
        ],
        challenge: [
          { name: "Galantyna", story: "Pâté en gelée de poulet aux légumes et œuf dur, technique du chemisage." },
          { name: "Faszerowane jaja", story: "Œufs durs farcis champignons-jambon et regratinés en demi-coquille." },
          { name: "Bigos en cuillère", story: "Mini-portions de chasseur polonais en cuillère, plat de fête." }
        ]
      },
      entree: {
        facile: [
          { name: "Mizeria", story: "Salade polonaise au concombre, crème aigre et aneth, l'entrée d'été." },
          { name: "Surówka z kiszonej kapusty", story: "Salade de choucroute aux pommes et carottes râpées." },
          { name: "Sałatka jarzynowa", story: "Salade russe polonaise aux légumes-racines, œuf et mayonnaise." }
        ],
        moyen: [
          { name: "Żurek", story: "Soupe polonaise au son de seigle fermenté, saucisse fumée et œuf dur." },
          { name: "Barszcz czerwony", story: "Bortsch polonais clair à la betterave avec uszka (mini-raviolis)." },
          { name: "Rosół", story: "Bouillon polonais clair de poulet et nouilles, plat-réflexe du dimanche." }
        ],
        challenge: [
          { name: "Pierogi z mięsem", story: "Raviolis polonais farcis viande hachée, technique du pliage en demi-lune." },
          { name: "Krokiety farcis", story: "Crêpes polonaises roulées garnies viande ou champignons, panées et frites." },
          { name: "Pyzy", story: "Boulettes polonaises géantes aux pommes de terre, farcies viande et champignons." }
        ]
      },
      plat: {
        facile: [
          { name: "Pierogi", story: "Raviolis polonais en demi-lune farcis fromage, viande ou choucroute, dorés au beurre." },
          { name: "Kotlet schabowy", story: "Escalope de porc panée à la chapelure, plat-réflexe des cantines polonaises." },
          { name: "Gołąbki", story: "Choux farcis viande et riz, mijotés en sauce tomate ou champignons." }
        ],
        moyen: [
          { name: "Bigos", story: "Choucroute polonaise mijotée avec choux frais, viandes mélangées et pruneaux." },
          { name: "Bigos chasseur", story: "Version 'chasseur' du bigos avec gibier, champignons des bois et vin rouge." },
          { name: "Kotlet mielony", story: "Boulettes polonaises de porc-bœuf à la chapelure et oignons frits." }
        ],
        challenge: [
          { name: "Żurek z białą kiełbasą", story: "Żurek de Pâques avec saucisse blanche, œuf dur et lardons fumés." },
          { name: "Pierogi z czarną soczewicą", story: "Raviolis polonais aux lentilles noires et champignons des bois, version originale." },
          { name: "Pieczeń wieprzowa", story: "Rôti de porc polonais mariné aux herbes et longuement braisé." }
        ]
      },
      dessert: {
        facile: [
          { name: "Sernik", story: "Cheesecake polonais au twaróg (fromage blanc local), plus dense que la version américaine." },
          { name: "Pączki", story: "Beignets ronds polonais farcis confiture de roses, dessert du Mardi gras." },
          { name: "Kompot", story: "Compote polonaise de fruits secs au cannelle, à boire chaude ou froide." }
        ],
        moyen: [
          { name: "Makowiec", story: "Brioche roulée à la pâte de pavot moulu, raisins et amandes, dessert de Noël." },
          { name: "Babka", story: "Brioche-couronne polonaise aux raisins secs et zestes d'agrumes, dessert de Pâques." },
          { name: "Naleśniki", story: "Crêpes polonaises fourrées au twaróg sucré ou confiture, dorées au beurre." }
        ],
        challenge: [
          { name: "Tort orzechowy", story: "Gâteau polonais aux noix et crème café en multi-couches, technique de génoise." },
          { name: "Sernik krakowski", story: "Cheesecake de Cracovie avec treillis en pâte sablée sur le dessus." },
          { name: "Karpatka", story: "'Mont des Carpathes': mille-feuille polonais à la crème pâtissière vanille en relief." }
        ]
      },
      snacks: {
        facile: [
          { name: "Obwarzanek", story: "Bagel polonais de Cracovie au sésame, snack des marchés." },
          { name: "Paluszki", story: "Bâtonnets de pain polonais au sel ou cumin, snack-apéro." },
          { name: "Krówki", story: "Caramels au lait polonais à la vanille, fondants en bouche." }
        ],
        moyen: [
          { name: "Zapiekanka", story: "Demi-baguette polonaise garnie champignons et fromage gratiné, street food de Cracovie." },
          { name: "Kabanos", story: "Saucisses polonaises fines et fumées à grignoter ou en sandwich." },
          { name: "Pączek mini", story: "Mini-beignets polonais à la confiture de roses, snack des fêtes." }
        ],
        challenge: [
          { name: "Pierogi sandwich", story: "Pain polonais garni de pierogi tranchés et crème aigre, version street food." },
          { name: "Bigos en bouchée", story: "Mini-portions de bigos en cuillère avec petite saucisse fumée." },
          { name: "Kiełbasa pita", story: "Pita garnie de kielbasa grillée, oignons confits et moutarde polonaise." }
        ]
      }
    }
  },
  {
    code: "PT", name: "Portugal", flag: "PT", artist: "Bandidos do Cante", song: "Rosa", color: "#40916c", youtubeId: "jyHaE6GqaaQ",
    dishesInput: {
      apero: {
        facile: [
          { name: "Tremoços", story: "Lupin marinés à l'eau salée, l'apéro portugais à grignoter avec un verre de bière." },
          { name: "Pastéis de bacalhau", story: "Croquettes de morue, pommes de terre et persil frites au cœur fondant." },
          { name: "Olives à l'origan", story: "Olives portugaises de l'Alentejo marinées huile, ail et origan." }
        ],
        moyen: [
          { name: "Croquetes", story: "Croquettes portugaises panées garnies viande hachée et béchamel." },
          { name: "Pataniscas mini", story: "Beignets portugais à la morue, oignon et persil, version cocktail." },
          { name: "Rissois mini", story: "Petits chaussons portugais frits aux crevettes ou viande, technique de la pâte." }
        ],
        challenge: [
          { name: "Salada de polvo", story: "Salade de poulpe portugais aux pommes de terre, oignons et persil." },
          { name: "Carne assada bouchée", story: "Mini-portions de bœuf rôti à l'ail et vin blanc en cuillère apéro." },
          { name: "Empadas mini", story: "Petites tourtes portugaises au poulet, technique de la pâte brisée beurrée." }
        ]
      },
      entree: {
        facile: [
          { name: "Caldo verde", story: "Soupe portugaise au chou kale, pomme de terre et chouriço, plat national." },
          { name: "Salada de tomate", story: "Salade de tomates portugaises au persil, oignon et huile d'olive de l'Alentejo." },
          { name: "Açorda alentejana", story: "Soupe-tartine de pain à l'ail, coriandre et œuf poché, plat-trésor de l'Alentejo." }
        ],
        moyen: [
          { name: "Sopa de feijão", story: "Soupe portugaise aux haricots, chou et chouriço, plat-réflexe rural." },
          { name: "Pataniscas", story: "Galettes portugaises à la morue, persil et oignon, dorées au beurre." },
          { name: "Carapaus alimados", story: "Maquereaux marinés au vinaigre et oignons rouges, entrée fraîche." }
        ],
        challenge: [
          { name: "Sopa da pedra", story: "Soupe-pot 'à la pierre' aux haricots, viandes et légumes, plat de Almeirim." },
          { name: "Caldeirada", story: "Soupe-ragoût de poissons mélangés et pommes de terre, plat des pêcheurs." },
          { name: "Cataplana de polvo", story: "Poulpe braisé en cataplana cuivre avec pommes de terre et coriandre." }
        ]
      },
      plat: {
        facile: [
          { name: "Frango piri-piri", story: "Poulet portugais grillé à la sauce piri-piri (piment), plat-icône national." },
          { name: "Bifana", story: "Sandwich portugais au porc mariné dans pain rond, ail et vin blanc." },
          { name: "Bacalhau à Brás", story: "Morue émiettée aux pommes de terre paille, œuf et olives noires." }
        ],
        moyen: [
          { name: "Bacalhau com natas", story: "Morue gratinée à la crème, oignons confits et pommes de terre." },
          { name: "Arroz de pato", story: "Riz portugais au canard confit et chouriço, plat de fête du Nord." },
          { name: "Bacalhau à Gomes de Sá", story: "Morue émiettée aux pommes de terre, oignons, œufs et olives, plat de Porto." }
        ],
        challenge: [
          { name: "Cataplana", story: "Plat-cataplana en cuivre aux fruits de mer, porc et coriandre, technique de cuisson hermétique." },
          { name: "Cozido à portuguesa", story: "Pot-au-feu portugais aux viandes mélangées, choux et chouriço, plat dominical." },
          { name: "Leitão da Bairrada", story: "Cochon de lait rôti à la peau ultra-craquante, spécialité de Bairrada." }
        ]
      },
      dessert: {
        facile: [
          { name: "Pastéis de nata", story: "Petites tartelettes feuilletées à la crème vanille caramélisée, l'icône portugaise." },
          { name: "Pão de Deus", story: "Brioche portugaise à la noix de coco, plat-goûter portugais." },
          { name: "Bolo de bolacha", story: "Gâteau aux biscuits portugais imbibés de café et crème au beurre." }
        ],
        moyen: [
          { name: "Toucinho do céu", story: "Gâteau portugais aux amandes et jaunes d'œuf, héritage des couvents." },
          { name: "Arroz doce", story: "Riz au lait portugais à la cannelle et zeste de citron, dessert d'enfance." },
          { name: "Pudim Abade de Priscos", story: "Crème caramel portugaise au porto et zeste de citron, technique des couvents." }
        ],
        challenge: [
          { name: "Pastel de Tentúgal", story: "Pâte feuilletée garnie de doce de ovos, technique ancestrale du couvent de Tentúgal." },
          { name: "Travesseiros de Sintra", story: "Coussins feuilletés à la crème d'amande, technique de feuilletage à la main." },
          { name: "Ovos moles d'Aveiro", story: "Œufs mous d'Aveiro en coquilles d'oblies blanches, IGP portugaise." }
        ]
      },
      snacks: {
        facile: [
          { name: "Pastel bacalhau snack", story: "Croquettes de morue à grignoter chaudes, classique des cervejarias portugaises." },
          { name: "Sandes de leitão", story: "Sandwich portugais au cochon de lait rôti et sauce épicée." },
          { name: "Bolo do caco", story: "Pain plat madérien à l'ail et beurre persillé, snack signature." }
        ],
        moyen: [
          { name: "Bifana sandes", story: "Sandwich classique portugais au porc mariné en pain rond, moutarde piri-piri." },
          { name: "Bola de Berlim", story: "Beignets portugais farcis à la crème vanille, plat de la plage estivale." },
          { name: "Tosta mista", story: "Croque-monsieur portugais au jambon, fromage et beurre, snack des cafés." }
        ],
        challenge: [
          { name: "Pastéis de Belém maison", story: "Pastéis selon la recette secrète des moines de Belém, technique du caramélisage parfait." },
          { name: "Polvo wraps", story: "Wraps portugais au poulpe grillé, oignons confits et coriandre." },
          { name: "Cataplana en bouchée", story: "Mini-portions de cataplana en cuillère avec mini-coquillage." }
        ]
      }
    }
  },
  {
    code: "RO", name: "Roumanie", flag: "RO", artist: "Alexandra Căpitănescu", song: "Choke Me", color: "#ffb703", youtubeId: "yn0YmI0dPb8",
    dishesInput: {
      apero: {
        facile: [
          { name: "Zacuscă et pain", story: "Tartinade roumaine aux poivrons rôtis, aubergines et tomate, snack-apéro de l'automne." },
          { name: "Salată de vinete", story: "Caviar d'aubergines roumain à l'huile et oignon, à étaler sur pain rustique." },
          { name: "Mititei mini", story: "Mini-saucisses sans peau de viande hachée aux épices, grillées au charbon." }
        ],
        moyen: [
          { name: "Plăcinte mini", story: "Petites galettes roumaines farcies fromage frais ou pommes." },
          { name: "Cașcaval pané", story: "Tranches de cașcaval roumain panées et frites, coulant à cœur." },
          { name: "Chiftele mici", story: "Mini-boulettes de viande aux herbes à servir avec moutarde et cornichons." }
        ],
        challenge: [
          { name: "Tobă de porc", story: "Fromage de tête roumain en gelée tranché à la moutarde et cornichons." },
          { name: "Salată de boeuf en cuillère", story: "Mini-portions de salade russe roumaine aux légumes-racines et bœuf bouilli." },
          { name: "Răcituri", story: "Aspic roumain de pieds de porc à l'ail, technique de la gelée transparente." }
        ]
      },
      entree: {
        facile: [
          { name: "Salată de boeuf", story: "Salade russe roumaine aux légumes-racines, mayonnaise et bœuf bouilli." },
          { name: "Salată orientală", story: "Salade roumaine aux pommes de terre, oignon, œuf et olives." },
          { name: "Salată de cartofi cu ceapă", story: "Salade tiède de pommes de terre à l'oignon rouge et vinaigrette." }
        ],
        moyen: [
          { name: "Ciorbă de perișoare", story: "Soupe acidulée roumaine aux boulettes de viande et borș fermenté." },
          { name: "Ciorbă rădăuțeană", story: "Soupe au poulet acidulée à la crème aigre, plat-trésor de Bucovine." },
          { name: "Ciorbă de fasole cu ciolan", story: "Soupe roumaine aux haricots et jarret de porc fumé, plat-réflexe rural." }
        ],
        challenge: [
          { name: "Sarmale", story: "Choux fermenté farci viande-riz mijoté avec lard fumé, plat national roumain." },
          { name: "Drob de miel", story: "Pain de viande d'agneau aux abats et herbes, plat de Pâques roumain." },
          { name: "Pârjoale moldovenești", story: "Boulettes plates roumaines aux herbes et œuf, technique du moelleux." }
        ]
      },
      plat: {
        facile: [
          { name: "Mici", story: "Saucisses sans peau de viande hachée à l'ail et épices, grillées au charbon." },
          { name: "Pârjoale", story: "Boulettes plates roumaines de bœuf-porc aux herbes, panées et frites." },
          { name: "Friptură de pui", story: "Poulet rôti roumain à l'ail et cumin, plat-réflexe du dimanche." }
        ],
        moyen: [
          { name: "Sarmale roumaines", story: "Choux farcis viande-riz longuement mijotés avec lard et tomate, plat national." },
          { name: "Tochitură moldovenească", story: "Ragoût de porc moldave-roumain au paprika, servi sur mămăligă et œuf." },
          { name: "Iahnie de fasole", story: "Ragoût roumain aux haricots blancs et chouriço fumé, plat-réflexe d'hiver." }
        ],
        challenge: [
          { name: "Mămăligă cu tochitură", story: "Polenta roumaine au porc en ragoût et œuf au plat, technique de l'assemblage." },
          { name: "Bulz", story: "Polenta-fromage cuite au four en boules avec lard fumé, plat des bergers carpates." },
          { name: "Friptură de porc à la moldave", story: "Rôti de porc roumain mariné aux herbes et longuement braisé." }
        ]
      },
      dessert: {
        facile: [
          { name: "Papanași", story: "Beignets roumains au fromage blanc nappés de crème aigre et confiture de cerises." },
          { name: "Cozonac simple", story: "Brioche roumaine aux noix et cacao roulés en spirale, plat de fête." },
          { name: "Cremșnit", story: "Mille-feuille roumain à la crème vanille épaisse, dessert de café." }
        ],
        moyen: [
          { name: "Plăcintă cu mere", story: "Galette roumaine aux pommes et cannelle en pâte fine étirée à la main." },
          { name: "Cornulețe", story: "Croissants roumains au fromage blanc fourrés confiture, technique du roulage." },
          { name: "Amandine", story: "Mini-cakes roumains au cacao imbibés de sirop et glaçage chocolat." }
        ],
        challenge: [
          { name: "Cozonac complet", story: "Brioche-couronne roumaine aux deux spirales de noix et cacao, technique de tressage." },
          { name: "Pasca", story: "Brioche-tarte de Pâques au fromage frais et raisins, dessert religieux." },
          { name: "Joffre", story: "Gâteau roumain au chocolat à étages avec crème ganache, technique de l'enrobage." }
        ]
      },
      snacks: {
        facile: [
          { name: "Covrigi", story: "Bretzels roumains au sésame ou pavot, snack des marchés des villes." },
          { name: "Pretzels roumains au cumin", story: "Bretzels au cumin moulus, version épicée des covrigi." },
          { name: "Plăcinte snack", story: "Mini-galettes roumaines à grignoter chaudes farcies fromage blanc." }
        ],
        moyen: [
          { name: "Mici-pita", story: "Pita garnie de mititei grillés, oignons crus et moutarde piquante." },
          { name: "Cașcaval pané sandwich", story: "Sandwich roumain au cașcaval pané, salade et concombres aigres." },
          { name: "Brânză roumaine sur pain", story: "Tartine de fromage roumain aux herbes et oignons crus." }
        ],
        challenge: [
          { name: "Sarmale en bouchée", story: "Mini-feuilles de chou farcies en cuillère apéritif." },
          { name: "Tobă tranche", story: "Tranches de fromage de tête en gelée avec moutarde et cornichons." },
          { name: "Pasca mini", story: "Mini-portions de brioche-tarte de Pâques en cuillère individuelle." }
        ]
      }
    }
  },
  {
    code: "SM", name: "Saint-Marin", flag: "SM", artist: "Senhit", song: "Superstar", color: "#48cae4", youtubeId: "wOQe-fQSFxg",
    dishesInput: {
      apero: {
        facile: [
          { name: "Piadina classique", story: "Pain plat romagnol-sammarinais à garnir de prosciutto, fromage et roquette." },
          { name: "Crostini romagnoli", story: "Petites tartines toscano-romagnoles aux foies de volaille et anchois." },
          { name: "Olive ascolane miniatures", story: "Olives vertes farcies à la viande hachée, panées et frites en mini." }
        ],
        moyen: [
          { name: "Cassoni romagnols", story: "Demi-piadinas pliées et grillées, garnies de blettes et squacquerone." },
          { name: "Squacquerone et figues", story: "Fromage frais romagnol squacquerone sur figues fraîches au miel d'acacia." },
          { name: "Erbazzone mini", story: "Tarte fine aux blettes et parmesan en pâte croustillante, en bouchées." }
        ],
        challenge: [
          { name: "Salame di Mora di Romagna", story: "Saucisson de cochon noir de Romagne, à trancher fin avec pain de campagne." },
          { name: "Bondiola", story: "Charcuterie sammarinese fumée et séchée, technique des Apennins." },
          { name: "Pinzimonio sammarinese", story: "Légumes crus à tremper dans huile d'olive, vinaigre balsamique et sel." }
        ]
      },
      entree: {
        facile: [
          { name: "Insalata di ceci", story: "Salade de pois chiches romagnoli à l'oignon rouge, persil et huile d'olive." },
          { name: "Pinzimonio", story: "Légumes crus en bâtonnets à tremper dans huile d'olive du Monte Titano." },
          { name: "Stridalin sammarinese", story: "Salade aux herbes sauvages des Apennins et huile d'olive locale." }
        ],
        moyen: [
          { name: "Passatelli in brodo", story: "Pâtes fraîches en chapelure et parmesan pochées en bouillon clair." },
          { name: "Cappelletti in brodo", story: "Petits chapeaux farcis viande pochés en bouillon de chapon." },
          { name: "Strangulapreti", story: "Quenelles aux blettes et ricotta des Apennins en sauce beurre-sauge." }
        ],
        challenge: [
          { name: "Tortelli alla lastra", story: "Pâtes carrées romagnoles cuites sur pierre brûlante, farcies fromage et herbes." },
          { name: "Cappelletti farcis", story: "Petits chapeaux pochés au cinq fromages, technique du pliage à la main." },
          { name: "Risotto sammarinese", story: "Risotto au safran avec saucisse romagnole et fromage de Parme." }
        ]
      },
      plat: {
        facile: [
          { name: "Pasta al ragù", story: "Pâtes au ragù romagnol-bolognais mijoté à la sauce tomate et lardons." },
          { name: "Pollo all'aglio", story: "Poulet rôti à l'ail et romarin, plat-réflexe sammarinais." },
          { name: "Tagliatelle al sugo", story: "Tagliatelles fraîches sammarinaises à la sauce tomate et basilic." }
        ],
        moyen: [
          { name: "Coniglio alla sammarinese", story: "Lapin braisé au vin Sangiovese et romarin, plat-trésor du Monte Titano." },
          { name: "Strozzapreti al ragù", story: "Pâtes 'étrangle-prêtre' au ragù de saucisses romagnoles." },
          { name: "Castrato alla brace", story: "Mouton castrat grillé sur braises de bois d'olivier, plat de fête." }
        ],
        challenge: [
          { name: "Tortelli farcis", story: "Tortellini farcis sammarinois au cinq fromages des Apennins, sauce truffée." },
          { name: "Faraona en cocotte", story: "Pintade braisée au vin Sangiovese, olives noires et tomates anciennes." },
          { name: "Polenta e selvaggina", story: "Polenta sammarinaise avec gibier des Apennins en sauce concentrée." }
        ]
      },
      dessert: {
        facile: [
          { name: "Bustrengo", story: "Gâteau-pudding sammarinois au pain rassis, fruits secs et figues, plat-réflexe rural." },
          { name: "Ciambella romagnola", story: "Couronne briochée à l'anis et zestes d'agrumes, dessert-goûter sammarinois." },
          { name: "Zuppa inglese", story: "Trifle italien à la liqueur Alchermes, crème pâtissière et biscuits Savoiardi." }
        ],
        moyen: [
          { name: "Torta Tre Monti", story: "Gâteau aux trois monts symbolisant Saint-Marin, gaufrette et chocolat noir." },
          { name: "Cassoni dolci", story: "Demi-piadinas sucrées garnies de marmelade ou ricotta-cannelle." },
          { name: "Pinza sammarinese", story: "Cake aux fruits secs des Apennins, plat-trésor de Noël local." }
        ],
        challenge: [
          { name: "Bustrengo cérémoniel", story: "Version festive du bustrengo en plat rond aux 12 fruits et noix." },
          { name: "Cassata sammarinese", story: "Cassata aux ricotta des Apennins, fruits confits et chocolat amer." },
          { name: "Tortellini dolci", story: "Tortellini sucrés farcis pâte de noix, technique du pliage en chapeau." }
        ]
      },
      snacks: {
        facile: [
          { name: "Piadina farcie", story: "Pain plat sammarinais garni de fromage frais, prosciutto et roquette." },
          { name: "Crescentine", story: "Pain rond romagnol cuit dans terre cuite, snack à grignoter chaud." },
          { name: "Borlenghi", story: "Crêpes très fines romagnoles garnies pancetta et romarin." }
        ],
        moyen: [
          { name: "Piadina-prosciutto", story: "Piadina classique au prosciutto di Parma, fromage et roquette." },
          { name: "Cassoni mini", story: "Mini-piadinas pliées garnies blettes-squacquerone, à grignoter chaudes." },
          { name: "Erbazzone bouchée", story: "Mini-portions de tarte aux blettes et parmesan en cuillère apéro." }
        ],
        challenge: [
          { name: "Piadina avec tartufo", story: "Piadina au prosciutto di Parma et lamelles de truffe noire d'Acqualagna." },
          { name: "Cresce sfogliata", story: "Pain feuilleté sammarinais aux herbes, technique du feuilletage à la main." },
          { name: "Bombette romagnoles", story: "Petits rouleaux de viande farcis fromage, grillés en mini-portions." }
        ]
      }
    }
  },
  {
    code: "RS", name: "Serbie", flag: "RS", artist: "Lavina", song: "Kraj mene", color: "#3a0ca3", youtubeId: "FJTLKBOOE98",
    dishesInput: {
      apero: {
        facile: [
          { name: "Ajvar et pain", story: "Tartinade serbe aux poivrons rôtis et aubergines, sur pain plat tiède." },
          { name: "Kajmak frais", story: "Crème caillée serbe sur pain plat avec ciboulette et concombre." },
          { name: "Olives à la sarriette", story: "Olives noires de Voïvodine marinées huile et sarriette." }
        ],
        moyen: [
          { name: "Gibanica", story: "Tourte serbe aux feuilles de pâte filo et fromage frais, en mini-bouchées." },
          { name: "Proja", story: "Pain de maïs serbe au fromage frais et lardons fumés, à découper en parts." },
          { name: "Sremska kobasica", story: "Saucisse fumée de Voïvodine tranchée fine, snack-apéro serbe." }
        ],
        challenge: [
          { name: "Pršuta serbe", story: "Jambon cru fumé de Šumadija, technique de séchage à 1000m d'altitude." },
          { name: "Kajmak en croûte", story: "Crème caillée enfermée dans pâte feuilletée puis poêlée, technique délicate." },
          { name: "Ajvar fait maison", story: "Ajvar artisanal aux poivrons rouges grillés et concassés, technique de la cuisson lente." }
        ]
      },
      entree: {
        facile: [
          { name: "Šopska salata", story: "Tomates, concombres, oignon et fromage râpé, version serbe avec urnebes." },
          { name: "Tarator serbe", story: "Soupe froide au yaourt et concombre, plat-réflexe d'été." },
          { name: "Salade gibanica", story: "Mini-portions de gibanica découpées en salade, à servir tiède." }
        ],
        moyen: [
          { name: "Pasulj", story: "Soupe-plat aux haricots blancs, paprika fumé et lard, plat-réflexe rural." },
          { name: "Riblja čorba", story: "Soupe de poisson serbe au paprika doux, plat des pêcheurs du Danube." },
          { name: "Sarma mini", story: "Mini-feuilles de chou ou de vigne farcies riz-viande, technique du roulage." }
        ],
        challenge: [
          { name: "Sarma serbe", story: "Choux fermenté farci viande-riz longuement mijoté avec lard fumé, plat-réflexe slave." },
          { name: "Punjene paprike", story: "Poivrons farcis viande-riz avec sauce tomate-paprika, technique de la cuisson lente." },
          { name: "Gibanica festive", story: "Gibanica royale en multi-couches de pâte filo, technique de la pâte étirée." }
        ]
      },
      plat: {
        facile: [
          { name: "Ćevapi", story: "Petites saucisses sans peau aux épices, grillées au charbon avec lepinja et oignons." },
          { name: "Pljeskavica", story: "Steak haché géant épicé, garni de kajmak, oignons et urnebes salata." },
          { name: "Karađorđeva šnicla simple", story: "Escalope panée enroulée farcie kajmak, version simplifiée." }
        ],
        moyen: [
          { name: "Mućkalica", story: "Ragoût-plat de viande mélangée et poivrons en pot de terre serbe." },
          { name: "Kapama serbe", story: "Pot de viandes mélangées (porc, agneau) avec choux, plat festif." },
          { name: "Punjena tikvica", story: "Courgettes farcies au riz et viande hachée, sauce tomate-paprika." }
        ],
        challenge: [
          { name: "Karađorđeva šnicla", story: "Escalope géante panée enroulée et farcie kajmak, plat technique du chef." },
          { name: "Pečenje", story: "Cochon ou agneau entier rôti à la broche, plat de fête serbe par excellence." },
          { name: "Đuveč", story: "Plat-pot serbe aux légumes mélangés et viande hachée, technique de la cuisson lente au four." }
        ]
      },
      dessert: {
        facile: [
          { name: "Krofne", story: "Beignets ronds serbes saupoudrés de sucre, snack du carnaval." },
          { name: "Vanilice", story: "Petits biscuits sandwichs à la confiture, dessert d'enfance serbe." },
          { name: "Tulumbe", story: "Beignets cannelés serbes trempés dans un sirop, technique de la pâte." }
        ],
        moyen: [
          { name: "Reforma torta", story: "Gâteau serbe au chocolat et noisettes en multi-couches, plat de fête." },
          { name: "Knedle sa šljivama", story: "Boulettes de pâte farcies aux prunes entières, roulées dans la chapelure beurrée." },
          { name: "Princess krofne", story: "Beignets serbes farcis crème vanille et glacés au chocolat, version royale." }
        ],
        challenge: [
          { name: "Reforma cérémoniel", story: "Reforma torta de fête en multi-couches précises, technique d'assemblage minutieuse." },
          { name: "Beli šam", story: "Crème blanche serbe aux blancs d'œufs et amandes, technique de la meringue cuite." },
          { name: "Šnenokle", story: "Œufs en neige serbes pochés sur crème vanille, technique du pochage parfait." }
        ]
      },
      snacks: {
        facile: [
          { name: "Burek serbe", story: "Pâte filo enroulée farcie viande, fromage ou pomme de terre, snack des bars." },
          { name: "Pita zeljanica", story: "Tourte aux blettes et fromage frais en pâte fine étirée à la main." },
          { name: "Kobasica grillée", story: "Saucisses fumées de Voïvodine grillées au feu de bois." }
        ],
        moyen: [
          { name: "Pljeskavica wrap", story: "Pita garnie de pljeskavica grillée, oignons crus et kajmak frais." },
          { name: "Ajvar sandwich", story: "Pain plat serbe garni d'ajvar, fromage de Sjenica et tomate." },
          { name: "Pita sa sirom", story: "Tourte serbe au fromage frais en pâte filo, à découper en parts." }
        ],
        challenge: [
          { name: "Karađorđeva mini", story: "Mini-portions d'escalope farcie au kajmak en cuillère apéritif." },
          { name: "Đuveč en bouchée", story: "Mini-portions de plat-pot aux légumes en cuillère individuelle." },
          { name: "Krofne fourrées", story: "Beignets serbes individuels farcis confiture de roses ou crème, technique délicate." }
        ]
      }
    }
  },
  {
    code: "SE", name: "Suède", flag: "SE", artist: "Felicia", song: "My System", color: "#0077b6", youtubeId: "ibbfS8iG450",
    dishesInput: {
      apero: {
        facile: [
          { name: "Knäckebröd et gravlax", story: "Cracker de seigle suédois avec saumon mariné aneth-sucre-sel et moutarde." },
          { name: "Västerbottenost cubes", story: "Cubes de fromage Västerbotten suédois aigre, à servir avec confiture d'airelles." },
          { name: "Olives à l'aneth", story: "Olives marinées à l'aneth et zeste de citron, version scandinave." }
        ],
        moyen: [
          { name: "Toast Skagen", story: "Tartines suédoises de crevettes nordiques, mayonnaise, aneth et œuf de lump." },
          { name: "Inlagd sill", story: "Hareng mariné suédois en cinq sauces (curry, moutarde, oignon, aneth, tomate)." },
          { name: "Pickled herring rolls", story: "Petits roulés de pain de seigle au hareng mariné et œuf dur." }
        ],
        challenge: [
          { name: "Surströmming en cuillère", story: "Hareng fermenté suédois en mini-portion, défi olfactif culte." },
          { name: "Janssons frestelse mini", story: "Mini-gratin de pommes de terre, anchois et oignons, en mini-portions." },
          { name: "Köttbullar mini", story: "Mini-boulettes suédoises avec airelles et sauce crème en cuillère." }
        ]
      },
      entree: {
        facile: [
          { name: "Pressgurka", story: "Concombres pressés suédois au vinaigre, sucre et aneth, l'accompagnement classique." },
          { name: "Salade de hareng", story: "Hareng mariné aux pommes de terre et betteraves, version suédoise." },
          { name: "Gravlax simple", story: "Saumon mariné aneth-sucre-sel tranché fin, sauce moutarde douce." }
        ],
        moyen: [
          { name: "Ärtsoppa", story: "Soupe suédoise aux pois cassés et lardons fumés, plat-réflexe du jeudi." },
          { name: "Västerbottenpaj", story: "Tarte salée au fromage Västerbotten et œufs en pâte sablée." },
          { name: "Senapssill", story: "Hareng à la moutarde douce et aneth, plat-réflexe des smörgåsbord." }
        ],
        challenge: [
          { name: "Skagenröra", story: "Salade de crevettes nordiques au caviar, mayonnaise et aneth, technique de l'assemblage." },
          { name: "Smörgåstårta", story: "Sandwich-gâteau suédois aux multiples couches de garnitures, technique d'assemblage." },
          { name: "Hjortronsoppa", story: "Soupe froide aux mûres jaunes des marais, dessert-entrée scandinave." }
        ]
      },
      plat: {
        facile: [
          { name: "Köttbullar", story: "Boulettes suédoises en sauce crème avec airelles et purée de pommes de terre." },
          { name: "Pytt i panna", story: "Hachis suédois aux restes de viande, pommes de terre et œuf au plat." },
          { name: "Falukorv", story: "Saucisse suédoise géante grillée et tranchée avec moutarde et purée." }
        ],
        moyen: [
          { name: "Janssons frestelse", story: "Gratin de pommes de terre, oignons et anchois suédois, plat de Noël." },
          { name: "Kalops", story: "Ragoût suédois de bœuf au vinaigre, oignons et baies de piment de Jamaïque." },
          { name: "Pytt i panna luxe", story: "Version festive du hachis avec entrecôte, betteraves et œuf de canard." }
        ],
        challenge: [
          { name: "Kroppkakor", story: "Boulettes suédoises de pommes de terre farcies au lard fumé, plat-réflexe d'hiver." },
          { name: "Inkokt lax", story: "Saumon froid en gelée aux herbes et concombres, plat de fête suédois." },
          { name: "Wallenbergare", story: "Steak haché suédois ultra-tendre à la crème et œuf, technique de la mise en mousse." }
        ]
      },
      dessert: {
        facile: [
          { name: "Chokladbollar", story: "Boules de chocolat-avoine roulées dans la noix de coco, snack-dessert suédois." },
          { name: "Kanelbulle", story: "Brioche à la cannelle et cardamome roulée en spirale, dessert-icône suédois." },
          { name: "Punschrulle", story: "Roulés roses au punch de Carlshamn glacés au chocolat, dessert de fika." }
        ],
        moyen: [
          { name: "Kladdkaka", story: "Gâteau au chocolat suédois cœur fondant non cuit à cœur, dessert maison réflexe." },
          { name: "Semla", story: "Brioche à la cardamome farcie pâte d'amande et crème fouettée, dessert du Mardi gras." },
          { name: "Mazariner", story: "Tartelettes suédoises aux amandes glacées au sucre, plat des cafés." }
        ],
        challenge: [
          { name: "Prinsesstårta", story: "Gâteau princesse à étages génoise, crème, framboise et pâte d'amande verte." },
          { name: "Sju sorters kakor", story: "Sept sortes de gâteaux: tradition de café suédois imposant 7 desserts." },
          { name: "Knäck", story: "Caramel suédois au sucre et crème, technique précise de la cuisson au cuivre." }
        ]
      },
      snacks: {
        facile: [
          { name: "Kanelbulle snack", story: "Mini-brioches à la cannelle à grignoter avec un café, fika suédois." },
          { name: "Lussekatter", story: "Brioches au safran en forme de S, dessert de Sainte-Lucie le 13 décembre." },
          { name: "Knäckebröd", story: "Pain plat suédois croustillant à grignoter avec beurre et fromage." }
        ],
        moyen: [
          { name: "Räksmörgås", story: "Sandwich géant suédois aux crevettes nordiques, œuf, mayo et œuf de lump." },
          { name: "Tunnbrödsrulle", story: "Pain plat fin roulé au saucisses, purée et oignons frits, street food de Stockholm." },
          { name: "Korvbröd", story: "Hot dog suédois dans pain mou avec moutarde, ketchup et oignons frits." }
        ],
        challenge: [
          { name: "Köttbullar i pita", story: "Pita garnie de boulettes suédoises, sauce crème et airelles." },
          { name: "Surströmming en bouchée", story: "Mini-portions de hareng fermenté sur knäckebröd, défi de fête." },
          { name: "Smörgåstårta mini", story: "Mini-sandwich-gâteaux suédois en mini-portions individuelles." }
        ]
      }
    }
  },
  {
    code: "CH", name: "Suisse", flag: "CH", artist: "Veronica Fusaro", song: "Alice", color: "#e5383b", youtubeId: "PfpYGAzW5dM",
    dishesInput: {
      apero: {
        facile: [
          { name: "Bündnerfleisch tranches", story: "Bœuf séché des Grisons tranché extra-fin, l'apéro suisse iconique." },
          { name: "Raclette bites", story: "Mini-portions de fromage à raclette fondu sur petites pommes de terre." },
          { name: "Trockenfleisch valaisan", story: "Viande séchée du Valais en fines tranches, marbrée et fondante." }
        ],
        moyen: [
          { name: "Cervelas pané", story: "Saucisse suisse cervelas tranchée et panée, version apéro à grignoter." },
          { name: "Mini-fondue en cuillère", story: "Mini-portions de fondue moitié-moitié avec petits cubes de pain." },
          { name: "Olma sandwich", story: "Pain rond suisse garni de saucisses Olma et moutarde sucrée." }
        ],
        challenge: [
          { name: "Malakoffs", story: "Beignets suisses au gruyère originaires de la Côte vaudoise, technique de la pâte." },
          { name: "Soupe d'orge bouchée", story: "Mini-portions de soupe d'orge grisonne en cuillère apéritif." },
          { name: "Käsewähe mini", story: "Mini-tartes salées au fromage de montagne suisse, technique de la pâte sablée." }
        ]
      },
      entree: {
        facile: [
          { name: "Salade de cervelas", story: "Salade de saucisses suisses tranchées avec gruyère, oignons et vinaigrette." },
          { name: "Salade de pommes Roesti", story: "Salade aux pommes Roesti suisses, vinaigrette à la moutarde douce." },
          { name: "Soupe d'orge légère", story: "Velouté d'orge perlé suisse aux légumes-racines et lardons fumés." }
        ],
        moyen: [
          { name: "Soupe d'orge grisonne", story: "Soupe-plat d'orge perlé aux Bündnerfleisch et légumes, plat-trésor des Grisons." },
          { name: "Cholera valaisanne", story: "Tourte salée valaisanne aux poireaux, pommes de terre, fromage et fruits." },
          { name: "Maluns", story: "Pommes de terre râpées et farine sautées au beurre, plat-réflexe grison." }
        ],
        challenge: [
          { name: "Älplermagronen entrée", story: "Mini-portions de pâtes-fromage-pommes de terre avec compote de pommes." },
          { name: "Capuns", story: "Quenelles grisonnes aux feuilles de blette et viande hachée, mijotées au lait." },
          { name: "Pizokels", story: "Petites pâtes grisonnes au sarrasin sautées au beurre et fromage de montagne." }
        ]
      },
      plat: {
        facile: [
          { name: "Rösti", story: "Galette suisse de pommes de terre râpées dorée au beurre clarifié." },
          { name: "Saucisse-rösti", story: "Saucisses suisses (cervelas, Olma) avec rösti dorée et compote." },
          { name: "Älplermagronen simple", story: "Pâtes-fromage-pommes de terre avec compote de pommes, plat-réflexe alpin." }
        ],
        moyen: [
          { name: "Zürcher Geschnetzeltes", story: "Émincé de veau zurichois en sauce crème-vin blanc-champignons sur rösti." },
          { name: "Älplermagronen complète", story: "Pâtes, pommes de terre, fromage et lardons gratinés avec compote, plat des bergers." },
          { name: "Polenta avec saucisse", story: "Polenta tessinoise crémeuse au beurre avec saucisse luganighe grillée." }
        ],
        challenge: [
          { name: "Fondue moitié-moitié", story: "Fondue suisse au gruyère et vacherin fribourgeois, technique du caquelon." },
          { name: "Raclette", story: "Fromage à raclette fondu raclé directement sur la meule, plat-soirée valaisan." },
          { name: "Berner Platte", story: "Plat bernois avec viandes mélangées (porc, bœuf, saucisses) et choucroute, plat festif." }
        ]
      },
      dessert: {
        facile: [
          { name: "Meringues double crème", story: "Meringues croquantes avec double-crème de Gruyère, simplicité maîtrisée." },
          { name: "Carac", story: "Tartelette suisse au chocolat avec point vert, dessert-icône des boulangeries." },
          { name: "Engadiner Nusstorte simple", story: "Tarte des Grisons aux noix et caramel, version simplifiée." }
        ],
        moyen: [
          { name: "Engadiner Nusstorte", story: "Tarte engadinoise aux noix et miel caramélisé en pâte sablée riche." },
          { name: "Birnbrot", story: "Pain aux poires séchées et noix, plat-trésor grison et appenzellois." },
          { name: "Vermicelles", story: "Spaghetti de purée de marrons sucrée à la chantilly, dessert d'automne." }
        ],
        challenge: [
          { name: "Zuger Kirschtorte", story: "Tarte de Zoug à étages génoise, kirsch et amandes, technique d'assemblage." },
          { name: "Schaffhauser Bölletünne", story: "Tarte de Schaffhouse aux oignons confits et lardons, technique sucrée-salée." },
          { name: "Cremeschnitte", story: "Mille-feuille suisse à la crème vanille épaisse et glaçage marbré." }
        ]
      },
      snacks: {
        facile: [
          { name: "Bündnerfleisch sandwich", story: "Pain de seigle suisse garni de Bündnerfleisch et beurre fouetté." },
          { name: "Cervelas grillé", story: "Saucisse suisse grillée au feu de bois avec moutarde et pain de campagne." },
          { name: "Müesli original", story: "Mélange de flocons d'avoine, lait, fruits et noix, snack-dessert suisse." }
        ],
        moyen: [
          { name: "Wurstsalat", story: "Salade de saucisse suisse tranchée avec gruyère, vinaigrette." },
          { name: "Knöpfli", story: "Mini-spätzle suisses sautés au beurre et oignons confits, plat-snack alpin." },
          { name: "Birchermüesli", story: "Müesli original suisse aux pommes râpées, noisettes et raisins, snack-réflexe." }
        ],
        challenge: [
          { name: "Capuns mini", story: "Mini-portions de quenelles grisonnes en cuillère avec sauce béchamel." },
          { name: "Älplermagronen en cuillère", story: "Mini-portions des pâtes-fromage-pommes de terre en cuillère individuelle." },
          { name: "Cholera mini", story: "Mini-tourtes valaisannes individuelles aux pommes de terre et fruits." }
        ]
      }
    }
  },
  {
    code: "UA", name: "Ukraine", flag: "UA", artist: "Leléka", song: "Ridnym", color: "#ffd60a", youtubeId: "SoEXezpblAc",
    dishesInput: {
      apero: {
        facile: [
          { name: "Salo et pain noir", story: "Lard ukrainien salé tranché fin sur pain noir avec ail cru, snack-apéro slave." },
          { name: "Pampushky à l'ail", story: "Petits pains ukrainiens au beurre d'ail et persil, accompagnement du borscht." },
          { name: "Légumes lacto-fermentés", story: "Concombres, choux et tomates lacto-fermentés à l'ail et aneth." }
        ],
        moyen: [
          { name: "Deruny", story: "Galettes ukrainiennes de pommes de terre râpées à la crème aigre et lardons." },
          { name: "Kovbasa tranche", story: "Saucisse fumée ukrainienne tranchée fine, snack-apéro classique." },
          { name: "Varenyky mini", story: "Mini-raviolis ukrainiens farcis fromage blanc, pommes de terre ou cerises." }
        ],
        challenge: [
          { name: "Salo aux herbes maison", story: "Lard ukrainien mariné aux herbes et ail, technique du salage à sec." },
          { name: "Drogobych saucisse", story: "Saucisse ukrainienne fumée du nord, technique du salaison artisanale." },
          { name: "Holodets", story: "Aspic ukrainien de viande à l'ail et raifort, technique de la gelée transparente." }
        ]
      },
      entree: {
        facile: [
          { name: "Olivier ukrainien", story: "Salade russe ukrainienne aux légumes-racines, viande et œufs avec mayonnaise." },
          { name: "Vinaigrette ukrainienne", story: "Salade aux betteraves, pommes de terre, choucroute et concombres." },
          { name: "Salade Mimoza", story: "Salade ukrainienne en couches: poisson, œuf, fromage râpé et carottes." }
        ],
        moyen: [
          { name: "Borscht", story: "Soupe ukrainienne aux betteraves, viande et chou, plat-trésor national." },
          { name: "Solyanka", story: "Soupe-plat ukrainienne aigre-piquante aux saucisses, cornichons et olives." },
          { name: "Kapusniak", story: "Soupe ukrainienne au chou fermenté, lardons et pommes de terre." }
        ],
        challenge: [
          { name: "Holubtsi mini", story: "Mini-feuilles de choux farcies au riz et viande, technique du roulage." },
          { name: "Varenyky farcis", story: "Raviolis ukrainiens farcis champignons, viande ou fromage, pochés et beurre." },
          { name: "Kanaplyak", story: "Pain de viande ukrainien aux abats et herbes, plat de fête villageois." }
        ]
      },
      plat: {
        facile: [
          { name: "Varenyky", story: "Raviolis ukrainiens demi-lune farcis pomme de terre-fromage, dorés au beurre." },
          { name: "Holubtsi", story: "Choux farcis viande-riz mijotés en sauce tomate-crème aigre." },
          { name: "Kotlety", story: "Boulettes ukrainiennes plates de porc-bœuf à la chapelure, version maison." }
        ],
        moyen: [
          { name: "Borshch riche", story: "Borscht complet aux betteraves, viande, chou et pampushky à l'ail, plat-réflexe." },
          { name: "Banosh", story: "Polenta ukrainienne au beurre et fromage frais, technique des Carpathes." },
          { name: "Holubtsi de fête", story: "Choux farcis viande-riz longuement mijotés avec lard fumé, plat-trésor." }
        ],
        challenge: [
          { name: "Kotleta po-Kyivsky", story: "Escalope panée ukrainienne farcie beurre persillé qui jaillit, technique délicate." },
          { name: "Pidpenky avec polenta", story: "Champignons des bois ukrainiens en sauce crème sur banosh des Carpathes." },
          { name: "Halushky", story: "Quenelles ukrainiennes pochées en bouillon, plat-réflexe rural des fermes." }
        ]
      },
      dessert: {
        facile: [
          { name: "Syrniki", story: "Galettes ukrainiennes au fromage blanc dorées au beurre avec confiture." },
          { name: "Kissel", story: "Compote ukrainienne liée à la fécule, à boire chaude ou froide." },
          { name: "Pampushky sucrés", story: "Beignets ukrainiens fourrés à la confiture, dessert-snack des cafés." }
        ],
        moyen: [
          { name: "Medivnyk", story: "Gâteau au miel ukrainien, plat-réflexe de Noël et Pâques orthodoxes." },
          { name: "Pampushky aux pavots", story: "Beignets ukrainiens à la pâte de pavot moulu, technique de la garniture." },
          { name: "Mlyntsi farcis", story: "Crêpes ukrainiennes très fines fourrées fromage blanc et raisins." }
        ],
        challenge: [
          { name: "Kyiv cake", story: "Gâteau soviétique-ukrainien aux meringues, noix et crème caramel, plat-icône." },
          { name: "Medovik 12 couches", story: "Gâteau au miel ukrainien à 12 fines couches alternées avec crème aigre." },
          { name: "Paska de Pâques", story: "Brioche-tour ukrainienne décorée glacée pour Pâques orthodoxe, technique des bénédictions." }
        ]
      },
      snacks: {
        facile: [
          { name: "Pampushky garlic", story: "Petits pains ronds ukrainiens à l'ail et persil, snack-réflexe avec borscht." },
          { name: "Salo sandwich", story: "Tranche de pain noir ukrainien au lard salé et ail cru." },
          { name: "Korovai mini", story: "Mini-versions du pain de mariage ukrainien décoré, en bouchées sucrées." }
        ],
        moyen: [
          { name: "Varenyky frits", story: "Raviolis ukrainiens dorés à la poêle au beurre et oignons frits, snack-leftovers." },
          { name: "Deruny à la crème", story: "Galettes ukrainiennes de pommes de terre nappées de crème aigre et aneth." },
          { name: "Kovbasa-pita", story: "Pita garnie de saucisse fumée ukrainienne et choucroute." }
        ],
        challenge: [
          { name: "Kotleta po-Kyivsky en bouchée", story: "Mini-escalopes farcies beurre persillé en cuillère, technique du jaillissement." },
          { name: "Banosh mini", story: "Mini-portions de polenta ukrainienne au beurre et brynza en cuillère." },
          { name: "Holubtsi mini", story: "Mini-feuilles de choux farcies en cuillère apéritif avec crème aigre." }
        ]
      }
    }
  },
  {
    code: "GB", name: "Royaume-Uni", flag: "GB", artist: "Look Mum No Computer", song: "Eins, Zwei, Drei", color: "#03045e", youtubeId: "niMKvJ-Itq8",
    dishesInput: {
      apero: {
        facile: [
          { name: "Cheddar et pickles", story: "Cubes de cheddar mature de Somerset avec pickles Branston classiques." },
          { name: "Pork pies mini", story: "Mini-pâtés en croûte britanniques au porc en gelée, IGP de Melton Mowbray." },
          { name: "Scotch eggs mini", story: "Mini-œufs durs enrobés de chair à saucisse, panés et frits dorés." }
        ],
        moyen: [
          { name: "Sausage rolls", story: "Friands britanniques à la chair à saucisse en pâte feuilletée, snack pub." },
          { name: "Welsh rarebit toasts", story: "Tartines galloises au cheddar fondu, bière et moutarde, gratinées au four." },
          { name: "Cucumber sandwiches", story: "Mini-sandwichs très fins au concombre et beurre, classique de l'afternoon tea." }
        ],
        challenge: [
          { name: "Kedgeree en bouchée", story: "Mini-portions de riz au curry et haddock fumé en bouchée, héritage du Raj." },
          { name: "Coronation chicken canapés", story: "Tartines au poulet à la mayonnaise-curry-raisins, créées pour Élisabeth II." },
          { name: "Smoked salmon blinis", story: "Blinis au saumon fumé écossais, crème fraîche et œufs de lump." }
        ]
      },
      entree: {
        facile: [
          { name: "Coronation chicken", story: "Salade de poulet à la mayonnaise-curry-raisins, créée pour le couronnement de 1953." },
          { name: "Prawn cocktail", story: "Crevettes au sauce Marie-Rose dans verre, classique des dîners britanniques." },
          { name: "Cream of tomato", story: "Velouté de tomates britannique à la crème, plat-réflexe des soirs frais." }
        ],
        moyen: [
          { name: "Leek and potato soup", story: "Velouté gallois aux poireaux et pommes de terre à la crème fraîche." },
          { name: "Welsh rarebit", story: "Toast gratiné au cheddar, bière brune et moutarde anglaise, plat-réflexe pub." },
          { name: "Cock-a-leekie", story: "Soupe écossaise au poulet et poireaux avec pruneaux, plat-réflexe traditionnel." }
        ],
        challenge: [
          { name: "Stilton soup", story: "Velouté britannique au Stilton bleu et porto, technique de l'équilibre des saveurs." },
          { name: "Smoked haddock chowder", story: "Soupe de haddock fumé écossais au lait et pommes de terre, plat-trésor." },
          { name: "Lobster bisque", story: "Bisque de homard britannique à la crème et brandy, technique du clarification." }
        ]
      },
      plat: {
        facile: [
          { name: "Bangers and mash", story: "Saucisses britanniques sur purée de pommes de terre avec sauce au cidre." },
          { name: "Toad in the hole", story: "Saucisses cuites dans pâte à Yorkshire pudding, plat-réflexe pub." },
          { name: "Roast chicken", story: "Poulet rôti britannique à l'huile d'herbes, sauce au pain et stuffing." }
        ],
        moyen: [
          { name: "Shepherd's pie", story: "Hachis parmentier britannique à l'agneau haché et purée gratinée." },
          { name: "Fish and chips", story: "Cabillaud en pâte à bière et frites épaisses, vinaigre malt et mushy peas." },
          { name: "Steak and ale pie", story: "Tourte de bœuf braisée à la bière brune en pâte feuilletée." }
        ],
        challenge: [
          { name: "Beef Wellington", story: "Filet de bœuf en croûte feuilletée avec duxelles de champignons et crêpe, plat de fête." },
          { name: "Sunday roast", story: "Rôti dominical anglais avec Yorkshire pudding, gravy, légumes et pommes de terre rôties." },
          { name: "Lancashire hotpot", story: "Ragoût d'agneau du Lancashire aux pommes de terre tranchées, longuement cuit." }
        ]
      },
      dessert: {
        facile: [
          { name: "Shortbread", story: "Sablés écossais au beurre et farine de riz, technique des trois ingrédients." },
          { name: "Bread and butter pudding", story: "Pudding britannique au pain rassis, raisins et crème vanille au four." },
          { name: "Eton mess", story: "Meringues écrasées avec crème fouettée et fraises, créé au collège d'Eton." }
        ],
        moyen: [
          { name: "Sticky toffee pudding", story: "Pudding aux dattes nappé de sauce caramel chaude, dessert-icône britannique." },
          { name: "Trifle", story: "Trifle anglais en couches: génoise, sherry, gelée, custard et chantilly." },
          { name: "Bakewell tart", story: "Tarte britannique aux amandes et confiture de framboise, IGP du Derbyshire." }
        ],
        challenge: [
          { name: "Christmas pudding", story: "Pudding de Noël britannique aux fruits secs et brandy, flambé à table." },
          { name: "Spotted dick", story: "Pudding cuit à la vapeur aux raisins de Corinthe, dessert-réflexe british." },
          { name: "Battenberg cake", story: "Gâteau quadrillé rose-jaune enrobé de pâte d'amande, technique de l'assemblage." }
        ]
      },
      snacks: {
        facile: [
          { name: "Crumpets", story: "Petits pains anglais alvéolés à toaster avec beurre et marmite ou jam." },
          { name: "Scones et jam", story: "Scones britanniques avec confiture de fraises et clotted cream, afternoon tea." },
          { name: "Marmite toast", story: "Tartine grillée britannique au beurre et marmite salée, snack culte." }
        ],
        moyen: [
          { name: "Cornish pasty", story: "Chausson cornouaillais à la viande, pommes de terre et navet, IGP régional." },
          { name: "Bacon butty", story: "Sandwich britannique au bacon grillé, beurre et HP sauce, snack matinal." },
          { name: "Sausage in puff pastry", story: "Saucisses britanniques entières en pâte feuilletée, snack des fish & chip shops." }
        ],
        challenge: [
          { name: "Yorkshire pudding mini", story: "Mini-puddings yorkshires garnis de bœuf et gravy en bouchée." },
          { name: "Black pudding bouchée", story: "Mini-portions de boudin noir britannique avec compote de pommes." },
          { name: "Pork pie maison", story: "Pâté en croûte britannique au porc et gelée, technique de moulage à chaud." }
        ]
      }
    }
  }
];

export const countries: Country[] = countriesData.map((c) => ({
  code: c.code,
  name: c.name,
  flag: c.flag,
  artist: c.artist,
  song: c.song,
  color: c.color,
  youtubeId: c.youtubeId,
  dishes: buildCountryDishes(c.code, c.name, c.dishesInput)
}));

export const sourceNote =
  "Pays et artistes alignés sur les informations disponibles au 25 avril 2026: 35 participants annoncés pour Vienne 2026. Recettes traditionnelles, 9 plats par moment du dîner (3 faciles, 3 moyens, 3 challenge).";
