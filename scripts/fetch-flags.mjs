import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/flags/4x3");
const BASE = "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/";

const codes = [
  "al", "am", "au", "at", "az", "be", "bg", "hr", "cy", "cz",
  "dk", "ee", "fi", "fr", "ge", "de", "gr", "il", "it", "lv",
  "lt", "lu", "mt", "md", "me", "no", "pl", "pt", "ro", "sm",
  "rs", "se", "ch", "ua", "gb"
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const code of codes) {
    const url = `${BASE}${code}.svg`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch ${code}: ${res.status}`);
      continue;
    }
    const svg = await res.text();
    const target = resolve(OUT_DIR, `${code}.svg`);
    await fs.writeFile(target, svg, "utf8");
    console.log(`✓ ${code}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
