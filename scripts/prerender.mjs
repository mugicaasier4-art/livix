#!/usr/bin/env node
/**
 * Post-build prerender script para Livix
 *
 * Usa Puppeteer para renderizar las rutas SEO críticas y guardar
 * el HTML estático en dist/. Vercel sirve estos HTML directamente,
 * resolviendo el problema de SPA + SEO sin necesidad de SSR.
 *
 * Uso: npm run build && node scripts/prerender.mjs
 */

import puppeteer from "puppeteer";
import { createServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, "..", "dist");
const PORT = 45678;

// Rutas SEO a prerenderizar (sincronizadas con sitemap.xml)
const SEO_ROUTES = [
  // Páginas principales
  "/",
  "/explore",
  "/about",
  "/pricing",
  "/how-it-works",
  "/landlords",
  "/erasmus",
  "/erasmus/guide",
  "/erasmus/housing",
  "/blog",
  "/blog/1",
  "/blog/2",
  "/blog/3",
  "/blog/4",
  "/blog/5",
  "/blog/6",
  "/residences",
  "/residences/directory",
  "/roommates",
  "/roommates/search",
  "/club",
  "/publicar-habitacion",
  "/support",
  // Landing pages SEO: Ciudad
  "/residencias/zaragoza",
  "/habitaciones/zaragoza",
  "/pisos/zaragoza",
  "/colegios-mayores/zaragoza",
  // Landing pages SEO: Barrios - Habitaciones
  "/habitaciones/zaragoza/delicias",
  "/habitaciones/zaragoza/actur",
  "/habitaciones/zaragoza/centro",
  "/habitaciones/zaragoza/las-fuentes",
  "/habitaciones/zaragoza/romareda",
  "/habitaciones/zaragoza/san-jose",
  // Landing pages SEO: Barrios - Pisos
  "/pisos/zaragoza/delicias",
  "/pisos/zaragoza/actur",
  "/pisos/zaragoza/centro",
  "/pisos/zaragoza/las-fuentes",
  "/pisos/zaragoza/romareda",
  "/pisos/zaragoza/san-jose",
  // Landing pages SEO: Campus
  "/campus/san-francisco",
  "/campus/rio-ebro",
  "/campus/usj",
];

// Servidor estático simple que sirve dist/ con SPA fallback
function startServer() {
  const indexHtml = readFileSync(join(DIST_DIR, "index.html"), "utf-8");
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
  };

  const server = createServer((req, res) => {
    const url = req.url.split("?")[0];
    const filePath = join(DIST_DIR, url);

    // Intentar servir archivo estático
    try {
      const ext = url.match(/\.[^.]+$/)?.[0] || "";
      if (ext && existsSync(filePath)) {
        const content = readFileSync(filePath);
        res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
        res.end(content);
        return;
      }
    } catch {}

    // SPA fallback: servir index.html para cualquier ruta
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(indexHtml);
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();

  try {
    // Bloquear recursos innecesarios para acelerar el render
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (["image", "media", "font"].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Esperar un poco extra para que react-helmet-async actualice el head
    await page.waitForFunction(() => {
      return document.querySelector("title")?.textContent !== "";
    }, { timeout: 5000 }).catch(() => {});

    // Obtener el HTML completo renderizado
    const html = await page.content();

    // Determinar la ruta del archivo de salida
    let outputPath;
    if (route === "/") {
      outputPath = join(DIST_DIR, "index.html");
    } else {
      const dir = join(DIST_DIR, route);
      mkdirSync(dir, { recursive: true });
      outputPath = join(dir, "index.html");
    }

    writeFileSync(outputPath, html, "utf-8");
    console.log(`  ✓ ${route}`);
  } catch (err) {
    console.error(`  ✗ ${route}: ${err.message}`);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log(`\n🔍 Prerenderizando ${SEO_ROUTES.length} rutas SEO...\n`);

  // Verificar que dist/ existe
  if (!existsSync(DIST_DIR)) {
    console.error("Error: dist/ no existe. Ejecuta 'npm run build' primero.");
    process.exit(1);
  }

  // Iniciar servidor estático
  const server = await startServer();
  console.log(`📦 Servidor local en http://localhost:${PORT}\n`);

  // Iniciar Puppeteer
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Prerenderizar en lotes de 4 para no saturar
  const BATCH_SIZE = 4;
  for (let i = 0; i < SEO_ROUTES.length; i += BATCH_SIZE) {
    const batch = SEO_ROUTES.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map((route) => prerenderRoute(browser, route)));
  }

  await browser.close();
  server.close();

  console.log(`\n✅ ${SEO_ROUTES.length} rutas prerenderizadas en dist/\n`);
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
