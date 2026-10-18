/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Component: EliyasLogo
 * Pixel-accurate vector recreation of Eliyas Wakjira's official "EW" brand emblem logo
 * as uploaded in logo.png:
 * - Rounded squircle container with rich gold accent border (#ECC257 / #F5B800)
 * - Pure ivory-white inner canvas
 * - Bold interlocking monogram of "E" and "W" in deep navy (#083785 / #09265A)
 * - Precision metallic gold gradient facet slices on the horizontal arms of E and diagonal facet of W
 */

export const EliyasLogo = ({ className = "w-10 h-10", alt = "Eliyas Wakjira EW Emblem Logo" }) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md`}
      role="img"
      aria-label={alt}
    >
      <defs>
        {/* Outer Gold Border Gradient */}
        <linearGradient id="ewGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="45%" stopColor="#ECC257" />
          <stop offset="70%" stopColor="#E5A610" />
          <stop offset="100%" stopColor="#F5B800" />
        </linearGradient>

        {/* Inner Gold Accents for E arms and W diagonal slice */}
        <linearGradient id="ewGoldAccent" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#FFD95A" />
          <stop offset="35%" stopColor="#ECC257" />
          <stop offset="75%" stopColor="#E29E0B" />
          <stop offset="100%" stopColor="#F5B300" />
        </linearGradient>

        {/* Deep Navy Blue for EW letterforms */}
        <linearGradient id="ewNavyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#083785" />
          <stop offset="50%" stopColor="#09275E" />
          <stop offset="100%" stopColor="#061E47" />
        </linearGradient>

        {/* Drop shadow filter for subtle depth */}
        <filter id="ewShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Outer Golden Squircle Frame */}
      <rect
        x="24"
        y="24"
        width="464"
        height="464"
        rx="118"
        ry="118"
        fill="url(#ewGoldBorder)"
      />

      {/* Inner White/Off-White Rounded Canvas */}
      <rect
        x="44"
        y="44"
        width="424"
        height="424"
        rx="98"
        ry="98"
        fill="#FCFCFC"
      />

      {/* ======================================================== */}
      {/* MONOGRAM "EW" GLYPH STRUCTURE                            */}
      {/* ======================================================== */}
      <g id="EW_Monogram">
        {/* --- LETTER "E" --- */}
        {/* Left vertical spine and top arm of E */}
        <path
          d="M 130 164
             C 120 164, 114 170, 114 180
             L 114 326
             C 114 336, 120 342, 130 342
             L 242 342
             C 247 342, 252 338, 248 333
             L 240 318
             C 238 314, 234 314, 230 314
             L 152 314
             L 152 266
             L 214 266
             L 214 238
             L 152 238
             L 152 196
             L 242 196
             L 230 164
             Z"
          fill="url(#ewNavyBlue)"
        />

        {/* Gold accent bar on middle arm of E */}
        <path
          d="M 152 198
             L 216 198
             L 226 218
             L 152 218
             Z"
          fill="url(#ewGoldAccent)"
        />

        {/* Gold accent bar on bottom arm of E */}
        <path
          d="M 152 296
             L 232 296
             L 237 314
             L 152 314
             Z"
          fill="url(#ewGoldAccent)"
        />

        {/* --- LETTER "W" --- */}
        {/* Main body of W (deep navy) */}
        {/* First diagonal stem (top part) */}
        <path
          d="M 234 164
             L 266 242
             L 282 234
             L 254 164
             Z"
          fill="url(#ewNavyBlue)"
        />

        {/* Gold facet on the interlocking diagonal between E and W */}
        <path
          d="M 264 240
             L 246 296
             L 262 342
             L 280 292
             Z"
          fill="url(#ewGoldAccent)"
        />

        {/* Main central and right portions of W */}
        <path
          d="M 280 292
             L 262 342
             C 264 346, 269 346, 273 344
             L 348 180
             L 348 180
             L 366 338
             C 367 344, 372 344, 375 340
             L 418 174
             C 420 168, 416 164, 408 164
             L 384 164
             L 358 290
             L 338 164
             L 316 164
             L 288 274
             Z"
          fill="url(#ewNavyBlue)"
        />
      </g>
    </svg>
  );
};

export default EliyasLogo;
