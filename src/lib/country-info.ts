export type CountryInfo = {
  capital: string;
  population: string;
  welcome: string;
  lat: number;
  lng: number;
};

export const countryInfo: Record<string, CountryInfo> = {
  AL: { capital: "Tirana",        population: "2,8 M",  welcome: "Mirë se vini",        lat: 41.33, lng: 19.83 },
  AM: { capital: "Erevan",        population: "2,9 M",  welcome: "Բարի Գալուստ",        lat: 40.18, lng: 44.51 },
  AU: { capital: "Canberra",      population: "26,5 M", welcome: "G'day",               lat: -35.28, lng: 149.13 },
  AT: { capital: "Vienne",        population: "9,1 M",  welcome: "Willkommen",           lat: 48.21, lng: 16.37 },
  AZ: { capital: "Bakou",         population: "10,4 M", welcome: "Xoş gəldiniz",         lat: 40.41, lng: 49.87 },
  BE: { capital: "Bruxelles",     population: "11,6 M", welcome: "Welkom / Bienvenue",   lat: 50.85, lng:  4.35 },
  BG: { capital: "Sofia",         population: "6,5 M",  welcome: "Добре дошли",          lat: 42.70, lng: 23.32 },
  HR: { capital: "Zagreb",        population: "3,9 M",  welcome: "Dobro došli",          lat: 45.81, lng: 15.98 },
  CY: { capital: "Nicosie",       population: "1,2 M",  welcome: "Καλωσορίσατε",         lat: 35.17, lng: 33.36 },
  CZ: { capital: "Prague",        population: "10,9 M", welcome: "Vítejte",              lat: 50.08, lng: 14.44 },
  DK: { capital: "Copenhague",    population: "5,9 M",  welcome: "Velkommen",            lat: 55.68, lng: 12.57 },
  EE: { capital: "Tallinn",       population: "1,4 M",  welcome: "Tere tulemast",        lat: 59.44, lng: 24.75 },
  FI: { capital: "Helsinki",      population: "5,6 M",  welcome: "Tervetuloa",           lat: 60.17, lng: 24.94 },
  FR: { capital: "Paris",         population: "68,0 M", welcome: "Bienvenue",            lat: 48.86, lng:  2.35 },
  GE: { capital: "Tbilissi",      population: "3,7 M",  welcome: "მოგესალმებით",         lat: 41.69, lng: 44.83 },
  DE: { capital: "Berlin",        population: "84,5 M", welcome: "Willkommen",           lat: 52.52, lng: 13.41 },
  GR: { capital: "Athènes",       population: "10,4 M", welcome: "Καλωσορίσατε",         lat: 37.98, lng: 23.73 },
  IL: { capital: "Tel Aviv",      population: "9,7 M",  welcome: "ברוכים הבאים",          lat: 32.09, lng: 34.79 },
  IT: { capital: "Rome",          population: "59,1 M", welcome: "Benvenuto",            lat: 41.90, lng: 12.50 },
  LV: { capital: "Riga",          population: "1,8 M",  welcome: "Laipni lūdzam",        lat: 56.95, lng: 24.11 },
  LT: { capital: "Vilnius",       population: "2,8 M",  welcome: "Sveiki atvykę",        lat: 54.69, lng: 25.28 },
  LU: { capital: "Luxembourg",    population: "0,67 M", welcome: "Willkommen",           lat: 49.61, lng:  6.13 },
  MT: { capital: "La Valette",    population: "0,52 M", welcome: "Merħba",               lat: 35.90, lng: 14.51 },
  MD: { capital: "Chișinău",      population: "2,6 M",  welcome: "Bun venit",            lat: 47.01, lng: 28.86 },
  ME: { capital: "Podgorica",     population: "0,63 M", welcome: "Dobrodošli",           lat: 42.44, lng: 19.26 },
  NO: { capital: "Oslo",          population: "5,4 M",  welcome: "Velkommen",            lat: 59.91, lng: 10.75 },
  PL: { capital: "Varsovie",      population: "38,4 M", welcome: "Witamy",               lat: 52.23, lng: 21.01 },
  PT: { capital: "Lisbonne",      population: "10,3 M", welcome: "Bem-vindo",            lat: 38.72, lng: -9.14 },
  RO: { capital: "Bucarest",      population: "19,0 M", welcome: "Bun venit",            lat: 44.43, lng: 26.10 },
  SM: { capital: "Saint-Marin",   population: "34 k",   welcome: "Benvenuto",            lat: 43.94, lng: 12.45 },
  RS: { capital: "Belgrade",      population: "6,8 M",  welcome: "Добродошли",           lat: 44.82, lng: 20.46 },
  SE: { capital: "Stockholm",     population: "10,5 M", welcome: "Välkommen",            lat: 59.33, lng: 18.07 },
  CH: { capital: "Berne",         population: "8,9 M",  welcome: "Willkommen",           lat: 46.95, lng:  7.45 },
  UA: { capital: "Kyiv",          population: "37,5 M", welcome: "Ласкаво просимо",      lat: 50.45, lng: 30.52 },
  GB: { capital: "Londres",       population: "67,4 M", welcome: "Welcome",              lat: 51.51, lng: -0.13 },
};
