import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("dist/public");
const INDEX_HTML = path.join(DIST_DIR, "index.html");

const pages = [
  {
    filename: "bloch-sphere.html",
    title: "Bloch Sphere Explorer | One Million Qubits",
    description:
      "Visualize single-qubit states and rotations with an interactive Bloch sphere. Explore Rx, Ry, Rz, and gate intuition.",
    url: "https://www.onemillionqubits.com/bloch-sphere",
    image: "https://www.onemillionqubits.com/og/bloch-sphere.jpg",
  },
  {
    filename: "pauli-trainer.html",
    title: "Pauli Trainer | One Million Qubits",
    description:
      "Practice recognizing two-qubit Pauli operators fast. Train pattern recognition for Qiskit-style questions.",
    url: "https://www.onemillionqubits.com/pauli-trainer",
    image: "https://www.onemillionqubits.com/og/pauli-trainer.jpg",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertTitle(html, title) {
  const safe = escapeHtml(title);
  if (/<title>.*?<\/title>/is.test(html)) {
    return html.replace(/<title>.*?<\/title>/is, `<title>${safe}</title>`);
  }
  return html.replace("</head>", `  <title>${safe}</title>\n</head>`);
}

function upsertMeta(html, attr, key, content) {
  const safeContent = escapeHtml(content);
  const safeKey = escapeRegex(key);
  const regex = new RegExp(
    `<meta\\s+${attr}=["']${safeKey}["'][^>]*content=["'][^"']*["'][^>]*\\/?\\s*>`,
    "i",
  );
  const tag = `<meta ${attr}="${key}" content="${safeContent}" />`;

  if (regex.test(html)) {
    return html.replace(regex, tag);
  }

  return html.replace("</head>", `  ${tag}\n</head>`);
}

function upsertCanonical(html, href) {
  const safeHref = escapeHtml(href);
  const regex = /<link\s+rel=["']canonical["'][^>]*href=["'][^"']*["'][^>]*\/?>/i;
  const tag = `<link rel="canonical" href="${safeHref}" />`;

  if (regex.test(html)) {
    return html.replace(regex, tag);
  }

  return html.replace("</head>", `  ${tag}\n</head>`);
}

async function main() {
  const baseHtml = await readFile(INDEX_HTML, "utf8");

  for (const page of pages) {
    let html = baseHtml;

    html = upsertTitle(html, page.title);
    html = upsertMeta(html, "name", "description", page.description);

    html = upsertMeta(html, "property", "og:type", "website");
    html = upsertMeta(html, "property", "og:title", page.title);
    html = upsertMeta(html, "property", "og:description", page.description);
    html = upsertMeta(html, "property", "og:url", page.url);
    html = upsertMeta(html, "property", "og:image", page.image);

    html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
    html = upsertMeta(html, "name", "twitter:title", page.title);
    html = upsertMeta(html, "name", "twitter:description", page.description);
    html = upsertMeta(html, "name", "twitter:image", page.image);

    html = upsertCanonical(html, page.url);

    await writeFile(path.join(DIST_DIR, page.filename), html, "utf8");
    console.log(`generated ${page.filename}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
