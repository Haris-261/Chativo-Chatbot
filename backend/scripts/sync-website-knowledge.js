import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { finished } from "node:stream/promises";
import { load } from "cheerio";
import PDFDocument from "pdfkit";

const SITE_ORIGIN = "https://chativo.mbstack.net";
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "../..");
const generatedDirectory = path.join(projectRoot, "backend", "src", "data", "generated");
const docsDirectory = path.join(projectRoot, "docs");
const dataPath = path.join(generatedDirectory, "websiteKnowledge.json");
const pdfPath = path.join(docsDirectory, "Chativo-Complete-Website-Knowledge.pdf");

function cleanText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(items) {
  return [...new Set(items.map(cleanText).filter(Boolean))];
}

function truncateWords(text, maximumWords) {
  const words = cleanText(text).split(" ");
  if (words.length <= maximumWords) return words.join(" ");
  return `${words.slice(0, maximumWords).join(" ")}...`;
}

function pageType(url) {
  const pathname = new URL(url).pathname;
  if (pathname === "/") return "home";
  if (pathname.startsWith("/blog/")) return "blog";
  if (["/terms", "/refund-policy", "/cancellation-policy"].includes(pathname)) return "policy";
  if (pathname === "/chat") return "product";
  return "core";
}

function createChunks(parts, maximumLength = 1100) {
  const chunks = [];
  let current = "";

  for (const part of parts) {
    if (!current) {
      current = part;
      continue;
    }
    if (`${current}\n${part}`.length <= maximumLength) {
      current = `${current}\n${part}`;
      continue;
    }
    chunks.push(current);
    current = part;
  }

  if (current) chunks.push(current);
  return chunks;
}

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "ChativoKnowledgeBot/1.0 (+https://chativo.mbstack.net)" },
        signal: AbortSignal.timeout(30_000)
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, attempt * 500));
    }
  }
  throw new Error(`Unable to fetch ${url}: ${lastError.message}`);
}

function extractPage(url, html, lastModified = null) {
  const $ = load(html);
  $("script, style, noscript, svg, nav, footer, form, button").remove();

  const root = $("main").first().length ? $("main").first() : $("body").first();
  const title = cleanText(root.find("h1").first().text())
    || cleanText($("meta[property='og:title']").attr("content"))
    || cleanText($("title").text());
  const description = cleanText($("meta[name='description']").attr("content"))
    || cleanText($("meta[property='og:description']").attr("content"));
  const headings = unique(root.find("h1, h2, h3").map((_index, element) => $(element).text()).get());
  const contentParts = unique(root.find("p, li").map((_index, element) => $(element).text()).get())
    .filter(text => text.length >= 12)
    .filter(text => !/^(home|about|pricing|contact|blog|login|register)$/i.test(text));
  const chunks = createChunks([title, description, ...headings, ...contentParts].filter(Boolean));
  const content = chunks.join("\n\n");

  return {
    url,
    path: new URL(url).pathname,
    type: pageType(url),
    title,
    description,
    headings,
    keyPoints: contentParts.slice(0, 10),
    chunks,
    wordCount: content.split(/\s+/).filter(Boolean).length,
    lastModified,
    contentHash: crypto.createHash("sha256").update(content).digest("hex")
  };
}

async function loadSitemap() {
  const xml = await fetchText(SITEMAP_URL);
  const entries = [...xml.matchAll(/<url>[\s\S]*?<loc>(.*?)<\/loc>[\s\S]*?(?:<lastmod>(.*?)<\/lastmod>)?[\s\S]*?<\/url>/g)]
    .map(match => ({ url: cleanText(match[1]), lastModified: cleanText(match[2]) || null }))
    .filter(entry => new URL(entry.url).origin === SITE_ORIGIN);

  if (entries.length === 0) throw new Error("The Chativo sitemap contained no same-domain URLs.");
  return entries;
}

async function buildDataset() {
  const sitemapEntries = await loadSitemap();
  const pages = [];

  for (const [index, entry] of sitemapEntries.entries()) {
    const html = await fetchText(entry.url);
    const page = extractPage(entry.url, html, entry.lastModified);
    if (page.chunks.length > 0) pages.push(page);
    console.log(`[${index + 1}/${sitemapEntries.length}] ${page.path} - ${page.wordCount} words`);
  }

  return {
    site: SITE_ORIGIN,
    sitemap: SITEMAP_URL,
    generatedAt: new Date().toISOString(),
    pageCount: pages.length,
    chunkCount: pages.reduce((total, page) => total + page.chunks.length, 0),
    pages
  };
}

async function writePdf(dataset) {
  const document = new PDFDocument({
    size: "A4",
    margins: { top: 52, right: 52, bottom: 54, left: 52 },
    bufferPages: true,
    info: {
      Title: "Chativo Complete Website Knowledge",
      Author: "Chativo Knowledge Sync",
      Subject: "Source-linked digest of public Chativo sitemap pages"
    }
  });
  const output = fs.createWriteStream(pdfPath);
  document.pipe(output);

  document.font("Helvetica-Bold").fontSize(23).fillColor("#172554")
    .text("Chativo Complete Website Knowledge");
  document.moveDown(0.4).font("Helvetica").fontSize(10).fillColor("#475569")
    .text(`Generated ${dataset.generatedAt}`)
    .text(`${dataset.pageCount} public sitemap pages and ${dataset.chunkCount} retrieval chunks.`)
    .moveDown(0.7)
    .text("This is a compact, source-linked information digest. The chatbot uses the accompanying structured dataset for grounded retrieval. Live pages remain authoritative because website details can change.")
    .moveDown(1.2);

  for (const [index, page] of dataset.pages.entries()) {
    if (document.y > 670) document.addPage();
    document.font("Helvetica-Bold").fontSize(14).fillColor("#1d4ed8")
      .text(`${index + 1}. ${page.title || page.path}`);
    document.font("Helvetica").fontSize(8).fillColor("#2563eb")
      .text(page.url, { link: page.url, underline: true });
    document.moveDown(0.3).fontSize(9).fillColor("#64748b")
      .text(`Type: ${page.type} | Indexed words: ${page.wordCount}${page.lastModified ? ` | Last modified: ${page.lastModified}` : ""}`);

    if (page.description) {
      document.moveDown(0.35).font("Helvetica-Bold").fillColor("#0f172a").text("Summary");
      document.font("Helvetica").fillColor("#334155").text(truncateWords(page.description, 55));
    }

    if (page.headings.length > 0) {
      document.moveDown(0.35).font("Helvetica-Bold").fillColor("#0f172a").text("Topics");
      document.font("Helvetica").fillColor("#334155")
        .text(truncateWords(page.headings.slice(0, 12).join(" | "), 60));
    }

    if (page.keyPoints.length > 0) {
      document.moveDown(0.35).font("Helvetica-Bold").fillColor("#0f172a").text("Key information");
      for (const point of page.keyPoints.slice(0, 4)) {
        document.font("Helvetica").fillColor("#334155")
          .text(`• ${truncateWords(point, 28)}`, { indent: 8, paragraphGap: 2 });
      }
    }
    document.moveDown(0.8);
  }

  const range = document.bufferedPageRange();
  for (let index = 0; index < range.count; index += 1) {
    document.switchToPage(index);
    document.font("Helvetica").fontSize(8).fillColor("#94a3b8")
      .text(`Chativo website knowledge | Page ${index + 1} of ${range.count}`, 52, document.page.height - 34, {
        width: document.page.width - 104,
        align: "center",
        lineBreak: false
      });
  }

  document.end();
  await finished(output);
}

fs.mkdirSync(generatedDirectory, { recursive: true });
fs.mkdirSync(docsDirectory, { recursive: true });

const dataset = await buildDataset();
fs.writeFileSync(dataPath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
await writePdf(dataset);

console.log(`Saved dataset: ${dataPath}`);
console.log(`Saved PDF: ${pdfPath}`);
console.log(`Indexed ${dataset.pageCount} pages into ${dataset.chunkCount} chunks.`);

