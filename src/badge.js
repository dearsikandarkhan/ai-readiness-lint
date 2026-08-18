function gradeColor(grade) {
  switch (grade) {
    case "A":
      return "#2ea44f"; // green
    case "B":
      return "#8fbc38";
    case "C":
      return "#dbab09"; // yellow
    case "D":
      return "#e0722a";
    default:
      return "#cf222e"; // red (F)
  }
}

/**
 * Generates a shields.io-style flat badge as raw SVG, e.g.:
 * [ ai-readiness | 72/100 (B) ]
 * No network call, no dependency — safe to run in CI and commit the output.
 */
export function generateBadgeSVG(score, grade) {
  const label = "ai-readiness";
  const value = `${score}/100 (${grade})`;
  const color = gradeColor(grade);

  // Rough character-width estimate to size each pill (Verdana 11px ~ 6.2px/char).
  const charWidth = 6.2;
  const padding = 10;
  const labelWidth = Math.round(label.length * charWidth + padding * 2);
  const valueWidth = Math.round(value.length * charWidth + padding * 2);
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>`;
}
