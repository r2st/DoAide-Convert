#!/usr/bin/env node
/**
 * prerender-routes.mjs
 *
 * Post-build script that reads the Vite-built dist/index.html and creates
 * per-route copies with unique <title>, <meta description>, <link canonical>,
 * Open Graph tags, and JSON-LD so that crawlers see correct metadata without
 * executing JavaScript.
 *
 * Usage:  node scripts/prerender-routes.mjs
 * Run after `vite build`.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = process.env.PRERENDER_DIST || join(__dirname, '..', 'dist');
const SITE = 'https://convert.doaide.com';
const OG_IMAGE = `${SITE}/og-image.png`;

/* ---------- import route metadata from registry + routeMeta ---------- */

// Dynamic import so we can use the same registry the app uses.
// The registry is plain JS with no JSX, so Node can handle it after
// stripping the one import.meta.env reference.
const registryPath = join(__dirname, '..', 'src', 'tools', 'registry.js');
let registrySource = readFileSync(registryPath, 'utf-8');
// Replace import.meta.env with a fallback so Node doesn't choke.
registrySource = registrySource.replace(
  /import\.meta\.env\.VITE_API_URL/g,
  "undefined",
);
// Write a temp file and import it
const tmpRegistry = join(DIST, '_registry_tmp.mjs');
writeFileSync(tmpRegistry, registrySource);
const { categories } = await import(`file://${tmpRegistry}`);
import('fs').then(fs => fs.unlinkSync(tmpRegistry));

// Static routes from routeMeta.js
const routeMetaPath = join(__dirname, '..', 'src', 'routeMeta.js');
const { staticRoutes } = await import(`file://${routeMetaPath}`);

// Blog posts — extract from Blog.jsx source (the posts array).
// We parse the source text for slugs, titles, excerpts, and dates.
const blogSource = readFileSync(join(__dirname, '..', 'src', 'pages', 'Blog.jsx'), 'utf-8');
const blogPosts = [];
const postRegex = /slug:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)',\s*\n\s*excerpt:\s*'([^']+)',\s*\n\s*date:\s*'([^']+)'/g;
let m;
while ((m = postRegex.exec(blogSource)) !== null) {
  blogPosts.push({ slug: m[1], title: m[2], excerpt: m[3], date: m[4] });
}

/* ---------- build the full route map ---------- */

const routes = { ...staticRoutes };

// Tool pages from registry
for (const cat of categories) {
  for (const tool of cat.tools) {
    const path = `/tool/${tool.slug}`;
    routes[path] = {
      title: tool.seoTitle,
      description: tool.seoDesc,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.seoTitle,
        description: tool.seoDesc,
        url: `${SITE}${path}`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
      },
    };
  }
}

// Blog posts
for (const post of blogPosts) {
  const path = `/blog/${post.slug}`;
  routes[path] = {
    title: `${post.title} — DoAide Convert`,
    description: post.excerpt,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: `${SITE}${path}`,
      author: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
      publisher: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
    },
  };
}

/* ---------- read the template and inject per route ---------- */

const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

function inject(html, path, meta) {
  const url = `${SITE}${path}`;
  const ogType = meta.type || 'website';
  let out = html;

  // Replace <title>
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);

  // Replace meta description
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${esc(meta.description)}" />`,
  );

  // Replace canonical
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${esc(url)}" />`,
  );

  // Replace og tags
  out = out.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(meta.title)}" />`);
  out = out.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(meta.description)}" />`);
  out = out.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${esc(url)}" />`);
  out = out.replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${esc(ogType)}" />`);

  // Replace JSON-LD if meta has one
  if (meta.jsonLd) {
    out = out.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">\n    ${JSON.stringify(meta.jsonLd, null, 2).replace(/\n/g, '\n    ')}\n    </script>`,
    );
  }

  return out;
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ---------- write per-route files ---------- */

let count = 0;
for (const [path, meta] of Object.entries(routes)) {
  if (path === '/') continue; // index.html already has root metadata

  const html = inject(template, path, meta);
  // Create directory structure: /tool/length -> dist/tool/length/index.html
  const dir = join(DIST, ...path.split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  count++;
}

// Also update the root index.html with its own explicit meta
const rootMeta = routes['/'];
if (rootMeta) {
  const rootHtml = inject(template, '/', rootMeta);
  writeFileSync(join(DIST, 'index.html'), rootHtml);
  count++;
}

/* ---------- generate sitemap.xml from routes ---------- */

const today = new Date().toISOString().slice(0, 10);
const sitemapEntries = Object.keys(routes)
  .sort()
  .map((path) => {
    const priority = path === '/' ? '1.0' : path.startsWith('/blog') ? '0.6' : '0.8';
    const loc = `${SITE}${path}`;
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), sitemap);

/* ---------- serve.json: route each URL to its prerendered file ---------- */

// The SPA fallback goes last. `serve -s` would put its own catch-all first and
// shadow these, so the web unit runs plain `serve dist`. serve-handler
// re-applies the remaining rewrites to a rewritten path, so the fallback only
// matches dot-free paths.
const serveConfig = {
  rewrites: [
    ...Object.keys(routes)
      .filter((path) => path !== '/')
      .map((path) => ({ source: path, destination: `${path}/index.html` })),
    { source: '/:path([^.]+)', destination: '/index.html' },
  ],
  headers: [
    { source: '/assets/**', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
};
writeFileSync(join(DIST, 'serve.json'), JSON.stringify(serveConfig, null, 2) + '\n');

console.log(`✓ Prerendered ${count} routes`);
console.log(`✓ Generated sitemap.xml with ${Object.keys(routes).length} URLs`);
