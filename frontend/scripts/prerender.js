'use strict';

const fs   = require('fs');
const path = require('path');

const BUILD   = path.join(__dirname, '../build');
const SRC     = path.join(__dirname, '../src');
const DOMAIN  = 'https://roofingcal.com';
const PRIMARY = '#ea580c';

function loadBlogData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/blogPosts.js'), 'utf8');
  const src = raw
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .replace(/^export default /gm, 'const _default = ');
  const fn = new Function(`${src}\nreturn { POSTS };`);
  return fn();
}

const CATEGORIES = [
  { slug: 'roofing-costs',     label: 'Roofing Costs',     desc: 'Understand what you should pay for any roofing project.' },
  { slug: 'roof-materials',    label: 'Roof Materials',    desc: 'Compare shingles, metal, tile, and more.' },
  { slug: 'roof-repair',       label: 'Roof Repair',       desc: "Fix leaks, damaged shingles, and extend your roof's life." },
  { slug: 'roof-replacement',  label: 'Roof Replacement',  desc: 'Everything you need to know about replacing your roof.' },
  { slug: 'roofing-insurance', label: 'Roofing Insurance', desc: 'Navigate insurance claims and coverage for roof damage.' },
  { slug: 'roofing-basics',    label: 'Roofing Basics',    desc: 'Foundational knowledge every homeowner should have.' },
];

function getAssetTags() {
  const indexHtml = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
  const cssLinks  = (indexHtml.match(/<link[^>]+\.css[^>]*>/g) || []).join('\n  ');
  const fontLinks = (indexHtml.match(/<link[^>]+fonts\.g(?:oogleapis|static)\.com[^>]*>/g) || []).join('\n  ');
  const jsScripts = (indexHtml.match(/<script\b[^>]*\ssrc="[^"]*\.js[^"]*"[^>]*>\s*<\/script>/g) || []).join('\n  ');
  return { cssLinks: [fontLinks, cssLinks].filter(Boolean).join('\n  '), jsScripts };
}

// Matches the header baked into public/index.html so prerendered pages look
// consistent with the homepage before React hydrates.
function staticHeader() {
  return `<header style="background:white;border-bottom:1px solid #e2e8f0;padding:0 24px">
  <div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:60px">
    <a href="/" style="font-size:18px;font-weight:800;color:#0f172a;text-decoration:none">RoofingCal</a>
    <nav style="display:flex;gap:24px;align-items:center">
      <a href="/#how-it-works" style="font-size:14px;color:#475569;text-decoration:none;font-weight:500">How It Works</a>
      <a href="/blog" style="font-size:14px;color:#475569;text-decoration:none;font-weight:500">Blog</a>
      <a href="/#faq" style="font-size:14px;color:#475569;text-decoration:none;font-weight:500">FAQ</a>
      <a href="/" style="background:${PRIMARY};color:white;padding:8px 18px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700">Get Estimate</a>
    </nav>
  </div>
</header>`;
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function pageShell({ title, description, canonicalPath, assets, bodyHtml, extraHead = '' }) {
  const url = `${DOMAIN}${canonicalPath}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${url}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="RoofingCal">
  <meta property="og:image" content="${DOMAIN}/og-image.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${DOMAIN}/og-image.svg">
  ${extraHead}
  ${assets.cssLinks}
</head>
<body>
<div id="root">${staticHeader()}${bodyHtml}</div>
  ${assets.jsScripts}
</body>
</html>`;
}

function renderAbout(assets) {
  const body = `<div style="font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;min-height:60vh;padding:56px 24px">
  <div style="max-width:760px;margin:0 auto">
    <h1 style="font-size:36px;font-weight:800;color:#0f172a;margin-bottom:16px">About RoofingCal</h1>
    <p style="font-size:16px;color:#475569;line-height:1.8;margin-bottom:24px">RoofingCal is a free roofing cost estimator that helps homeowners understand what they should expect to pay before calling a contractor. We use ZIP-code-level labor data, material price indices, and regional cost-of-living adjustments to generate accurate, honest estimates.</p>
    <p style="font-size:16px;color:#475569;line-height:1.8;margin-bottom:24px">Our goal is simple: put the homeowner in the driver's seat. Armed with a realistic estimate, you can have more informed conversations with contractors, spot outliers, and make better decisions for one of the biggest investments on your home.</p>
    <h2 style="font-size:22px;font-weight:700;color:#0f172a;margin-bottom:12px;margin-top:40px">How It Works</h2>
    <p style="font-size:16px;color:#475569;line-height:1.8;margin-bottom:24px">You answer a few questions about your roof — size, material, pitch, location — and our engine applies national base pricing adjusted for your specific state or ZIP code. Estimates include a realistic low-to-high range, a line-item breakdown, and notes on what factors most affect your price.</p>
    <h2 style="font-size:22px;font-weight:700;color:#0f172a;margin-bottom:12px;margin-top:40px">For Contractors</h2>
    <p style="font-size:16px;color:#475569;line-height:1.8">Roofing contractors can embed our estimator on their own websites and receive qualified leads directly. <a href="/for-companies" style="color:${PRIMARY};font-weight:600">Learn more &rarr;</a></p>
  </div>
</div>`;
  return pageShell({
    title: 'About RoofingCal | Free Roofing Cost Estimator for Homeowners',
    description: 'RoofingCal provides free, instant ZIP-code accurate roofing cost estimates for homeowners across the US. No signup required.',
    canonicalPath: '/about',
    assets,
    bodyHtml: body,
  });
}

function renderContact(assets) {
  const body = `<div style="background:#f8fafc;min-height:100vh">
  <div style="background:linear-gradient(135deg,#0f172a 0%,#7c2d12 100%);padding:64px 24px 96px;text-align:center">
    <div style="max-width:560px;margin:0 auto">
      <h1 style="font-size:clamp(28px,5vw,42px);font-weight:900;color:white;line-height:1.15;margin-bottom:14px;letter-spacing:-0.02em">Contact Us</h1>
      <p style="font-size:16px;color:#fed7aa;line-height:1.65;max-width:460px;margin:0 auto">Have a question about RoofingCal or your roofing estimate? We'd love to hear from you — we read every message and reply within 1&ndash;2 business days.</p>
    </div>
  </div>
  <div style="max-width:900px;margin:-56px auto 0;padding:0 24px 80px;position:relative;min-height:300px"></div>
</div>`;
  return pageShell({
    title: 'Contact RoofingCal | Get In Touch',
    description: "Have a question about RoofingCal or our roofing estimates? Contact us — we'd love to hear from you.",
    canonicalPath: '/contact',
    assets,
    bodyHtml: body,
  });
}

function renderLegal(kind, assets) {
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy ? 'Privacy Policy | RoofingCal' : 'Terms of Service | RoofingCal';
  const description = isPrivacy
    ? 'RoofingCal privacy policy — how we collect, use, and protect your information.'
    : 'RoofingCal terms of service — the terms and conditions for using our free roofing cost estimator.';

  const sections = isPrivacy ? [
    ['Information We Collect', "When you use RoofingCal, we may collect: ZIP code or state (to compute location-adjusted estimates), and optionally your name, email, and phone if you choose to provide them in the lead capture form. We also collect standard server logs (IP address, browser type, pages visited)."],
    ['How We Use It', "We use your location to generate accurate estimates. If you provide contact info, it may be shared with the roofing contractor whose estimator you're using (embed mode) or used to email you your estimate results. We do not sell your personal data to third parties."],
    ['Cookies', 'We use minimal session cookies to keep the calculator working. We do not use advertising trackers.'],
    ['Contact', 'For privacy questions, reach out via our <a href="/contact" style="color:' + PRIMARY + '">contact page</a>.'],
  ] : [
    ['Estimates Are Informational Only', 'All cost estimates provided by RoofingCal are for informational purposes only. They do not constitute a quote, bid, or contract. Actual roofing costs depend on many factors that cannot be assessed without an on-site inspection. Always obtain multiple quotes from licensed, insured contractors.'],
    ['Use of the Service', 'You may use RoofingCal for personal, non-commercial purposes. You may not scrape, copy, or redistribute our pricing data or algorithms. Contractor accounts are subject to their own subscription terms.'],
    ['Limitation of Liability', 'RoofingCal and its operators are not liable for any decisions made based on estimate results. Use this tool as a starting point for your research, not as a final determination of cost.'],
    ['Changes', 'We may update these terms at any time. Continued use of the site constitutes acceptance of the updated terms.'],
  ];

  const sectionsHtml = sections.map(([h2, p]) =>
    `<h2 style="font-size:20px;font-weight:700;color:#0f172a;margin-top:32px;margin-bottom:8px">${esc(h2)}</h2><p>${p}</p>`
  ).join('\n    ');

  const body = `<div style="max-width:760px;margin:0 auto;padding:56px 24px;color:#374151;font-size:15px;line-height:1.8;font-family:system-ui,-apple-system,sans-serif">
    <h1 style="font-size:32px;font-weight:800;color:#0f172a;margin-bottom:8px">${isPrivacy ? 'Privacy Policy' : 'Terms of Service'}</h1>
    <p style="color:#64748b;margin-bottom:32px">Last updated: April 2026</p>
    ${sectionsHtml}
  </div>`;

  return pageShell({
    title,
    description,
    canonicalPath: isPrivacy ? '/privacy-policy' : '/terms-of-service',
    assets,
    bodyHtml: body,
  });
}

function renderPartnerWithUs(assets) {
  const body = `<div style="background:linear-gradient(135deg, #0f172a 0%, #7c2d12 100%);color:white;padding:80px 24px;text-align:center">
    <div style="max-width:780px;margin:0 auto">
      <h1 style="font-size:clamp(32px,6vw,52px);font-weight:900;line-height:1.1;letter-spacing:-1.5px;margin-bottom:22px">Get Recommended to Thousands of Homeowners<span style="display:block;color:#fdba74"> Ready to Hire a Roofer</span></h1>
      <p style="font-size:clamp(15px,2.5vw,18px);color:#cbd5e1;line-height:1.7;max-width:620px;margin:0 auto 24px">RoofingCal gets <strong style="color:white">20,000&ndash;30,000 organic visits per month</strong> from homeowners actively pricing out roofing jobs &mdash; not casual browsers, but people with a real project in mind and a budget in hand. Join RoofingCal's partner network for $350/month per city.</p>
      <a href="/contact" style="display:inline-flex;align-items:center;background:${PRIMARY};color:white;padding:15px 36px;border-radius:10px;text-decoration:none;font-weight:800;font-size:17px">Apply to Partner &rarr;</a>
    </div>
  </div>`;
  return pageShell({
    title: 'Partner With Us | RoofingCal',
    description: "Get your roofing business recommended to thousands of homeowners actively getting roofing estimates in your city. Join RoofingCal's partner network for $350/month per city.",
    canonicalPath: '/partner-with-us',
    assets,
    bodyHtml: body,
  });
}

function renderForCompanies(assets) {
  const body = `<div style="background:linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%);padding:80px 24px;text-align:center">
    <div style="max-width:760px;margin:0 auto">
      <h1 style="font-size:clamp(32px,5.5vw,52px);font-weight:800;color:white;line-height:1.08;margin-bottom:22px;letter-spacing:-1.5px">Turn Your Website Into a<br><span style="color:#fb923c">Lead Generation Machine</span></h1>
      <p style="font-size:clamp(16px,2vw,19px);color:#94a3b8;max-width:560px;margin:0 auto 32px;line-height:1.7">Embed a branded roofing cost estimator on your website. Homeowners get instant answers &mdash; you get qualified, pre-educated leads on autopilot. $149/mo, no setup fee.</p>
      <a href="/company" style="display:inline-flex;align-items:center;gap:8px;background:${PRIMARY};color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">Get Started &mdash; $149/mo &rarr;</a>
    </div>
  </div>`;
  return pageShell({
    title: 'Roofing Estimator for Contractors — Capture More Leads | RoofingCal',
    description: 'Embed a branded roofing cost estimator on your website. Capture qualified leads automatically. $149/mo. No setup fee.',
    canonicalPath: '/for-companies',
    assets,
    bodyHtml: body,
  });
}

function catBadgeHtml(category) {
  const cat = CATEGORIES.find(c => c.slug === category) || { label: category };
  return `<span style="display:inline-flex;align-items:center;gap:5px;background:#fff7ed;border:1px solid #fed7aa;border-radius:6px;padding:3px 9px;font-size:11px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.05em">${esc(cat.label)}</span>`;
}

function postCardHtml(post, isFeatured) {
  return `<div>
      <a href="/blog/${post.slug}" style="text-decoration:none;display:block;height:100%">
        <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:${isFeatured ? '28px 32px' : '22px 26px'};height:100%;box-sizing:border-box">
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:12px">
            ${catBadgeHtml(post.category)}
            <span style="margin-left:auto;font-size:12px;color:#94a3b8">${esc(post.readTime || '')}</span>
          </div>
          <h2 style="font-size:${isFeatured ? 22 : 17}px;font-weight:800;color:#0f172a;line-height:1.35;margin-bottom:10px">${esc(post.title)}</h2>
          <p style="font-size:14px;color:#64748b;line-height:1.65;margin:0 0 14px">${esc(post.metaDescription)}</p>
          <span style="font-size:13px;color:${PRIMARY};font-weight:600">Read article &rarr;</span>
        </div>
      </a>
    </div>`;
}

function renderBlogIndex(posts, assets) {
  const featured = posts[0];
  const rest = posts.slice(1);

  const catPills = CATEGORIES.map(cat =>
    `<a href="/blog/category/${cat.slug}" style="display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:24px;background:white;border:1.5px solid #e2e8f0;text-decoration:none;font-size:13.5px;font-weight:600;color:#374151">${esc(cat.label)}</a>`
  ).join('');

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:48px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:1100px;margin:0 auto">
    <div style="text-align:center;margin-bottom:48px">
      <h1 style="font-size:clamp(26px,4vw,38px);font-weight:800;color:#0f172a;margin-bottom:10px">Roofing Resource Center</h1>
      <p style="font-size:16px;color:#64748b;max-width:520px;margin:0 auto">Cost guides, material comparisons, repair tips, and contractor advice for homeowners.</p>
    </div>
    <div style="margin-bottom:40px">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px">Featured</div>
      ${featured ? postCardHtml(featured, true) : ''}
    </div>
    <div style="margin-bottom:40px">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Browse by Category</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">${catPills}</div>
    </div>
    <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">All Articles</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px">
      ${rest.map(p => postCardHtml(p, false)).join('')}
    </div>
  </div>
</div>`;

  return pageShell({
    title: 'Roofing Blog 2026 — Cost Guides, Tips & Advice | RoofingCal',
    description: 'Expert roofing guides: cost estimates, material comparisons, repair tips, insurance claims, and contractor advice. Free resources for homeowners.',
    canonicalPath: '/blog',
    assets,
    bodyHtml: body,
  });
}

function renderCategoryPage(cat, posts, assets) {
  const catPosts = posts.filter(p => p.category === cat.slug);
  const rows = catPosts.map(p => `
    <a href="/blog/${p.slug}" style="text-decoration:none">
      <div style="background:white;border-radius:12px;border:1px solid #e2e8f0;padding:22px 26px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:16px">
        <div style="flex:1">
          <h2 style="font-size:17px;font-weight:700;color:#0f172a;margin-bottom:6px">${esc(p.title)}</h2>
          <p style="font-size:13.5px;color:#64748b;line-height:1.6;margin:0">${esc(p.metaDescription)}</p>
        </div>
        <div style="flex-shrink:0;text-align:right">
          <div style="font-size:12px;color:#94a3b8;margin-bottom:4px">${esc(p.readTime || '')}</div>
          <span style="font-size:13px;color:${PRIMARY};font-weight:600">Read &rarr;</span>
        </div>
      </div>
    </a>`).join('');

  const seoTitle = `${cat.label} Guide 2026 | RoofingCal`;

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:48px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:900px;margin:0 auto">
    <a href="/blog" style="font-size:13px;color:#64748b;text-decoration:none;display:inline-flex;align-items:center;gap:5px;margin-bottom:28px">&larr; All Articles</a>
    <div style="margin-bottom:40px">
      <h1 style="font-size:clamp(24px,4vw,34px);font-weight:800;color:#0f172a;margin-bottom:8px">${esc(cat.label)}</h1>
      <p style="font-size:16px;color:#64748b">${esc(cat.desc)}</p>
    </div>
    <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">All Articles</div>
    ${rows || '<p style="color:#64748b">No articles yet.</p>'}
  </div>
</div>`;

  return pageShell({
    title: seoTitle,
    description: cat.desc,
    canonicalPath: `/blog/category/${cat.slug}`,
    assets,
    bodyHtml: body,
  });
}

function articleSchema(post) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedDate,
    author: { '@type': 'Organization', name: 'RoofingCal' },
    publisher: { '@type': 'Organization', name: 'RoofingCal', url: DOMAIN },
  });
}

function renderCostTable(rows) {
  if (!rows || rows.length === 0) return '';
  const [header, ...body] = rows;
  return `<div style="overflow-x:auto;margin:20px 0"><table style="width:100%;border-collapse:collapse;font-size:14px">
    <thead><tr style="background:#f8fafc">${header.map(c => `<th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0;white-space:nowrap">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${body.map((row, i) => `<tr style="background:${i % 2 === 0 ? 'white' : '#fafafa'}">${row.map(c => `<td style="padding:10px 14px;color:#475569;border-bottom:1px solid #f1f5f9">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

function renderBlogPost(post, assets) {
  const catLabel = (CATEGORIES.find(c => c.slug === post.category) || { label: post.category }).label;
  const sectionsHtml = (post.sections || []).map(s =>
    `<div style="margin-bottom:32px"><h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:12px;line-height:1.35">${esc(s.h2)}</h2>${
      (s.paragraphs || []).map(p => `<p style="font-size:15px;color:#374151;line-height:1.8;margin-bottom:14px">${p}</p>`).join('')
    }${renderCostTable(s.table)}</div>`
  ).join('');

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:40px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:760px;margin:0 auto">
    <div style="display:flex;gap:6px;font-size:13px;color:#94a3b8;margin-bottom:28px;flex-wrap:wrap">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <a href="/blog" style="color:#64748b;text-decoration:none">Blog</a><span>&rsaquo;</span>
      <a href="/blog/category/${post.category}" style="color:#64748b;text-decoration:none">${esc(catLabel)}</a><span>&rsaquo;</span>
      <span style="color:#0f172a">${esc(post.title)}</span>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        ${catBadgeHtml(post.category)}
        <span style="font-size:12px;color:#94a3b8">${esc(post.readTime || '')}</span>
        <span style="font-size:12px;color:#94a3b8">&middot; ${formatDate(post.publishedDate)}</span>
      </div>
      <h1 style="font-size:clamp(22px,4vw,30px);font-weight:800;color:#0f172a;line-height:1.3;margin-bottom:14px">${esc(post.title)}</h1>
      <p style="font-size:15.5px;color:#64748b;line-height:1.7;margin:0">${esc(post.metaDescription)}</p>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px">
      ${sectionsHtml}
    </div>
  </div>
</div>`;

  return pageShell({
    title: post.seoTitle || post.title,
    description: post.metaDescription,
    canonicalPath: `/blog/${post.slug}`,
    assets,
    bodyHtml: body,
    extraHead: `<script type="application/ld+json">${articleSchema(post)}</script>`,
  });
}

function writeFile(relPath, html) {
  const full = path.join(BUILD, relPath, 'index.html');
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
}

function main() {
  if (!fs.existsSync(BUILD)) {
    console.log('⚠  prerender: build/ directory not found — skipping');
    return;
  }

  const { POSTS } = loadBlogData();
  const posts = [...POSTS].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  const assets = getAssetTags();

  let count = 0;

  // Vercel's catch-all rewrite (`/(.*) -> /index.html`) means any route without
  // its own build/<path>/index.html silently serves the *homepage's* prerendered
  // HTML — including its <title> and canonical tag — to Googlebot's first-pass
  // crawl. That self-canonicalizes every one of these routes back to "/", which
  // reads as duplicate content. Each entry below gets its own real <head>.
  writeFile('about', renderAbout(assets));
  count++;
  writeFile('contact', renderContact(assets));
  count++;
  writeFile('privacy-policy', renderLegal('privacy', assets));
  count++;
  writeFile('terms-of-service', renderLegal('terms', assets));
  count++;
  writeFile('partner-with-us', renderPartnerWithUs(assets));
  count++;
  writeFile('for-companies', renderForCompanies(assets));
  count++;

  writeFile('blog', renderBlogIndex(posts, assets));
  count++;

  for (const cat of CATEGORIES) {
    writeFile(`blog/category/${cat.slug}`, renderCategoryPage(cat, posts, assets));
    count++;
  }

  for (const post of posts) {
    writeFile(`blog/${post.slug}`, renderBlogPost(post, assets));
    count++;
  }

  console.log(`✓ prerender — ${count} pages generated (${posts.length} posts, ${CATEGORIES.length} categories)`);
}

main();
