
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock data imports since we can't easily import TS files with imports in Node without build step
// Ideally this would import from src/data/seo directly if we used ts-node, but we'll read the files
// or hardcode the logic for this script to keep it simple and dependency-free.

const DOMAIN = 'https://livix.es';

// We will read the TS files as text and extract keys using Regex to avoid complex TS compilation setup for a simple script
const readKeysFromTs = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const keys = [];
    const regex = /(\s+)(\w+|['"][a-z0-9-]+['"]): \{/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let key = match[2].replace(/['"]/g, '');
        if (key !== 'zaragoza' && key !== 'madrid' && key !== 'valencia' && !filePath.includes('cities.ts')) {
            // loose check, but better let's just match the keys inside the export const object
        }
        keys.push(key);
    }
    return keys;
};

// Hardcoded for now to guarantee correctness without complex parsing
const CITIES = ['zaragoza'];
const BARRIOS = ['delicias', 'actur', 'centro', 'las-fuentes', 'romareda', 'san-jose'];
const CAMPUS = ['san-francisco', 'rio-ebro', 'usj'];

const routes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/explore', priority: 0.8, changefreq: 'daily' },
    { path: '/residences', priority: 0.8, changefreq: 'weekly' },
    { path: '/roommates', priority: 0.8, changefreq: 'daily' },
];

const generateSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static Routes
    routes.forEach(route => {
        xml += `
    <url>
        <loc>${DOMAIN}${route.path}</loc>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`;
    });

    // Dynamic SEO Routes
    CITIES.forEach(city => {
        // City Landing Pages
        xml += `
    <url><loc>${DOMAIN}/residencias/${city}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
    <url><loc>${DOMAIN}/habitaciones/${city}</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>${DOMAIN}/pisos/${city}</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>${DOMAIN}/colegios-mayores/${city}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`;

        // Barrio Pages
        BARRIOS.forEach(barrio => {
            xml += `
    <url><loc>${DOMAIN}/habitaciones/${city}/${barrio}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
    <url><loc>${DOMAIN}/pisos/${city}/${barrio}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        });
    });

    // Campus Pages
    CAMPUS.forEach(camp => {
        xml += `
    <url><loc>${DOMAIN}/campus/${camp}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
    });

    xml += `
</urlset>`;

    const outputPath = path.resolve(process.cwd(), 'public/sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`✅ Sitemap generated at ${outputPath}`);
};

generateSitemap();
