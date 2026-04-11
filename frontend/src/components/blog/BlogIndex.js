import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign, Layers, Wrench, RefreshCw, Shield, BookOpen, ArrowRight } from 'lucide-react';
import { getAllPosts, getCategories } from '../../data/blogPosts';
import { url } from '../../utils/routes';

const CATEGORY_LABELS = {
  'roofing-costs':    { label: 'Roofing Costs',    Icon: DollarSign },
  'roof-materials':   { label: 'Roof Materials',   Icon: Layers     },
  'roof-repair':      { label: 'Roof Repair',      Icon: Wrench     },
  'roof-replacement': { label: 'Roof Replacement', Icon: RefreshCw  },
  'roofing-insurance':{ label: 'Roofing Insurance',Icon: Shield     },
  'roofing-basics':   { label: 'Roofing Basics',   Icon: BookOpen   },
};

function PostCard({ post, featured = false }) {
  const cat = CATEGORY_LABELS[post.category] || { label: post.category, Icon: BookOpen };
  const CatIcon = cat.Icon;
  return (
    <a href={url(`/blog/${post.slug}`)} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'white', borderRadius: 14, border: '1px solid #e2e8f0',
        padding: featured ? '28px 32px' : '22px 26px',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'pointer', height: '100%',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, padding: '3px 9px 3px 7px' }}>
            <CatIcon size={11} color="#ea580c" strokeWidth={2.5} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.label}</span>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>{post.readTime}</span>
        </div>
        <h2 style={{ fontSize: featured ? 22 : 17, fontWeight: 800, color: '#0f172a', lineHeight: 1.35, marginBottom: 10 }}>{post.title}</h2>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, margin: '0 0 14px' }}>{post.metaDescription}</p>
        <span style={{ fontSize: 13, color: '#ea580c', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Read article
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </a>
  );
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const categories = getCategories();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <Helmet>
        <title>Roofing Blog 2026 — Cost Guides, Tips & Advice | RoofCalc</title>
        <meta name="description" content="Expert roofing guides: cost estimates, material comparisons, repair tips, insurance claims, and contractor advice. Free resources for homeowners." />
        <link rel="canonical" href="https://eliaszoleta.github.io/roof-cost-estimate/blog" />
      </Helmet>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Roofing Resource Center</h1>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 520, margin: '0 auto' }}>Cost guides, material comparisons, repair tips, and contractor advice for homeowners.</p>
          </div>

          {/* Featured post */}
          {featured && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Featured</div>
              <PostCard post={featured} featured />
            </div>
          )}

          {/* Categories */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Browse by Category</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {categories.map(cat => {
                const info = CATEGORY_LABELS[cat] || { label: cat, Icon: BookOpen };
                const CatIcon = info.Icon;
                return (
                  <a key={cat} href={url(`/blog/category/${cat}`)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 24, background: 'white', border: '1.5px solid #e2e8f0', textDecoration: 'none', fontSize: 13.5, fontWeight: 600, color: '#374151', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ea580c'; e.currentTarget.style.color = '#ea580c'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}
                  >
                    <CatIcon size={14} strokeWidth={2} style={{ flexShrink: 0 }} /> {info.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* All posts grid */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>All Articles</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {rest.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </div>
      </div>
    </>
  );
}
