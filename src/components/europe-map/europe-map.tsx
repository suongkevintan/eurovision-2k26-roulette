import "./europe-map.css";
import { countryInfo } from "@/lib/country-info";

type EuropeMapProps = {
  highlightCode: string;
};

// PNG covers lon -15→55 (70°), lat 28→72 in Web Mercator
// Canvas 280×306 matches the PNG's natural Mercator aspect ratio (3839×4190 ≈ 0.916:1)
const LON_MIN = -15, LON_RANGE = 70;
const W = 280, H = 306;

// Zoom window: ±degrees around the capital
const ZOOM_LON = 6;
const ZOOM_LAT = 5;

function mercY(lat: number) {
  const r = (lat * Math.PI) / 180;
  return Math.log(Math.tan(r) + 1 / Math.cos(r));
}
const MERC_TOP = mercY(72);
const MERC_BOT = mercY(28);

function toX(lng: number) { return ((lng - LON_MIN) / LON_RANGE) * W; }
function toY(lat: number) { return ((MERC_TOP - mercY(lat)) / (MERC_TOP - MERC_BOT)) * H; }

function zoomedViewBox(lng: number, lat: number): string {
  let x0 = toX(lng - ZOOM_LON);
  let x1 = toX(lng + ZOOM_LON);
  let y0 = toY(lat + ZOOM_LAT); // north → smaller y
  let y1 = toY(lat - ZOOM_LAT); // south → larger y

  // Shift window if it extends beyond the canvas, then clamp
  if (x0 < 0) { x1 = Math.min(W, x1 - x0); x0 = 0; }
  if (x1 > W) { x0 = Math.max(0, x0 - (x1 - W)); x1 = W; }
  if (y0 < 0) { y1 = Math.min(H, y1 - y0); y0 = 0; }
  if (y1 > H) { y0 = Math.max(0, y0 - (y1 - H)); y1 = H; }

  return `${x0} ${y0} ${x1 - x0} ${y1 - y0}`;
}

export function EuropeMap({ highlightCode }: EuropeMapProps) {
  const isOffMap = highlightCode === "AU";
  const info = countryInfo[highlightCode];
  const hx = info && !isOffMap ? toX(info.lng) : null;
  const hy = info && !isOffMap ? toY(info.lat) : null;
  const viewBox = info && !isOffMap
    ? zoomedViewBox(info.lng, info.lat)
    : `0 0 ${W} ${H}`;

  return (
    <figure className="europe-map" aria-label={`Position de ${highlightCode} sur la carte`}>
      <svg
        className="europe-map__svg"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Geographic PNG background */}
        <image
          href="/assets/europe-map.png"
          x={0} y={0} width={W} height={H}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Gold dot + pulsing ring on highlighted country capital */}
        {hx !== null && hy !== null && (
          <>
            <circle cx={hx} cy={hy} r={2} fill="rgba(255,215,0,0.95)" />
            <circle
              className="europe-map__pulse"
              cx={hx} cy={hy} r={4}
              fill="none" stroke="#ffd700" strokeWidth={0.6}
            />
          </>
        )}
      </svg>

      {isOffMap && (
        <p className="europe-map__offmap">🌏 Australie — Océan Pacifique</p>
      )}
    </figure>
  );
}
