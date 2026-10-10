'use strict';

const fs   = require('fs');
const path = require('path');

const BUILD   = path.join(__dirname, '../build');
const SRC     = path.join(__dirname, '../src');
const DOMAIN  = 'https://roofingcal.com';
const PRIMARY = '#ea580c';
const PRIMARY_DARK = '#c2410c';

function loadBlogData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/blogPosts.js'), 'utf8');
  const src = raw
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .replace(/^export default /gm, 'const _default = ');
  const fn = new Function(`${src}\nreturn { POSTS };`);
  return fn();
}

function loadServicesData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/services.js'), 'utf8');
  const src = raw
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .replace(/^export default /gm, 'const _default = ');
  const fn = new Function(`${src}\nreturn { getAllServices, getServiceBySlug, getRelatedServices, typicalCost };`);
  return fn();
}

function loadStatesData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/statePricing.js'), 'utf8');
  const src = raw
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .replace(/^export default /gm, 'const _default = ');
  const fn = new Function(`${src}\nreturn { getAllStates, getStateBySlug, getFeaturedStates, adjustForState };`);
  return fn();
}

function loadRoofingBizData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/stateRoofingBusinessStartup.js'), 'utf8');
  const src = raw
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ');
  const fn = new Function(`${src}\nreturn { STATE_BUSINESS_STARTUP, getStateBusinessStartupByCode };`);
  return fn();
}

function loadFaqsData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/faqs.js'), 'utf8');
  const src = raw.replace(/^export function /gm, 'function ');
  const fn = new Function(`${src}\nreturn { getAllFaqs };`);
  return fn();
}

// cityPricing.js imports from statePricing.js and services.js, so those are
// injected as parameters rather than re-read from disk a third time (same
// approach generate-sitemap.js uses for this file).
function loadCitiesData(statesMod, servicesMod) {
  const raw = fs.readFileSync(path.join(SRC, 'data/cityPricing.js'), 'utf8');
  const src = raw
    .replace(/^import[^\n]*\n/gm, '')
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ');
  const fn = new Function(
    'getStateBySlug', 'adjustForState', 'getAllServices', 'typicalCost',
    `${src}\nreturn { getAllCities, getCityBySlug, getCitiesByState, getFeaturedCities, cityServicePrices };`
  );
  return fn(statesMod.getStateBySlug, statesMod.adjustForState, servicesMod.getAllServices, servicesMod.typicalCost);
}

function loadSitesData() {
  const raw = fs.readFileSync(path.join(SRC, 'components/demo-sites/siteConfigs.js'), 'utf8');
  const src = raw
    .replace(/^export function /gm, 'function ')
    .replace(/^export default SITES;\s*$/m, '');
  const fn = new Function(`${src}\nreturn { getSite, getAllSites, getFaqs };`);
  return fn();
}

const CATEGORIES = [
  { slug: 'roofing-costs',     label: 'Roofing Costs',     desc: 'Understand what you should pay for any roofing project.' },
  { slug: 'roof-materials',    label: 'Roof Materials',    desc: 'Compare shingles, metal, tile, and more.' },
  { slug: 'roof-repair',       label: 'Roof Repair',       desc: "Fix leaks, damaged shingles, and extend your roof's life." },
  { slug: 'roof-replacement',  label: 'Roof Replacement',  desc: 'Everything you need to know about replacing your roof.' },
  { slug: 'roofing-insurance', label: 'Roofing Insurance', desc: 'Navigate insurance claims and coverage for roof damage.' },
  { slug: 'roofing-financing', label: 'Roofing Financing', desc: 'Loans, 0% promotions, and how to pay for a new roof.' },
  { slug: 'roofing-basics',    label: 'Roofing Basics',    desc: 'Foundational knowledge every homeowner should have.' },
  { slug: 'starting-a-roofing-business', label: 'Starting a Roofing Business', desc: 'Licensing, startup costs, equipment, and everything you need to start and grow a roofing business.' },
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

function pageShell({ title, description, canonicalPath, assets, bodyHtml, extraHead = '', robots = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }) {
  const url = `${DOMAIN}${canonicalPath}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${esc(robots)}">
  <link rel="canonical" href="${url}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="RoofingCal">
  <meta property="og:image" content="${DOMAIN}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${DOMAIN}/og-image.png">
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

// Lightweight crawler mirror of WebsiteSubscription.js (the "Get a
// Done-For-You Website" sales page) -- summarizes the hero, what's
// included, and pricing rather than recreating the full interactive page,
// same abbreviated-mirror approach as renderForCompanies above. Without
// this, Vercel's catch-all rewrite would silently serve the *homepage's*
// prerendered HTML to Googlebot's first-pass crawl of this URL (see the
// comment on main()'s writeFile calls below).
function renderWebsiteSubscription(assets) {
  const body = `<div style="font-family:system-ui,-apple-system,sans-serif">
    <div style="background:linear-gradient(135deg, #1c1917 0%, #431407 100%);color:white;padding:64px 24px 80px;text-align:center">
      <div style="max-width:780px;margin:0 auto">
        <div style="font-size:12px;font-weight:700;color:#fb923c;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:18px">Roofing Website + Lead App</div>
        <h1 style="font-size:clamp(22px,4vw,36px);font-weight:800;line-height:1.3;margin-bottom:16px">A Professional Roofing Website, Built and Hosted for You — With Every Lead Landing Right In Your Pocket</h1>
        <p style="font-size:15px;color:#d6d3d1;max-width:540px;margin:0 auto 28px;line-height:1.55">No roofing website yet? We build it, host it, and connect every estimate request, text, and call to a mobile app you carry with you — for one flat monthly rate, no big upfront cost.</p>
        <a href="#apply" style="display:inline-flex;align-items:center;gap:8px;background:${PRIMARY};color:white;padding:15px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15.5px">Build My Free Sample Site &rarr;</a>
      </div>
    </div>
    <div style="max-width:700px;margin:0 auto;padding:56px 24px">
      <h2 style="font-size:28px;font-weight:800;color:#0f172a;margin-bottom:20px">What's Included</h2>
      <ul style="font-size:15px;color:#374151;line-height:2;padding-left:20px">
        <li>A custom roofing website built for your business — not a generic template</li>
        <li>A domain name of your choice</li>
        <li>Fast, secure hosting, fully managed — nothing for you to set up</li>
        <li>A website chat widget that can auto-reply with AI or be switched to manual</li>
        <li>A built-in lead capture form so visitors can request a free estimate right from your site</li>
        <li>A mobile app where every website chat and estimate form lead lands</li>
        <li>Priority support for ongoing changes — no extra invoices</li>
        <li>No long-term contract — cancel anytime</li>
      </ul>
      <h2 style="font-size:28px;font-weight:800;color:#0f172a;margin:40px 0 16px">Simple Pricing, Zero Risk</h2>
      <p style="font-size:15px;color:#374151;line-height:1.8">We build your live roofing website first — you only pay once you've seen and approved it. Just $5 one-time to lock it in, then your first 2 months are completely free. After that it's a flat $249/month, cancel anytime.</p>
      <p style="font-size:15px;color:#374151;line-height:1.8">See example designs at <a href="/website-example" style="color:${PRIMARY};font-weight:600">roofingcal.com/website-example</a>, or apply directly at <a href="/website-for-roofing-companies" style="color:${PRIMARY};font-weight:600">this page</a> to get your own free sample built.</p>
    </div>
  </div>`;
  return pageShell({
    title: 'Roofing Website + Lead App for Roofing Companies | RoofingCal',
    description: 'Get a professional roofing website built free to preview. Approve it for just $5, get 2 months free, then $249/month — with every lead landing in a mobile app you can reply to instantly.',
    canonicalPath: '/website-for-roofing-companies',
    assets,
    bodyHtml: body,
  });
}

// Lightweight crawler mirror of DemoGallery.js -- the example-site showcase
// index. Deliberately noindex (matches cleanestimator.com's own
// /website-example page): these are fictional demo businesses built to
// show design range, not real content worth ranking in search on their
// own, but still worth crawling through (follow) so links to the real
// sales page above get discovered.
function renderDemoGallery(sitesMod, assets) {
  const sites = sitesMod.getAllSites();
  const cards = sites.map(site => `
    <a href="/website-example/${site.slug}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;border-radius:16px;overflow:hidden;background:white;border:1px solid #e2e8f0;margin-bottom:16px">
      <div style="height:72px;background:linear-gradient(135deg, ${site.colors.primary} 0%, ${site.colors.primaryDark} 100%);display:flex;align-items:center;padding:0 20px">
        <div style="width:36px;height:36px;border-radius:9px;background:${site.colors.accent};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;color:${site.colors.primaryDark}">${esc(site.logoLabel)}</div>
      </div>
      <div style="padding:16px 20px">
        <div style="font-weight:700;font-size:16px;color:#0f172a;margin-bottom:4px">${esc(site.businessName)}</div>
        <div style="font-size:13px;color:#64748b">${esc(site.tagline)}</div>
      </div>
    </a>`).join('');

  const body = `<div style="font-family:system-ui,-apple-system,sans-serif">
    <div style="background:linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);color:white;padding:56px 24px 64px;text-align:center">
      <h1 style="font-size:clamp(26px,4.5vw,40px);font-weight:800;margin-bottom:16px">See What Your Roofing Website Could Actually Look Like</h1>
      <p style="font-size:15.5px;color:#94a3b8;max-width:600px;margin:0 auto">${sites.length} example sites for roofing businesses — every one a different design, not one template reskinned.</p>
    </div>
    <div style="max-width:700px;margin:0 auto;padding:40px 24px">${cards}</div>
  </div>`;
  return pageShell({
    title: 'Example Roofing Company Website Designs | RoofingCal',
    description: 'Browse example roofing company websites RoofingCal builds for roofing contractors -- several distinct designs, each with its own look.',
    canonicalPath: '/website-example',
    assets,
    bodyHtml: body,
    robots: 'noindex, follow',
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

function fmt(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

// Per-sq-ft / per-linear-ft tier rates carry meaningful cents (e.g. $2.90/sq ft) —
// rounding those to whole dollars silently discards real precision.
function fmtTier(n, service) {
  return service.unitType !== 'flat' ? `$${n.toFixed(2)}` : fmt(n);
}

function faqAccordionHtml(faqs) {
  return faqs.map(f => `
    <div style="background:#fafafa;border:1px solid #f1f5f9;border-radius:10px;overflow:hidden;margin-bottom:10px">
      <div style="padding:14px 18px;font-weight:700;font-size:14.5px;color:#0f172a">${esc(f.q)}</div>
      <div style="padding:0 18px 16px"><p style="font-size:13.5px;color:#475569;line-height:1.7;margin:0">${esc(f.a)}</p></div>
    </div>`).join('');
}

function serviceSchema(service, cost) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.metaDescription,
    provider: { '@type': 'Organization', name: 'RoofingCal', url: DOMAIN },
    areaServed: 'United States',
    offers: { '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: String(cost.low), highPrice: String(cost.high) },
  });
}

function faqSchema(faqs) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  });
}

function breadcrumbSchema(items) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.item })),
  });
}

function renderServicePage(service, statesMod, assets) {
  const headlineTier = service.tiers[service.typicalTierIndex] || service.tiers[0];
  const cost = service.unitType === 'flat'
    ? { low: headlineTier.low, high: headlineTier.high }
    : { low: Math.round(headlineTier.low * (service.typicalQuantity || 1)), high: Math.round(headlineTier.high * (service.typicalQuantity || 1)) };
  const ICON_EMOJI = { shingle_replacement: '🏠', metal_roofing: '🔲', tile_roofing: '🟧', flat_roof: '⬛', roof_repair: '🔧', roof_inspection: '🔍', gutter_replacement: '💧' };

  const tierRows = service.tiers.map((tier, i) => `
    <tr style="background:${i % 2 === 0 ? 'white' : '#fafafa'}">
      <td style="padding:10px 14px;color:#0f172a;font-weight:600;border-bottom:1px solid #f1f5f9">${esc(tier.label)}</td>
      <td style="padding:10px 14px;color:#ea580c;font-weight:700;border-bottom:1px solid #f1f5f9;white-space:nowrap">${fmtTier(tier.low, service)}&ndash;${fmtTier(tier.high, service)}${service.unitType !== 'flat' ? ` <span style="color:#94a3b8;font-weight:500;font-size:12px">/${service.unitType === 'per_lf' ? 'lin ft' : 'sq ft'}</span>` : ''}</td>
      <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #f1f5f9">${esc(tier.note)}</td>
    </tr>`).join('');

  const bulletsHtml = service.bullets.map(b => `<li style="display:flex;gap:8px;font-size:14.5px;color:#374151;line-height:1.7;margin-bottom:10px"><span style="color:#16a34a;flex-shrink:0">&check;</span>${esc(b)}</li>`).join('');

  const tier = service.tiers[service.typicalTierIndex] || service.tiers[0];
  const qty = service.unitType === 'flat' ? 1 : (service.typicalQuantity || 1);
  const featured = statesMod.getFeaturedStates();
  const stateRows = featured.map(state => {
    const range = statesMod.adjustForState(tier.low * qty, tier.high * qty, state);
    return `<a href="/roofing-cost/${state.slug}" style="text-decoration:none"><div style="border:1px solid #f1f5f9;background:#fafafa;border-radius:8px;padding:11px 14px;display:flex;justify-content:space-between;align-items:center;gap:8px"><span style="font-size:13px;font-weight:600;color:#0f172a">${esc(state.name)}</span><span style="font-size:12.5px;font-weight:700;color:#ea580c;white-space:nowrap">${fmt(range.low)}&ndash;${fmt(range.high)}</span></div></a>`;
  }).join('');

  const related = (service.relatedSlugs || []).slice(0, 3);
  const relatedHtml = related.map(slug => `<a href="/roofing-services/${slug}" style="text-decoration:none"><div style="background:white;border-radius:10px;border:1px solid #e2e8f0;padding:16px 18px"><div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">${esc(slug)}</div><span style="font-size:12.5px;color:#ea580c;font-weight:600">See pricing &rarr;</span></div></a>`).join('');

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:40px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:780px;margin:0 auto">
    <div style="display:flex;gap:6px;font-size:13px;color:#94a3b8;margin-bottom:24px;flex-wrap:wrap">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <span style="color:#0f172a">${esc(service.name)}</span>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <div style="width:44px;height:44px;border-radius:12px;background:#fff7ed;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:20px">${ICON_EMOJI[service.id] || '🏠'}</div>
      <h1 style="font-size:clamp(24px,4vw,32px);font-weight:800;color:#0f172a;line-height:1.25;margin-bottom:10px">${esc(service.name)} Cost 2026</h1>
      <p style="font-size:15.5px;color:#64748b;line-height:1.7;margin-bottom:20px">${esc(service.tagline)}</p>
      <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
        <span style="font-size:30px;font-weight:800;color:#ea580c">${fmt(cost.low)} &ndash; ${fmt(cost.high)}</span>
        <span style="font-size:13px;color:#94a3b8">${service.unitType === 'flat' ? 'typical job cost' : service.unitType === 'per_lf' ? `for a ${service.typicalQuantity} linear ft system` : `for an ${service.typicalQuantity.toLocaleString()} sq ft roof`}</span>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,#ea580c,#dc2626);border-radius:12px;padding:18px 24px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div style="color:white"><div style="font-weight:700;font-size:15px">Get a ZIP-code accurate ${esc(service.name.toLowerCase())} estimate</div><div style="font-size:13px;opacity:0.9">Free &middot; No signup &middot; 60 seconds</div></div>
      <a href="/?service=${service.id}" style="background:white;color:#ea580c;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;white-space:nowrap">Calculate Now &rarr;</a>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:6px">Pricing by Tier</h2>
      <p style="font-size:13.5px;color:#64748b;margin-bottom:4px">National average pricing &mdash; ${esc(service.unit)}.</p>
      <div style="overflow-x:auto;margin:20px 0"><table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#f8fafc"><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Tier</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Price</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Notes</th></tr></thead>
        <tbody>${tierRows}</tbody>
      </table></div>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">What to Know</h2>
      <ul style="list-style:none;padding:0;margin:0">${bulletsHtml}</ul>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">${esc(service.name)} Cost by State</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">${stateRows}</div>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">FAQs</h2>
      ${faqAccordionHtml(service.faqs)}
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:24px 28px;margin-bottom:32px;text-align:center">
      <div style="font-weight:800;font-size:18px;color:#0f172a;margin-bottom:6px">Ready to get an accurate estimate?</div>
      <p style="font-size:14px;color:#64748b;margin-bottom:16px">Use our free calculator for a ZIP-code accurate ${esc(service.name.toLowerCase())} estimate in under 60 seconds.</p>
      <a href="/?service=${service.id}" style="background:#ea580c;color:white;padding:12px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px">Get My Free Estimate &rarr;</a>
    </div>
    ${related.length ? `<div><div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Related Services</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">${relatedHtml}</div></div>` : ''}
  </div>
</div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: 'Roofing Services', item: `${DOMAIN}/#services` },
    { name: service.name, item: `${DOMAIN}/roofing-services/${service.slug}` },
  ]);

  return pageShell({
    title: service.seoTitle,
    description: service.metaDescription,
    canonicalPath: `/roofing-services/${service.slug}`,
    assets,
    bodyHtml: body,
    extraHead: `<script type="application/ld+json">${serviceSchema(service, cost)}</script><script type="application/ld+json">${faqSchema(service.faqs)}</script><script type="application/ld+json">${breadcrumb}</script>`,
  });
}

function renderStatePage(state, servicesMod, statesMod, faqsMod, citiesMod, assets) {
  const otherStates = statesMod.getAllStates().filter(s => s.slug !== state.slug);
  const cities = citiesMod.getCitiesByState(state.slug);
  const faqs = faqsMod.getAllFaqs().slice(0, 5);
  const pctVsNational = Math.round((state.multiplier - 1) * 100);
  const TIER_COPY = {
    high: `Roofing costs in ${state.name} run above the national average, driven by higher labor rates and cost of living.`,
    low: `Roofing costs in ${state.name} run below the national average, making it a comparatively affordable market for roofing work.`,
    average: `Roofing costs in ${state.name} are close to the national average.`,
  };

  const serviceRows = servicesMod.getAllServices().map((service, i) => {
    const national = servicesMod.typicalCost(service);
    const adjusted = statesMod.adjustForState(national.low, national.high, state);
    return `<tr style="background:${i % 2 === 0 ? 'white' : '#fafafa'}">
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9"><a href="/roofing-services/${service.slug}" style="color:#0f172a;font-weight:600;text-decoration:none">${esc(service.name)}</a></td>
      <td style="padding:10px 14px;color:#ea580c;font-weight:700;border-bottom:1px solid #f1f5f9;white-space:nowrap">${fmt(adjusted.low)}&ndash;${fmt(adjusted.high)}</td>
    </tr>`;
  }).join('');

  const otherStatesHtml = otherStates.map(s => `<a href="/roofing-cost/${s.slug}" style="font-size:12.5px;color:#64748b;text-decoration:none;background:white;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">${esc(s.name)}</a>`).join(' ');
  const cityLinksHtml = cities.map(c => `<a href="/roofing-cost/city/${c.slug}" style="font-size:12.5px;color:#64748b;text-decoration:none;background:white;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">${esc(c.name)}</a>`).join(' ');
  const cityLinksBlock = cities.length > 0 ? `<div style="margin-bottom:24px">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Roofing Costs by City in ${esc(state.name)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${cityLinksHtml}</div>
    </div>` : '';

  const title = `Roofing Cost in ${state.name} (2026) | Average Prices & Estimates | RoofingCal`;
  const description = `See average roofing costs in ${state.name} for 2026: full replacement, repair, metal, tile, and more, adjusted for local labor rates. Get a free instant estimate.`;

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:40px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:780px;margin:0 auto">
    <div style="display:flex;gap:6px;font-size:13px;color:#94a3b8;margin-bottom:24px;flex-wrap:wrap">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <span style="color:#0f172a">Roofing Cost in ${esc(state.name)}</span>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <div style="font-size:12px;font-weight:700;color:#ea580c;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px">${esc(state.name)}</div>
      <h1 style="font-size:clamp(24px,4vw,32px);font-weight:800;color:#0f172a;line-height:1.25;margin-bottom:10px">Roofing Cost in ${esc(state.name)} (2026)</h1>
      <p style="font-size:15.5px;color:#64748b;line-height:1.7;margin-bottom:20px">${esc(TIER_COPY[state.tier])}${pctVsNational !== 0 ? ` That's about ${Math.abs(pctVsNational)}% ${pctVsNational > 0 ? 'above' : 'below'} the national average.` : ''}</p>
      <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
        <span style="font-size:30px;font-weight:800;color:#ea580c">${fmt(state.low)} &ndash; ${fmt(state.high)}</span>
        <span style="font-size:13px;color:#94a3b8">full roof replacement, 1,800 sq ft home</span>
      </div>
      <div style="font-size:13px;color:#94a3b8;margin-top:6px">&asymp; ${fmt(state.costPerSqft)} per sq ft installed on average in ${esc(state.name)}</div>
    </div>
    <div style="background:linear-gradient(135deg,#ea580c,#dc2626);border-radius:12px;padding:18px 24px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div style="color:white"><div style="font-weight:700;font-size:15px">Get a ZIP-code accurate estimate in ${esc(state.name)}</div><div style="font-size:13px;opacity:0.9">Free &middot; No signup &middot; 60 seconds</div></div>
      <a href="/" style="background:white;color:#ea580c;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;white-space:nowrap">Calculate Now &rarr;</a>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:6px">Cost by Service in ${esc(state.name)}</h2>
      <p style="font-size:13.5px;color:#64748b;margin-bottom:4px">Estimated typical job cost, adjusted for ${esc(state.name)}'s labor rates.</p>
      <div style="overflow-x:auto;margin:20px 0"><table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#f8fafc"><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Service</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">${esc(state.name)} Estimate</th></tr></thead>
        <tbody>${serviceRows}</tbody>
      </table></div>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">FAQs</h2>
      ${faqAccordionHtml(faqs)}
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:24px 28px;margin-bottom:32px;text-align:center">
      <div style="font-weight:800;font-size:18px;color:#0f172a;margin-bottom:6px">Ready to get an accurate estimate?</div>
      <p style="font-size:14px;color:#64748b;margin-bottom:16px">Use our free calculator for a ZIP-code accurate roofing estimate in ${esc(state.name)} in under 60 seconds.</p>
      <a href="/" style="background:#ea580c;color:white;padding:12px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px">Get My Free Estimate &rarr;</a>
    </div>
    ${cityLinksBlock}
    <div>
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Roofing Costs in Other States</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${otherStatesHtml}</div>
    </div>
  </div>
</div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: `Roofing Cost in ${state.name}`, item: `${DOMAIN}/roofing-cost/${state.slug}` },
  ]);

  return pageShell({
    title,
    description,
    canonicalPath: `/roofing-cost/${state.slug}`,
    assets,
    bodyHtml: body,
    extraHead: `<script type="application/ld+json">${faqSchema(faqs)}</script><script type="application/ld+json">${breadcrumb}</script>`,
  });
}

function renderCityPage(city, citiesMod, faqsMod, assets) {
  const otherCitiesInState = citiesMod.getCitiesByState(city.stateSlugRef).filter(c => c.slug !== city.slug);
  const featuredCities = citiesMod.getFeaturedCities().filter(c => c.slug !== city.slug).slice(0, 8);
  const faqs = faqsMod.getAllFaqs().slice(0, 5);
  const pctVsNational = Math.round((city.multiplier - 1) * 100);
  const TIER_COPY = {
    high: `Roofing costs in ${city.name} run above the national average, in line with ${city.name}'s overall cost of living.`,
    low: `Roofing costs in ${city.name} run below the national average, making it a comparatively affordable market for roofing work.`,
    average: `Roofing costs in ${city.name} are close to the national average.`,
  };

  const serviceRows = citiesMod.cityServicePrices(city).map(({ service, low, high }, i) => `<tr style="background:${i % 2 === 0 ? 'white' : '#fafafa'}">
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9"><a href="/roofing-services/${service.slug}" style="color:#0f172a;font-weight:600;text-decoration:none">${esc(service.name)}</a></td>
      <td style="padding:10px 14px;color:#ea580c;font-weight:700;border-bottom:1px solid #f1f5f9;white-space:nowrap">${fmt(low)}&ndash;${fmt(high)}</td>
    </tr>`).join('');

  const otherCitiesHtml = otherCitiesInState.map(c => `<a href="/roofing-cost/city/${c.slug}" style="font-size:12.5px;color:#64748b;text-decoration:none;background:white;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">${esc(c.name)}</a>`).join(' ');
  const featuredCitiesHtml = featuredCities.map(c => `<a href="/roofing-cost/city/${c.slug}" style="font-size:12.5px;color:#64748b;text-decoration:none;background:white;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">${esc(c.name)}, ${esc(c.stateCode)}</a>`).join(' ');

  const title = `Roofing Cost in ${city.name}, ${city.stateCode} (2026) | RoofingCal`;
  const description = `See average roofing costs in ${city.name}, ${city.stateName} for 2026: shingle, metal, tile, flat roofing, repair, inspection, and gutters. Get a free instant estimate.`;

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:40px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:780px;margin:0 auto">
    <div style="display:flex;gap:6px;font-size:13px;color:#94a3b8;margin-bottom:24px;flex-wrap:wrap">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <a href="/roofing-cost/${city.stateSlugRef}" style="color:#64748b;text-decoration:none">${esc(city.stateName)}</a><span>&rsaquo;</span>
      <span style="color:#0f172a">${esc(city.name)}</span>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <div style="font-size:12px;font-weight:700;color:#ea580c;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px">${esc(city.name)}, ${esc(city.stateCode)}</div>
      <h1 style="font-size:clamp(24px,4vw,32px);font-weight:800;color:#0f172a;line-height:1.25;margin-bottom:10px">Roofing Cost in ${esc(city.name)}, ${esc(city.stateCode)} (2026)</h1>
      <p style="font-size:15.5px;color:#64748b;line-height:1.7;margin-bottom:20px">${esc(TIER_COPY[city.tier])}${pctVsNational !== 0 ? ` That's about ${Math.abs(pctVsNational)}% ${pctVsNational > 0 ? 'above' : 'below'} the national average, matching the broader ${esc(city.stateName)} market.` : ''}</p>
      <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
        <span style="font-size:30px;font-weight:800;color:#ea580c">${fmt(city.low)} &ndash; ${fmt(city.high)}</span>
        <span style="font-size:13px;color:#94a3b8">full asphalt shingle roof replacement, 2,000 sq ft roof</span>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,#ea580c,#c2410c);border-radius:12px;padding:18px 24px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div style="color:white"><div style="font-weight:700;font-size:15px">Get a ZIP-code accurate estimate in ${esc(city.name)}</div><div style="font-size:13px;opacity:0.9">Free &middot; No signup &middot; 60 seconds</div></div>
      <a href="/" style="background:white;color:#ea580c;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;white-space:nowrap">Calculate Now &rarr;</a>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:6px">Cost by Service in ${esc(city.name)}</h2>
      <p style="font-size:13.5px;color:#64748b;margin-bottom:4px">Estimated typical job cost, adjusted for the ${esc(city.stateName)} market. <a href="/how-we-calculate-prices" style="color:#ea580c;font-weight:600">See how we calculate these prices &rarr;</a></p>
      <div style="overflow-x:auto;margin:20px 0"><table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#f8fafc"><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Service</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">${esc(city.name)} Estimate</th></tr></thead>
        <tbody>${serviceRows}</tbody>
      </table></div>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">FAQs</h2>
      ${faqAccordionHtml(faqs)}
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:24px 28px;margin-bottom:32px;text-align:center">
      <div style="font-weight:800;font-size:18px;color:#0f172a;margin-bottom:6px">Ready to get an accurate estimate?</div>
      <p style="font-size:14px;color:#64748b;margin-bottom:16px">Use our free calculator for a ZIP-code accurate roofing estimate in ${esc(city.name)} in under 60 seconds.</p>
      <a href="/" style="background:#ea580c;color:white;padding:12px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px">Get My Free Estimate &rarr;</a>
    </div>
    ${otherCitiesInState.length > 0 ? `<div style="margin-bottom:32px">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">More Cities in ${esc(city.stateName)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${otherCitiesHtml}
        <a href="/roofing-cost/${city.stateSlugRef}" style="font-size:12.5px;color:#ea580c;font-weight:700;text-decoration:none;background:#fff7ed;border:1px solid #fed7aa;border-radius:20px;padding:6px 12px">All of ${esc(city.stateName)} &rarr;</a>
      </div>
    </div>` : ''}
    <div>
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Popular Cities</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${featuredCitiesHtml}</div>
    </div>
  </div>
</div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: `Roofing Cost in ${city.stateName}`, item: `${DOMAIN}/roofing-cost/${city.stateSlugRef}` },
    { name: `Roofing Cost in ${city.name}`, item: `${DOMAIN}/roofing-cost/city/${city.slug}` },
  ]);

  return pageShell({
    title,
    description,
    canonicalPath: `/roofing-cost/city/${city.slug}`,
    assets,
    bodyHtml: body,
    extraHead: `<script type="application/ld+json">${faqSchema(faqs)}</script><script type="application/ld+json">${breadcrumb}</script>`,
  });
}

// Shared calculator-placeholder box used across the three pages that embed
// the live <RoofingCalculator> client-side -- mirrors the Calculate Now CTA
// pattern other prerendered pages use instead of a non-functional static
// replica of the real interactive form.
function calculatorPlaceholderHtml() {
  return `<div style="max-width:720px;margin:0 auto;background:white;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.10);border:1px solid #e2e8f0;overflow:hidden;padding:48px 24px;text-align:center">
    <div style="display:inline-block;background:#ea580c;color:white;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600">Loading calculator&hellip;</div>
  </div>`;
}

function renderServiceCalculatorPage(service, assets) {
  const pageSlug = `${service.slug}-calculator`;
  const title = `${service.name} Cost Calculator - Free Instant Estimate (2026)`;
  const description = `Free ${service.name.toLowerCase()} cost calculator with ZIP-code accurate pricing. ${service.tagline}`;

  const bulletsHtml = service.bullets.map(b => `<div style="display:flex;gap:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px"><span style="color:#16a34a;flex-shrink:0">&check;</span><span style="font-size:13.5px;color:#374151;line-height:1.6">${esc(b)}</span></div>`).join('');

  const related = (service.relatedSlugs || []).slice(0, 3);
  const relatedHtml = related.length
    ? `<p style="font-size:13.5px;color:#94a3b8">Other calculators: ${related.map(slug => `<a href="/${slug}-calculator" style="color:#ea580c;font-weight:600">${esc(slug)}</a>`).join(' &middot; ')}</p>`
    : '';

  const body = `<div class="page-hero-wrap" style="font-family:system-ui,-apple-system,sans-serif">
    <div class="page-hero-breadcrumb">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <span style="color:#0f172a">${esc(service.name)} Cost Calculator</span>
    </div>
    <div class="page-hero-block">
      <h1 class="page-hero-title">${esc(service.name)} Cost Calculator</h1>
      <p class="page-hero-subtitle">Get an instant, ZIP-code accurate ${esc(service.name.toLowerCase())} estimate &mdash; enter a few details and see a real price range in under 60 seconds. ${esc(service.tagline)}</p>
    </div>
    ${calculatorPlaceholderHtml()}
    <div style="margin-top:48px">
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin-bottom:20px;text-align:center">What Affects Your ${esc(service.name)} Price</h2>
      <div style="display:flex;flex-direction:column;gap:10px;max-width:720px;margin:0 auto">${bulletsHtml}</div>
    </div>
    <div style="margin-top:48px;background:white;border:1px solid #e2e8f0;border-radius:16px;padding:32px 36px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:16px">${esc(service.name)} Cost Calculator FAQs</h2>
      ${faqAccordionHtml(service.faqs)}
    </div>
    <div style="margin-top:40px;text-align:center">
      <p style="font-size:14px;color:#64748b;margin-bottom:14px">Want the full price breakdown by tier? See our <a href="/roofing-services/${service.slug}" style="color:#ea580c;font-weight:600">complete ${esc(service.name.toLowerCase())} cost guide</a>.</p>
      ${relatedHtml}
    </div>
  </div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: `${service.name} Cost Calculator`, item: `${DOMAIN}/${pageSlug}` },
  ]);
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${service.name} Cost Calculator`,
    url: `${DOMAIN}/${pageSlug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
  };

  return pageShell({
    title,
    description,
    canonicalPath: `/${pageSlug}`,
    assets,
    bodyHtml: body,
    extraHead: `<script type="application/ld+json">${JSON.stringify(webAppSchema)}</script><script type="application/ld+json">${breadcrumb}</script><script type="application/ld+json">${faqSchema(service.faqs)}</script>`,
  });
}

function renderCalculatorOrEstimatorPage({ slug, heading, heroCopy, whyPoints, faqs, title, description }, assets) {
  const whyHtml = whyPoints.map(({ title: t, body }) => `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:22px 24px">
      <h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">${esc(t)}</h3>
      <p style="font-size:13.5px;color:#475569;line-height:1.6;margin:0">${esc(body)}</p>
    </div>`).join('');

  const body = `<div class="page-hero-wrap" style="font-family:system-ui,-apple-system,sans-serif">
    <div class="page-hero-breadcrumb">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <span style="color:#0f172a">${esc(heading)}</span>
    </div>
    <div class="page-hero-block">
      <h1 class="page-hero-title">${esc(heading)}</h1>
      <p class="page-hero-subtitle">${esc(heroCopy)}</p>
    </div>
    ${calculatorPlaceholderHtml()}
    <div style="margin-top:48px">
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin-bottom:20px;text-align:center">Why Use This ${esc(heading)}</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">${whyHtml}</div>
    </div>
    <div style="margin-top:48px;background:white;border:1px solid #e2e8f0;border-radius:16px;padding:32px 36px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:16px">${esc(heading)} FAQs</h2>
      ${faqAccordionHtml(faqs)}
    </div>
    <div style="margin-top:40px;text-align:center">
      <p style="font-size:14px;color:#64748b">Want cost breakdowns by state or service instead? Browse our <a href="/blog" style="color:#ea580c;font-weight:600">roofing cost guides</a>.</p>
    </div>
  </div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: heading, item: `${DOMAIN}/${slug}` },
  ]);
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: heading,
    url: `${DOMAIN}/${slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
  };

  return pageShell({
    title,
    description,
    canonicalPath: `/${slug}`,
    assets,
    bodyHtml: body,
    extraHead: `<script type="application/ld+json">${JSON.stringify(webAppSchema)}</script><script type="application/ld+json">${breadcrumb}</script><script type="application/ld+json">${faqSchema(faqs)}</script>`,
  });
}

function renderMethodologyPage(assets) {
  const SECTIONS = [
    { title: 'Our Base Pricing', body: "Every price tier in our calculator — for shingle, metal, tile, and flat roofing, plus repair, inspection, and gutters — starts from aggregated material and labor cost research across residential roofing contractors nationwide: published rate surveys, manufacturer install guides, and industry cost data. We don't invent a number and work backward; we build each tier from what contractors are actually charging per square foot or per job, then keep it current as material costs and labor rates shift." },
    { title: 'State Cost-of-Living Adjustments', body: "The same shingle roof replacement costs more in California than in Mississippi, and our numbers reflect that. Each state carries a multiplier — California sits around 1.48× the national baseline, Mississippi and West Virginia around 0.80× — built from regional construction labor cost, permit costs, and material freight differences. That multiplier is applied directly to the national base price for whichever service you're pricing, not estimated separately per state." },
    { title: 'City and ZIP Code Pricing', body: "For city-level pages, we intentionally reuse the parent state's pricing data rather than inventing separate city-specific numbers. Reliable, verifiable roofing cost data doesn't exist at neighborhood granularity for most markets — and we'd rather show you a number we can stand behind than a more precise-looking one we made up. If that changes for a given metro area, we'll update it." },
    { title: 'How Roof Size, Pitch, and Complexity Change Your Price', body: "Tear-off, decking replacement, pitch, story count, and roof shape complexity are all priced as multipliers or per-sq-ft adders on top of the base material cost, derived from how roofing contractors actually structure their own estimates — for example, a steep 6:12–9:12 pitch consistently adds around 28% to labor cost across the contractors we've reviewed, and a very steep 9:12+ pitch can add up to 50%, since both require harnesses and slower, more careful work." },
    { title: 'Where We Reference Outside Sources', body: null },
    { title: "What Our Estimates Are — and Aren't", body: "Every number on RoofingCal is a starting point, not a quote. Actual pricing depends on the specific condition of a roof (rotted decking, extra penetrations, hidden damage), local competition, and each contractor's own pricing — factors that are only ever fully visible from an in-person inspection. Use our numbers to negotiate confidently and spot outliers, then always get multiple quotes from licensed, insured roofing contractors before booking." },
    { title: 'How Often We Update Pricing', body: "We review and adjust our pricing models as national and regional material and labor costs change, rather than on a fixed calendar schedule. If you ever see a number that looks out of step with what you're being quoted locally, we want to know — contact us and we'll take a look." },
  ];
  const CITATIONS = [
    { name: 'National Roofing Contractors Association (NRCA)', use: 'Industry installation standards and terminology (pitch categories, tear-off practices) referenced across our roofing cost guides.', href: 'https://www.nrca.net' },
    { name: 'Insurance Institute for Business & Home Safety (IBHS)', use: 'Roofing material durability and storm-resistance guidance referenced in our metal and impact-resistant shingle content.', href: 'https://ibhs.org' },
    { name: 'ENERGY STAR (U.S. EPA / DOE program)', use: 'Reflective/cool-roofing energy-efficiency claims referenced in our metal and TPO roofing content.', href: 'https://www.energystar.gov' },
  ];

  const sectionsHtml = SECTIONS.map(({ title: t, body }) => `<div style="background:white;border-radius:16px;padding:26px 28px;border:1px solid #e2e8f0;box-shadow:0 1px 2px rgba(15,23,42,0.03),0 4px 16px rgba(15,23,42,0.05)">
      <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:8px">${esc(t)}</h2>
      ${body ? `<p style="font-size:15px;color:#374151;line-height:1.7;margin:0">${esc(body)}</p>` : `<p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 4px">Where our content relies on industry standards, material performance claims, or program guidance rather than our own pricing data, we cite the source directly:</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">${CITATIONS.map(c => `<div style="font-size:14px;color:#475569;line-height:1.6;padding-left:14px;border-left:2px solid #e2e8f0"><a href="${c.href}" target="_blank" rel="noopener noreferrer" style="color:#ea580c;font-weight:700;text-decoration:none">${esc(c.name)}</a> &mdash; ${esc(c.use)}</div>`).join('')}</div>`}
    </div>`).join('');

  const body = `<div style="max-width:780px;margin:0 auto;padding:60px 24px;font-family:system-ui,-apple-system,sans-serif">
    <div style="display:flex;gap:6px;font-size:13px;color:#94a3b8;margin-bottom:20px;flex-wrap:wrap">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <span style="color:#0f172a">How We Calculate Prices</span>
    </div>
    <h1 style="font-size:40px;font-weight:900;color:#0f172a;margin-bottom:12px;letter-spacing:-0.01em">How We Calculate Roofing Prices</h1>
    <p style="font-size:18px;color:#64748b;margin-bottom:40px;line-height:1.7">Every estimate on RoofingCal comes from a real methodology, not a guess. Here's exactly how the numbers behind the calculator — and every cost guide on this site — actually get built.</p>
    <div style="display:flex;flex-direction:column;gap:20px">${sectionsHtml}</div>
    <div style="margin-top:44px;background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;padding:32px 36px;text-align:center">
      <h2 style="font-size:22px;font-weight:800;color:white;margin-bottom:10px">See the Methodology in Action</h2>
      <p style="color:#94a3b8;margin-bottom:20px;font-size:15px">Run a real, ZIP-code accurate estimate using the pricing engine described above.</p>
      <a href="/roofing-cost-calculator" style="background:#ea580c;color:white;padding:13px 30px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">Try the Calculator &rarr;</a>
    </div>
  </div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: 'How We Calculate Prices', item: `${DOMAIN}/how-we-calculate-prices` },
  ]);

  return pageShell({
    title: 'How We Calculate Roofing Prices | RoofingCal',
    description: "See exactly how RoofingCal builds its pricing: base rate research, state cost-of-living adjustments, city pricing methodology, and the external sources we cite. Full transparency on where our numbers come from.",
    canonicalPath: '/how-we-calculate-prices',
    assets,
    bodyHtml: body,
    extraHead: `<script type="application/ld+json">${breadcrumb}</script>`,
  });
}

// States with a full, genuinely state-specific deep-dive post (not just the
// templated page) -- must stay in sync with DEEP_POST_BY_CODE in
// StartRoofingBusinessStatePage.js.
const ROOFING_BIZ_DEEP_POST_BY_CODE = {
  TX: 'how-to-start-a-roofing-business-in-texas',
  FL: 'how-to-start-a-roofing-business-in-florida',
  CO: 'how-to-start-a-roofing-business-in-colorado',
  OK: 'how-to-start-a-roofing-business-in-oklahoma',
  GA: 'how-to-start-a-roofing-business-in-georgia',
  NC: 'how-to-start-a-roofing-business-in-north-carolina',
};

const ROOFING_BIZ_STEPS = [
  { title: 'Choose a business structure', body: 'Most roofing businesses should form an LLC rather than operate as a sole proprietor, given the liability in roof work.', href: '/blog/llc-vs-sole-proprietorship-roofing-business', linkText: 'LLC vs. sole proprietorship' },
  { title: 'Confirm your licensing requirements', body: "Contractor licensing for roofing varies by state -- check directly with your state licensing board before you spend on anything else.", href: '/blog/roofing-contractor-license-requirements-by-state', linkText: 'Full licensing overview' },
  { title: 'Get insured and bonded', body: 'General liability insurance and a contractor license bond, before your first paid job.', href: '/blog/roofing-business-insurance-bonding-guide', linkText: 'Insurance & bonding guide' },
  { title: 'Buy your equipment', body: 'Fall protection, tear-off tools, and nailers -- or start lean by subcontracting installs.', href: '/blog/roofing-crew-equipment-checklist', linkText: 'Equipment checklist' },
  { title: 'Price your jobs', body: 'Bid on a true per-square basis that covers overhead and warranty reserve, not just materials and labor.', href: '/blog/how-to-price-roofing-jobs', linkText: 'Pricing guide' },
  { title: 'Get your first customers', body: 'Your network first, then a real web presence with an instant estimate calculator.', href: '/website-for-roofing-companies', linkText: 'Get a roofing website' },
];

function roofingBizFaqs(stateName) {
  return [
    { q: `How much does it cost to form an LLC in ${stateName}?`, a: `See the exact filing fee and agency above. The LLC fee is the same regardless of industry -- what varies for a roofing business specifically is contractor licensing cost and insurance, which depend on your state's requirements and your business model.` },
    { q: `Do I need a special contractor license to roof in ${stateName}?`, a: `This genuinely varies by state and isn't something to guess on. Some states require a dedicated roofing or general contractor license, others leave regulation mostly to the city or county, and requirements change over time. Contact your state contractor licensing board directly to confirm what applies in ${stateName} before committing to a business model.` },
    { q: `What's the fastest way to get my first customers in ${stateName}?`, a: `Your personal network almost always provides your first job. From there, a free Google Business Profile, asking every customer for a review, and getting a real website with an instant estimate calculator online are the highest-leverage next steps.` },
    { q: `Should I install myself or subcontract in ${stateName}?`, a: `Many new roofing businesses start by handling sales, inspections, and insurance-claim coordination while subcontracting the physical tear-off and install to a licensed crew -- lower capital requirement, faster to revenue -- and bring installation in-house once they have volume. See our full startup guide for the tradeoffs.` },
  ];
}

function renderStartBusinessStatePage(state, biz, statesMod, assets) {
  const otherStates = statesMod.getAllStates().filter(s => s.slug !== state.slug);
  const faqs = roofingBizFaqs(state.name);
  const deepPostSlug = ROOFING_BIZ_DEEP_POST_BY_CODE[state.code];

  const otherStatesHtml = otherStates.map(s => `<a href="/start-a-roofing-business/${s.slug}" style="font-size:12.5px;color:#64748b;text-decoration:none;background:white;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">${esc(s.name)}</a>`).join(' ');

  const title = `How to Start a Roofing Business in ${state.name} (2026): Costs, LLC Fees & Licensing | RoofingCal`;
  const description = `Everything you need to start a roofing business in ${state.name}: LLC filing fee (${fmt(biz.llcFee)}), licensing, insurance, equipment, pricing, and getting your first customers.`;

  const stepsHtml = ROOFING_BIZ_STEPS.map((step, i) => `
    <div style="display:flex;gap:12px">
      <div style="flex-shrink:0;margin-top:1px;color:${PRIMARY};font-weight:800">&check;</div>
      <div>
        <div style="font-weight:700;font-size:14.5px;color:#0f172a;margin-bottom:2px">${i + 1}. ${esc(step.title)}</div>
        <div style="font-size:13.5px;color:#64748b;line-height:1.6">${esc(step.body)} <a href="${step.href}" style="color:${PRIMARY};font-weight:600">${esc(step.linkText)} &rarr;</a></div>
      </div>
    </div>`).join('');

  const deepPostBlock = deepPostSlug ? `<a href="/blog/${deepPostSlug}" style="display:flex;align-items:center;justify-content:space-between;gap:12px;background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px 20px;margin-bottom:24px;text-decoration:none;flex-wrap:wrap">
      <span style="font-size:14px;font-weight:700;color:#0f172a">Read the full ${esc(state.name)}-specific guide &mdash; market size, storm demand, and more &rarr;</span>
      <span style="font-size:13px;font-weight:700;color:${PRIMARY};white-space:nowrap">Read guide</span>
    </a>` : '';

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:40px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:780px;margin:0 auto">
    <div style="display:flex;gap:6px;font-size:13px;color:#94a3b8;margin-bottom:24px;flex-wrap:wrap">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <a href="/start-a-roofing-business" style="color:#64748b;text-decoration:none">Start a Roofing Business</a><span>&rsaquo;</span>
      <span style="color:#0f172a">${esc(state.name)}</span>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:12px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.05em">${esc(state.name)}</span>
      </div>
      <h1 style="font-size:clamp(24px,4vw,32px);font-weight:800;color:#0f172a;line-height:1.25;margin-bottom:10px">How to Start a Roofing Business in ${esc(state.name)}</h1>
      <p style="font-size:15.5px;color:#64748b;line-height:1.7">What it costs to register and insure a roofing business in ${esc(state.name)}, what to check on licensing, and the full step-by-step checklist to get your first customer.</p>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:16px">${esc(state.name)} LLC Filing Quick Facts</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:16px">
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px"><div style="font-size:11px;font-weight:700;color:${PRIMARY_DARK};text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px">LLC Filing Fee</div><div style="font-size:22px;font-weight:800;color:#0f172a">${fmt(biz.llcFee)}</div></div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px"><div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px">Filing Agency</div><div style="font-size:14px;font-weight:700;color:#0f172a;line-height:1.4">${esc(biz.agency)}</div></div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px"><div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px">State Income Tax</div><div style="font-size:14px;font-weight:700;color:#0f172a">${biz.noIncomeTax ? 'None' : 'Applies'}</div></div>
      </div>
      <p style="font-size:13.5px;color:#475569;line-height:1.7;margin:0">${esc(biz.note)}</p>
      <p style="font-size:11.5px;color:#94a3b8;line-height:1.6;margin:12px 0 0">Filing fees change periodically &mdash; confirm the current fee directly with the ${esc(biz.agency)} before filing. This is general informational content, not legal, tax, or licensing advice.</p>
    </div>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin-bottom:24px">
      <div style="font-weight:800;font-size:15px;color:#0f172a;margin-bottom:6px">Contractor licensing is state-specific &mdash; don't guess</div>
      <p style="font-size:13.5px;color:#991b1b;line-height:1.7;margin:0">Unlike the LLC fee above, contractor licensing requirements for roofing vary meaningfully by state and change over time. Before you commit to a business model, contact ${esc(state.name)}'s contractor licensing board directly to confirm what license type, exam, and bonding your state requires. See our <a href="/blog/roofing-contractor-license-requirements-by-state" style="color:#991b1b;font-weight:700">full licensing overview</a> for what to ask and who to contact.</p>
    </div>
    ${deepPostBlock}
    <div style="background:linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK});border-radius:12px;padding:18px 24px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div style="color:white"><div style="font-weight:700;font-size:15px">Get your ${esc(state.name)} roofing business online</div><div style="font-size:13px;opacity:0.9">$5 to start &middot; 2 months free &middot; then $249/mo</div></div>
      <a href="/website-for-roofing-companies" style="background:white;color:${PRIMARY};padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;white-space:nowrap">Get a Free Website &rarr;</a>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:16px">Startup Checklist for ${esc(state.name)}</h2>
      <div style="display:flex;flex-direction:column;gap:14px">${stepsHtml}</div>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:8px">The ${esc(state.name)} Roofing Market</h2>
      <p style="font-size:13.5px;color:#64748b;line-height:1.7">A typical full roof replacement in ${esc(state.name)} runs roughly <strong style="color:#0f172a">${fmt(state.low)}&ndash;${fmt(state.high)}</strong> for a 2,000 sq ft roof &mdash; a useful benchmark when you're setting your own bids. See the <a href="/roofing-cost/${state.slug}" style="color:${PRIMARY};font-weight:600">full ${esc(state.name)} pricing breakdown</a>, or our <a href="/blog/how-to-price-roofing-jobs" style="color:${PRIMARY};font-weight:600">complete pricing guide</a> for how to build your own bids from there.</p>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">FAQs</h2>
      ${faqAccordionHtml(faqs)}
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:24px 28px;margin-bottom:32px;text-align:center">
      <div style="font-weight:800;font-size:18px;color:#0f172a;margin-bottom:6px">Not ready to build your own marketing yet?</div>
      <p style="font-size:14px;color:#64748b;margin-bottom:16px">RoofingCal's Partner Program gives one roofing company per city exclusive, guaranteed lead visibility &mdash; no website required to start.</p>
      <a href="/partner-with-us" style="background:${PRIMARY};color:white;padding:12px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px">See If Your City Is Available &rarr;</a>
    </div>
    <div style="margin-bottom:32px">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">The Full Starting-a-Roofing-Business Guide</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <a href="/blog/how-to-start-a-roofing-business" style="font-size:12.5px;color:#64748b;text-decoration:none;background:white;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">Full Startup Guide</a>
        <a href="/blog/cost-to-start-a-roofing-business" style="font-size:12.5px;color:#64748b;text-decoration:none;background:white;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">Startup Cost Breakdown</a>
        <a href="/blog/roofing-crew-equipment-checklist" style="font-size:12.5px;color:#64748b;text-decoration:none;background:white;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">Equipment Checklist</a>
        <a href="/blog/category/starting-a-roofing-business" style="font-size:12.5px;color:${PRIMARY};font-weight:700;text-decoration:none;background:white;border:1px solid #fed7aa;border-radius:20px;padding:6px 12px">See All Roofing Business Guides &rarr;</a>
      </div>
    </div>
    <div>
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Start a Roofing Business in Other States</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${otherStatesHtml}</div>
    </div>
  </div>
</div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: 'Start a Roofing Business', item: `${DOMAIN}/start-a-roofing-business` },
    { name: `Start a Roofing Business in ${state.name}`, item: `${DOMAIN}/start-a-roofing-business/${state.slug}` },
  ]);

  return pageShell({
    title,
    description,
    canonicalPath: `/start-a-roofing-business/${state.slug}`,
    assets,
    bodyHtml: body,
    extraHead: `<script type="application/ld+json">${faqSchema(faqs)}</script><script type="application/ld+json">${breadcrumb}</script>`,
  });
}

function renderStartBusinessIndexPage(statesMod, posts, assets) {
  const states = statesMod.getAllStates();
  const bizPosts = posts.filter(p => p.category === 'starting-a-roofing-business');

  const statesHtml = states.map(s => `<a href="/start-a-roofing-business/${s.slug}" style="font-size:12.5px;color:#64748b;text-decoration:none;background:#f8fafc;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">${esc(s.name)}</a>`).join(' ');
  const postsHtml = bizPosts.map(p => `
    <a href="/blog/${p.slug}" style="display:block;background:white;border:1px solid #e2e8f0;border-radius:12px;padding:18px;text-decoration:none">
      <div style="font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">${esc(p.readTime || '8 min read')}</div>
      <div style="font-size:15px;font-weight:700;color:#0f172a;line-height:1.4;margin-bottom:8px">${esc(p.title)}</div>
      <span style="font-size:13px;color:${PRIMARY};font-weight:700">Read guide &rarr;</span>
    </a>`).join('');

  const title = 'How to Start a Roofing Business (2026): Costs, Licensing & State-by-State Guide | RoofingCal';
  const description = 'Everything you need to start a roofing business: LLC setup, licensing, insurance, pricing, equipment, and safety -- plus exact LLC filing fees for all 50 states.';

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:40px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:880px;margin:0 auto">
    <div style="display:flex;gap:6px;font-size:13px;color:#94a3b8;margin-bottom:24px;flex-wrap:wrap">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <span style="color:#0f172a">Start a Roofing Business</span>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:28px">
      <div style="font-size:12px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px">Starting Your Business</div>
      <h1 style="font-size:clamp(26px,4.5vw,36px);font-weight:800;color:#0f172a;line-height:1.2;margin-bottom:14px">How to Start a Roofing Business</h1>
      <p style="font-size:16px;color:#64748b;line-height:1.7">Everything you need to go from idea to your first install: business structure, licensing, insurance, equipment, pricing, OSHA safety, and getting your first customers &mdash; plus the LLC filing fee for every state.</p>
    </div>
    <div style="background:linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK});border-radius:12px;padding:18px 24px;margin-bottom:32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div style="color:white"><div style="font-weight:700;font-size:15px">Ready to get online?</div><div style="font-size:13px;opacity:0.9">$5 to start &middot; 2 months free &middot; then $249/mo</div></div>
      <a href="/website-for-roofing-companies" style="background:white;color:${PRIMARY};padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;white-space:nowrap">Get a Free Website &rarr;</a>
    </div>
    <div style="margin-bottom:36px">
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:16px">The Complete Starting-Out Guide</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">${postsHtml}</div>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:28px">
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:6px">Find Your State's LLC Filing Fee</h2>
      <p style="font-size:13.5px;color:#64748b;margin-bottom:18px">LLC filing fees, filing agencies, and state-specific notes for every state.</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${statesHtml}</div>
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:24px 28px;text-align:center">
      <div style="font-weight:800;font-size:18px;color:#0f172a;margin-bottom:6px">Not ready to build your own marketing yet?</div>
      <p style="font-size:14px;color:#64748b;margin-bottom:16px">RoofingCal's Partner Program gives one roofing company per city exclusive, guaranteed lead visibility &mdash; no website required to start.</p>
      <a href="/partner-with-us" style="background:${PRIMARY};color:white;padding:12px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px">See If Your City Is Available &rarr;</a>
    </div>
  </div>
</div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: 'Start a Roofing Business', item: `${DOMAIN}/start-a-roofing-business` },
  ]);

  return pageShell({
    title,
    description,
    canonicalPath: '/start-a-roofing-business',
    assets,
    bodyHtml: body,
    extraHead: `<script type="application/ld+json">${breadcrumb}</script>`,
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
  const servicesMod = loadServicesData();
  const statesMod = loadStatesData();
  const faqsMod = loadFaqsData();
  const citiesMod = loadCitiesData(statesMod, servicesMod);
  const sitesMod = loadSitesData();
  const roofingBizMod = loadRoofingBizData();
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
  writeFile('website-for-roofing-companies', renderWebsiteSubscription(assets));
  count++;
  writeFile('website-example', renderDemoGallery(sitesMod, assets));
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

  const services = servicesMod.getAllServices();
  for (const service of services) {
    writeFile(`roofing-services/${service.slug}`, renderServicePage(service, statesMod, assets));
    count++;
  }

  const states = statesMod.getAllStates();
  for (const state of states) {
    writeFile(`roofing-cost/${state.slug}`, renderStatePage(state, servicesMod, statesMod, faqsMod, citiesMod, assets));
    count++;
  }

  const cities = citiesMod.getAllCities();
  for (const city of cities) {
    writeFile(`roofing-cost/city/${city.slug}`, renderCityPage(city, citiesMod, faqsMod, assets));
    count++;
  }

  writeFile('start-a-roofing-business', renderStartBusinessIndexPage(statesMod, posts, assets));
  count++;

  for (const state of states) {
    const biz = roofingBizMod.getStateBusinessStartupByCode(state.code);
    if (!biz) continue;
    writeFile(`start-a-roofing-business/${state.slug}`, renderStartBusinessStatePage(state, biz, statesMod, assets));
    count++;
  }

  for (const service of services) {
    writeFile(`${service.slug}-calculator`, renderServiceCalculatorPage(service, assets));
    count++;
  }

  writeFile('how-we-calculate-prices', renderMethodologyPage(assets));
  count++;

  writeFile('roofing-cost-calculator', renderCalculatorOrEstimatorPage({
    slug: 'roofing-cost-calculator',
    heading: 'Roof Cost Calculator',
    heroCopy: 'This free roof cost calculator gives you an instant, ZIP-code specific price for shingle, metal, tile, and flat roof replacement, plus repair, inspection, and gutters. Built as a standalone roofing calculator you can bookmark and reuse — no signup, no phone calls, just enter your details and get a real price range in under 60 seconds.',
    whyPoints: [
      { title: 'ZIP-Code Accurate', body: 'Every price this roof cost calculator returns is adjusted for your local labor rates and cost of living, not a flat national guess.' },
      { title: 'Instant Results', body: 'Answer a few quick questions about your roof and get your estimate in under 60 seconds — no waiting for a callback from a contractor.' },
      { title: '7 Service Types Covered', body: 'From full shingle replacement to metal, tile, flat roofing, repair, inspection, and gutters, this calculator covers the full range of roofing work.' },
      { title: '100% Free, No Signup', body: 'Use the roof cost calculator as many times as you want. No account, no credit card, and no obligation to hire anyone.' },
    ],
    faqs: [
      { q: 'Is this roof cost calculator really free?', a: 'Yes. Our roof cost calculator is completely free to use, with no signup, no account, and no hidden fees. You can run as many estimates as you need.' },
      { q: 'How accurate is the roof cost calculator?', a: 'The calculator uses real material and labor pricing data with state-by-state cost-of-living adjustments, so your estimate reflects typical local pricing. Final prices from an actual roofing contractor can vary based on the specific condition of your roof and other in-person factors, so treat the result as a reliable starting range rather than a binding quote.' },
      { q: 'What information do I need to use the roof cost calculator?', a: 'Just your ZIP code, the type of roofing work you need, and a few basic details about your roof (like square footage, pitch, and story count). No email or phone number is required to see your price range.' },
      { q: 'Does the roof cost calculator work for repairs and inspections too?', a: 'Yes. In addition to full roof replacement (shingle, metal, tile, and flat), the calculator includes roof repair, roof inspection, and gutter installation.' },
      { q: 'Can I embed this roof cost calculator on my own website?', a: "Yes — roofing companies can embed a white-labeled version of this calculator on their own site to capture leads with accurate, localized estimates. Visit our for-companies page for details." },
    ],
    title: 'Roof Cost Calculator - Free Instant Estimate (2026)',
    description: 'Free roof cost calculator with ZIP-code accurate pricing. Instantly estimate shingle, metal, tile, and flat roof replacement, repair, inspection, and gutters. No signup required.',
  }, assets));
  count++;

  writeFile('roofing-cost-estimator', renderCalculatorOrEstimatorPage({
    slug: 'roofing-cost-estimator',
    heading: 'Roof Cost Estimator',
    heroCopy: "Get a free roof cost estimator for shingle, metal, tile, and flat roof replacement, plus repair, inspection, and gutters — enter your ZIP code and roof details to see a real price range in under a minute. This standalone estimator works the same whether you're comparing contractor quotes or budgeting ahead, with no signup and no obligation.",
    whyPoints: [
      { title: 'Real Market Pricing', body: 'This roof cost estimator pulls from actual material and labor pricing data, not a generic industry average.' },
      { title: 'Covers Every Roof Type', body: 'Estimate shingle, metal, tile, and flat roof replacement, plus repair, inspection, and gutter installation.' },
      { title: 'No Waiting on Quotes', body: "Skip the back-and-forth with roofing contractors — get your price estimate the moment you finish answering a few questions." },
      { title: 'Always Free', body: "There's no cost to use this estimator, no account required, and no limit on how many times you can run it." },
    ],
    faqs: [
      { q: 'What is a roof cost estimator?', a: 'A roof cost estimator is a tool that calculates an expected price range for roofing work based on inputs like your location, roof size, pitch, and material — instead of requiring an in-person quote.' },
      { q: 'How is a roof cost estimator different from a fixed price?', a: 'An estimator gives you a realistic price range based on typical material and labor rates in your area. The exact price a roofing contractor charges can vary based on the specific condition of your roof, decking, and their own pricing.' },
      { q: 'Can I use this roof cost estimator for a repair instead of a full replacement?', a: 'Yes — select Roof Repair as your service type and describe the damage size to get an estimate, or select Roof Inspection if you just need an assessment.' },
      { q: 'Is my information saved when I use the estimator?', a: "No. Your estimate is calculated instantly and isn't stored unless you choose to submit your contact information at the end." },
      { q: 'How often should I re-check my roof cost estimate?', a: "Material and labor prices can shift year to year, so it's worth re-running your estimate before budgeting for a project, especially if your last estimate is more than a few months old." },
    ],
    title: 'Roof Cost Estimator - Free Instant Estimate (2026)',
    description: 'Free roof cost estimator with ZIP-code accurate pricing. Instantly estimate shingle, metal, tile, and flat roof replacement, repair, inspection, and gutters. No signup required.',
  }, assets));
  count++;

  console.log(`✓ prerender — ${count} pages generated (${posts.length} posts, ${CATEGORIES.length} categories, ${services.length} services, ${states.length} states, ${cities.length} cities, 2 keyword pages, 1 methodology page)`);
}

main();
