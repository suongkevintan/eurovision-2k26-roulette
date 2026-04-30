// Simplified country polygon paths for Eurovision 2026 map.
// Coordinate system: x=(lng+15)/70*280, y=(72-lat)/44*220
// ViewBox: 0 0 280 220  (lon -15→55, lat 28→72)

export const countryPaths: Record<string, string> = {
  // Iberian Peninsula
  PT: "M22,150 L35,150 L37,156 L36,168 L32,175 L22,175 Z",
  // France (hexagonal)
  FR: "M42,122 L67,105 L80,110 L93,122 L91,141 L84,142 L53,144 Z",
  // Belgium
  BE: "M67,105 L86,102 L87,112 L70,112 Z",
  // Luxembourg (tiny)
  LU: "M83,108 L87,108 L87,112 L83,112 Z",
  // Germany
  DE: "M84,84 L120,84 L120,124 L84,124 Z",
  // Switzerland
  CH: "M84,121 L102,121 L102,131 L84,131 Z",
  // Austria
  AT: "M98,115 L128,115 L130,124 L128,128 L98,128 Z",
  // Czech Republic
  CZ: "M108,105 L136,105 L136,118 L108,118 Z",
  // Poland
  PL: "M116,86 L157,86 L157,115 L116,115 Z",
  // Denmark (Jutland only)
  DK: "M92,82 L110,88 L104,71 L94,68 Z",
  // Sweden
  SE: "M112,15 L157,15 L157,83 L112,83 Z",
  // Norway
  NO: "M79,5 L112,5 L112,83 L92,83 L80,73 Z",
  // Finland
  FI: "M148,60 L178,60 L188,12 L140,12 Z",
  // Estonia
  EE: "M147,62 L173,62 L173,72 L147,72 Z",
  // Latvia
  LV: "M144,70 L173,70 L173,82 L144,82 Z",
  // Lithuania
  LT: "M144,77 L167,77 L167,91 L144,91 Z",
  // Moldova
  MD: "M166,118 L181,118 L181,133 L166,133 Z",
  // Ukraine (large)
  UA: "M148,98 L221,98 L221,138 L148,138 Z",
  // Romania
  RO: "M148,119 L180,119 L180,142 L148,142 Z",
  // Bulgaria
  BG: "M150,139 L174,139 L174,154 L150,154 Z",
  // Serbia
  RS: "M135,129 L152,129 L152,149 L135,149 Z",
  // Croatia (simplified, not full coastal shape)
  HR: "M118,128 L134,128 L140,135 L140,148 L130,152 L118,148 L116,140 Z",
  // Montenegro
  ME: "M134,142 L141,142 L141,151 L134,151 Z",
  // Albania
  AL: "M136,148 L143,148 L144,153 L141,158 L137,160 L134,155 Z",
  // Greece (mainland + peninsula shape)
  GR: "M141,150 L167,150 L165,162 L158,173 L148,182 L144,175 L143,163 Z",
  // North Macedonia / surrounds - not included (not Eurovision)
  // San Marino (tiny, shown as dot only via coordinates)
  SM: "M110,140 L112,140 L112,142 L110,142 Z",
  // Italy (boot shape)
  IT: "M86,124 L102,122 L118,125 L128,133 L130,145 L128,154 L124,162 L122,170 L126,173 L120,175 L112,168 L108,158 L108,148 L102,140 L92,132 Z",
  // Malta (tiny)
  MT: "M117,179 L119,179 L119,181 L117,181 Z",
  // Cyprus
  CY: "M190,182 L197,182 L197,188 L190,188 Z",
  // Israel
  IL: "M197,193 L204,193 L204,213 L197,213 Z",
  // Georgia
  GE: "M220,142 L247,142 L247,155 L220,155 Z",
  // Armenia
  AM: "M234,152 L246,152 L246,162 L234,162 Z",
  // Azerbaijan
  AZ: "M238,150 L262,150 L262,168 L238,168 Z",
  // United Kingdom (England+Scotland simplified)
  GB: "M38,67 L52,62 L67,68 L67,98 L58,107 L38,110 L34,100 L36,80 Z",
};
