
import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://livix.es';

// SEO data (hardcoded for correctness without TS compilation)
const CITIES = ['zaragoza'];
const BARRIOS = ['delicias', 'actur', 'centro', 'las-fuentes', 'romareda', 'san-jose'];
const CAMPUS = ['san-francisco', 'rio-ebro', 'usj'];

// Extract blog post IDs from blogContent.ts
const extractBlogIds = () => {
    const blogPath = path.resolve(process.cwd(), 'src/data/blogContent.ts');
    const content = fs.readFileSync(blogPath, 'utf-8');
    const ids = [];
    const regex = /id:\s*(\d+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        ids.push(match[1]);
    }
    return ids;
};

const today = new Date().toISOString().split('T')[0];

const generateSitemap = () => {
    const blogIds = extractBlogIds();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static Routes
    const staticRoutes = [
        { path: '/', priority: 1.0, changefreq: 'daily' },
        { path: '/explore', priority: 0.8, changefreq: 'daily' },
        { path: '/residences', priority: 0.8, changefreq: 'weekly' },
        { path: '/roommates', priority: 0.8, changefreq: 'daily' },
        { path: '/blog', priority: 0.7, changefreq: 'weekly' },
        { path: '/about', priority: 0.5, changefreq: 'monthly' },
        { path: '/pricing', priority: 0.6, changefreq: 'monthly' },
        { path: '/propietarios', priority: 0.7, changefreq: 'monthly' },
        { path: '/estudiantes', priority: 0.7, changefreq: 'monthly' },
    ];

    staticRoutes.forEach(route => {
        xml += `
    <url>
        <loc>${DOMAIN}${route.path}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`;
    });

    // Blog Posts
    blogIds.forEach(id => {
        xml += `
    <url>
        <loc>${DOMAIN}/blog/${id}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
    });

    // Dynamic SEO Routes
    CITIES.forEach(city => {
        xml += `
    <url><loc>${DOMAIN}/residencias/${city}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
    <url><loc>${DOMAIN}/habitaciones/${city}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>${DOMAIN}/pisos/${city}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>${DOMAIN}/colegios-mayores/${city}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;

        BARRIOS.forEach(barrio => {
            xml += `
    <url><loc>${DOMAIN}/habitaciones/${city}/${barrio}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
    <url><loc>${DOMAIN}/pisos/${city}/${barrio}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        });
    });

    // Campus Pages
    CAMPUS.forEach(camp => {
        xml += `
    <url><loc>${DOMAIN}/campus/${camp}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
    });

    xml += `
</urlset>`;

    const outputPath = path.resolve(process.cwd(), 'public/sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap generated at ${outputPath} (${staticRoutes.length + blogIds.length + CITIES.length * 4 + CITIES.length * BARRIOS.length * 2 + CAMPUS.length} URLs)`);
};

generateSitemap();
