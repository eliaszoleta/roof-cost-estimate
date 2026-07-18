const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://roofingcal.com';
const TODAY = new Date().toISOString().split('T')[0];

const postsFile = fs.readFileSync(
  path.join(__dirname, '../src/data/blogPosts.js'),
  'utf8'
);

const slugMatches = [...postsFile.matchAll(/(?<!\w)slug:\s*['"]([^'"]+)['"]\s*/g)];
const dateMatches = [...postsFile.matchAll(/publishedDate:\s*['"]([^'"]+)['"]\s*/g)];
const categoryMatches = [...postsFile.matchAll(/category:\s*['"]([^'"]+)['"]\s*/g)];

const posts = slugMatches.map((m, i) => ({
  slug: m[1],
  date: dateMatches[i]?.[1] || TODAY,
}));

const categorySlugs = [...new Set(categoryMatches.map(m => m[1]))];

const staticPages = [
  { path: '/',                priority: '1.0', changefreq: 'weekly',  lastmod: TODAY },
  { path: '/blog',            priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { path: '/for-companies',   priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { path: '/partner-with-us', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/about',           priority: '0.6', changefreq: 'monthly', lastmod: TODAY },
  { path: '/contact',         priority: '0.5', changefreq: 'monthly', lastmod: TODAY },
  { path: '/privacy-policy',  priority: '0.3', changefreq: 'yearly',  lastmod: '2026-04-01' },
  { path: '/terms-of-service',priority: '0.3', changefreq: 'yearly',  lastmod: '2026-04-01' },
];

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '',
  '  <!-- Core pages -->',
  ...staticPages.map(p =>
    urlEntry({ loc: `${SITE_URL}${p.path}`, lastmod: p.lastmod, changefreq: p.changefreq, priority: p.priority })
  ),
  '',
  '  <!-- Blog categories -->',
  ...categorySlugs.map(slug =>
    urlEntry({ loc: `${SITE_URL}/blog/category/${slug}`, lastmod: TODAY, changefreq: 'weekly', priority: '0.8' })
  ),
  '',
  '  <!-- Blog posts (auto-generated from blogPosts.js) -->',
  ...posts.map(p =>
    urlEntry({ loc: `${SITE_URL}/blog/${p.slug}`, lastmod: p.date, changefreq: 'monthly', priority: '0.8' })
  ),
  '',
  '</urlset>',
].join('\n') + '\n';

const outPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');

console.log(`✓ sitemap.xml — ${posts.length} posts, ${categorySlugs.length} categories`);
