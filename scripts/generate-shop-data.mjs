import fs from "fs";
import path from "path";
import os from "os";

/*
 * One-off importer: walks the raw product source folders, copies + slugifies
 * images into public/images/products/, groups obvious colour/angle variants
 * into a single product, and regenerates src/components/Shop/shopData.ts.
 *
 * Prices are PLACEHOLDERS per category (single clean price, no fake discount).
 * Re-run safely: it clears previously generated files (prefixed "gsp-").
 */

const SRC = path.join(
  os.homedir(),
  "Documents/shoaib/data for global supply 600"
);
const PROJECT = path.resolve(process.cwd());
const OUT_IMG_DIR = path.join(PROJECT, "public/images/products");
const OUT_DATA = path.join(PROJECT, "src/components/Shop/shopData.ts");

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".avif", ".webp"]);

// AED prices per category (single clean price, no fake discount).
const PRICE = {
  "Pashmina & Shawls": 6000,
  "Women's Dresses & Abayas": 1000,
  "Women's Tops & Sets": 4000,
  Swimwear: 1500,
  "Men's Clothing": 2000,
};

const COLOR_TOKENS = new Set([
  "blue","green","pink","white","black","orange","silver","red","gold",
  "caramel","fuchsia","beige","grey","gray","brown","navy","cream","sea",
  "b","y","a",
]);

function walk(dir, top = null) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, top ?? entry.name));
    } else if (IMG_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push({ full, top: top ?? "", name: entry.name });
    }
  }
  return out;
}

function categorize(top, name) {
  const t = top.toLowerCase();
  const n = name.toLowerCase();
  if (t.includes("mens cloths")) return "Men's Clothing";
  if (/bikini|swimsuit|swimwear|thong|bandeau|brazilian|micro bikini|triangle swim/.test(n))
    return "Swimwear";
  if (/dress|evening|prom|mermaid|kaftan|abaya|jalabiya|gown|peplum|vestidos|robe/.test(n))
    return "Women's Dresses & Abayas";
  if (/shawl|pashmina|cashmere|wrap|stole|wool|scarf|poncho|kalam|sozni|fringe|butidar|khatrast/.test(n))
    return "Pashmina & Shawls";
  if (/blouse|sleeve|slive|sweater|loose outfit|two-piece|satin|chiffon/.test(n))
    return "Women's Tops & Sets";
  if (t.includes("amazone") || t.includes("pride of kashmir"))
    return "Pashmina & Shawls";
  return "Women's Tops & Sets";
}

function normalizeBase(name) {
  let b = name.replace(/\.[^.]+$/, ""); // drop extension
  b = b.replace(/\.[a-z]$/i, ""); // drop trailing ".b" style angle marker
  b = b.toLowerCase().replace(/[._]+/g, " ").replace(/\s+/g, " ").trim();
  // strip trailing colour / single-letter variant tokens
  let parts = b.split(" ");
  while (parts.length > 1) {
    const last = parts[parts.length - 1];
    if (COLOR_TOKENS.has(last) || /^[a-z]$/.test(last) || last === "") {
      parts.pop();
    } else break;
  }
  return parts.join(" ").trim();
}

function titleCase(s) {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => (w.length <= 2 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ")
    .replace(/\bV Neck\b/i, "V-Neck");
}

const CATEGORY_FALLBACK_TITLE = {
  "Men's Clothing": "Men's Shirt",
  "Pashmina & Shawls": "Pashmina Shawl",
  "Women's Dresses & Abayas": "Evening Dress",
  "Women's Tops & Sets": "Women's Top",
  Swimwear: "Swimwear Set",
};

function makeTitle(base, original, category) {
  const looksLikeCode =
    /\._ac_|_sx\d|_sy\d/i.test(original) ||
    (/[0-9]/.test(base) && /^[a-z0-9]{8,}$/.test(base.replace(/\s/g, "")));
  if (!base || looksLikeCode) return CATEGORY_FALLBACK_TITLE[category];
  return titleCase(base);
}

function slugify(s) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "product"
  );
}

// ---- collect + group ----
const files = walk(SRC);
const groups = new Map(); // key -> { category, base, files: [] }
for (const f of files) {
  const category = categorize(f.top, f.name);
  const base = normalizeBase(f.name);
  const key = category + "||" + base;
  if (!groups.has(key)) groups.set(key, { category, base, files: [] });
  groups.get(key).files.push(f);
}

// ---- clean previously generated images ----
if (fs.existsSync(OUT_IMG_DIR)) {
  for (const f of fs.readdirSync(OUT_IMG_DIR)) {
    if (f.startsWith("gsp-")) fs.unlinkSync(path.join(OUT_IMG_DIR, f));
  }
} else {
  fs.mkdirSync(OUT_IMG_DIR, { recursive: true });
}

const usedSlugs = new Set();
const products = [];
let id = 0;
const counts = {};

for (const { category, base, files: gfiles } of groups.values()) {
  id += 1;
  // shortest original name first => usually the plain (non-colour) main shot
  gfiles.sort((a, b) => a.name.length - b.name.length);
  const title = makeTitle(base, gfiles[0].name, category);

  let slug = slugify(base || title);
  let unique = slug;
  let i = 2;
  while (usedSlugs.has(unique)) unique = `${slug}-${i++}`;
  usedSlugs.add(unique);
  slug = unique;

  const imgPaths = [];
  gfiles.forEach((f, idx) => {
    const ext = path.extname(f.name).toLowerCase();
    const outName = `gsp-${slug}-${idx + 1}${ext}`;
    fs.copyFileSync(f.full, path.join(OUT_IMG_DIR, outName));
    imgPaths.push(`/images/products/${outName}`);
  });

  const price = PRICE[category] ?? 199;
  counts[category] = (counts[category] || 0) + 1;

  products.push({
    title,
    reviews: 5 + ((id * 7) % 25),
    price,
    discountedPrice: price,
    id,
    category,
    imgs: { thumbnails: imgPaths, previews: imgPaths },
  });
}

// ---- emit shopData.ts ----
const body = products
  .map((p) => {
    const thumbs = p.imgs.thumbnails.map((s) => `        "${s}",`).join("\n");
    const prev = p.imgs.previews.map((s) => `        "${s}",`).join("\n");
    return `  {
    title: ${JSON.stringify(p.title)},
    reviews: ${p.reviews},
    price: ${p.price},
    discountedPrice: ${p.discountedPrice},
    id: ${p.id},
    category: ${JSON.stringify(p.category)},
    imgs: {
      thumbnails: [
${thumbs}
      ],
      previews: [
${prev}
      ],
    },
  },`;
  })
  .join("\n");

const out = `import { Product } from "@/types/product";

// AUTO-GENERATED by scripts/generate-shop-data.mjs — prices are placeholders.
const shopData: Product[] = [
${body}
];

export default shopData;
`;

fs.writeFileSync(OUT_DATA, out);

console.log(`Products: ${products.length} (from ${files.length} images)`);
console.log("By category:");
for (const [c, n] of Object.entries(counts).sort((a, b) => b[1] - a[1]))
  console.log(`  ${n.toString().padStart(3)}  ${c}`);
