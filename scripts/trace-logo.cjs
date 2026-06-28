/* One-off: trace the Clix mark (dark-on-white) into a clean SVG outline.
   Run: node scripts/trace-logo.cjs
   Output: public/clix-logo.svg  (consumed by Three.js SVGLoader → ExtrudeGeometry) */
const fs = require("fs");
const path = require("path");
const potrace = require("potrace");

const input = path.join(__dirname, "..", "clix-logo.png"); // original dark-on-white source
const output = path.join(__dirname, "..", "public", "clix-logo.svg");

const params = {
  threshold: 165,        // pixels darker than this become the filled shape
  turdSize: 400,         // drop tiny specks/artifacts
  optTolerance: 0.35,    // curve fitting tolerance
  alphaMax: 1,           // corner smoothing
  color: "#1b1e28",
  background: "transparent",
};

potrace.trace(input, params, (err, svg) => {
  if (err) {
    console.error("trace failed:", err);
    process.exit(1);
  }
  fs.writeFileSync(output, svg, "utf8");
  const paths = (svg.match(/<path/g) || []).length;
  const size = (fs.statSync(output).size / 1024).toFixed(1);
  console.log(`wrote ${output} (${size} KB, ${paths} path element(s))`);
});
