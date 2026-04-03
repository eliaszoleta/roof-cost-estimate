import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getPostsByCategory } from '../../data/blogPosts';

const CATEGORY_META = {
  'roofing-costs':    { label: 'Roofing Costs',       emoji: '💰', desc: 'Understand what you should pay for any roofing project.' },
  'roof-materials':   { label: 'Roof Materials',       emoji: '🏗️', desc: 'Compare shingles, metal, tile, and more.' },
  'roof-repair':      { label: 'Roof Repair',          emoji: '🔧', desc: 'Fix leaks, damaged shingles, and extend your roof\'s life.' },
  'roof-replacement': { label: 'Roof Replacement',     emoji: '🏠', desc: 'Everything you need to know about replacing your roof.' },
  'roofing-insurance':{ label: 'Roofing Insurance',    emoji: '🛡️', desc: 'Navigate insurance claims and coverage for roof damage.' },
  'roofing-basics':   { label: 'Roofing Basics',       emoji: '📚', desc: 'Foundational knowledge every homeowner should have.' },
};

export default function BlogCategory({ category }) {
  const posts = getPostsByCategory(category);
  const meta = CATEGORY_META[category] || { label: category, emoji: '📄', desc: '' };

  return (
    <>
      <Helmet>
        <title>{meta.label} Guide 2026 | RoofCalc</title>
        <meta name="description" content={meta.desc} />
        <link rel="canonical" href={`https://eliaszoleta.github.io/roof-cost-estimate/blog/category/${category}`} />
      </Helmet>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/blog" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 28 }}>← All Articles</a>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{meta.emoji}</div>
            <h1 style={{ fontSize: 'clamp(24px,4vw,34px)', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{meta.label}</h1>
            <p style={{ fontSize: 16, color: '#64748b' }}>{meta.desc}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map(post => (
              <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, transition: 'box-shadow 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{post.title}</h2>
                    <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{post.metaDescription}</p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{post.readTime}</div>
                    <span style={{ fontSize: 13, color: '#ea580c', fontWeight: 600 }}>Read →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
