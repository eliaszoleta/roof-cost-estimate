import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getPostBySlug, getRelatedPosts } from '../../data/blogPosts';
import { url } from '../../utils/routes';

const CATEGORY_LABELS = {
  'roofing-costs':'Roofing Costs','roof-materials':'Roof Materials',
  'roof-repair':'Roof Repair','roof-replacement':'Roof Replacement',
  'roofing-insurance':'Roofing Insurance','roofing-basics':'Roofing Basics',
};

function CostTable({ rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div style={{ overflowX: 'auto', margin: '20px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {rows[0].map((cell, i) => (
              <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 14px', color: '#475569', borderBottom: '1px solid #f1f5f9' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BlogPost({ slug }) {
  const post = getPostBySlug(slug);

  if (!post) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ color: '#0f172a' }}>Article not found</h2>
      <a href={url('/blog')} style={{ color: '#ea580c', fontWeight: 600 }}>← Back to blog</a>
    </div>
  );

  const related = getRelatedPosts(post);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedDate,
    author: { '@type': 'Organization', name: 'RoofCalc' },
    publisher: { '@type': 'Organization', name: 'RoofCalc', url: 'https://eliaszoleta.github.io/roof-cost-estimate' },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eliaszoleta.github.io/roof-cost-estimate' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://eliaszoleta.github.io/roof-cost-estimate/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://eliaszoleta.github.io/roof-cost-estimate/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{post.seoTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://eliaszoleta.github.io/roof-cost-estimate/blog/${post.slug}`} />
        <meta property="og:title" content={post.seoTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedDate} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seoTitle} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 24px 64px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: 6, fontSize: 13, color: '#94a3b8', marginBottom: 28, flexWrap: 'wrap' }}>
            <a href={url('/')} style={{ color: '#64748b', textDecoration: 'none' }}>Home</a>
            <span>›</span>
            <a href={url('/blog')} style={{ color: '#64748b', textDecoration: 'none' }}>Blog</a>
            <span>›</span>
            <a href={url(`/blog/category/${post.category}`)} style={{ color: '#64748b', textDecoration: 'none' }}>{CATEGORY_LABELS[post.category] || post.category}</a>
            <span>›</span>
            <span style={{ color: '#0f172a' }}>{post.title}</span>
          </div>

          {/* Header */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#fff7ed', padding: '4px 10px', borderRadius: 20 }}>
                {CATEGORY_LABELS[post.category] || post.category}
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{post.readTime}</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>· {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 14 }}>{post.title}</h1>
            <p style={{ fontSize: 15.5, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{post.metaDescription}</p>
          </div>

          {/* CTA banner */}
          <div style={{ background: 'linear-gradient(135deg, #ea580c, #dc2626)', borderRadius: 12, padding: '18px 24px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Get an instant estimate for your roof</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Free · No signup · ZIP-code accurate</div>
            </div>
            <a href={url('/')} style={{ background: 'white', color: '#ea580c', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
              Calculate Now →
            </a>
          </div>

          {/* Article body */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 24 }}>
            {post.sections.map((section, i) => (
              <div key={i} style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 12, lineHeight: 1.35 }}>{section.h2}</h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j} style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 14 }}>{p}</p>
                ))}
                {section.table && <CostTable rows={section.table} />}
              </div>
            ))}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Tags</div>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, padding: '4px 12px', fontSize: 12.5, color: '#64748b' }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '24px 28px', marginBottom: 32, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 6 }}>Ready to get an accurate estimate?</div>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Use our free calculator for a ZIP-code accurate roofing cost estimate in under 60 seconds.</p>
            <a href={url('/')} style={{ background: '#ea580c', color: 'white', padding: '12px 28px', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
              Get My Free Estimate →
            </a>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Related Articles</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {related.map(r => (
                  <a key={r.slug} href={url(`/blog/${r.slug}`)} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #e2e8f0', padding: '16px 18px', transition: 'box-shadow 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: 6 }}>{r.title}</div>
                      <span style={{ fontSize: 12.5, color: '#ea580c', fontWeight: 600 }}>Read →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
