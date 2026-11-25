import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Rocket } from 'lucide-react';
import { getAllStates } from '../../data/statePricing';
import { getPostsByCategory } from '../../data/blogPosts';
import { url } from '../../utils/routes';

const PRIMARY = '#ea580c';
const PRIMARY_DARK = '#c2410c';

export default function StartRoofingBusinessIndex() {
  const states = getAllStates();
  const posts = getPostsByCategory('starting-a-roofing-business');

  const title = 'How to Start a Roofing Business (2026): Costs, Licensing & State-by-State Guide | RoofingCal';
  const description = 'Everything you need to start a roofing business: LLC setup, licensing, insurance, pricing, equipment, and safety -- plus exact LLC filing fees for all 50 states.';

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roofingcal.com' },
      { '@type': 'ListItem', position: 2, name: 'Start a Roofing Business', item: 'https://roofingcal.com/start-a-roofing-business' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://roofingcal.com/start-a-roofing-business" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 24px 64px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>

          <div style={{ display: 'flex', gap: 6, fontSize: 13, color: '#94a3b8', marginBottom: 24, flexWrap: 'wrap' }}>
            <a href={url('/')} style={{ color: '#64748b', textDecoration: 'none' }}>Home</a>
            <span>›</span>
            <span style={{ color: '#0f172a' }}>Start a Roofing Business</span>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Rocket size={18} color={PRIMARY} />
              <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting Your Business</span>
            </div>
            <h1 style={{ fontSize: 'clamp(26px,4.5vw,36px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: 14 }}>How to Start a Roofing Business</h1>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7 }}>
              Everything you need to go from idea to your first install: business structure, licensing, insurance, equipment, pricing, OSHA safety, and getting your first customers — plus the LLC filing fee for every state.
            </p>
          </div>

          <div style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`, borderRadius: 12, padding: '18px 24px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Ready to get online?</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>$5 to start · 2 months free · then $249/mo</div>
            </div>
            <a href={url('/website-for-roofing-companies')} style={{ background: 'white', color: PRIMARY, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
              Get a Free Website →
            </a>
          </div>

          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>The Complete Starting-Out Guide</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {posts.map(post => (
                <a key={post.slug} href={url(`/blog/${post.slug}`)} style={{ display: 'block', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, textDecoration: 'none' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{post.readTime}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: 8 }}>{post.title}</div>
                  <span style={{ fontSize: 13, color: PRIMARY, fontWeight: 700 }}>Read guide →</span>
                </a>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Find Your State's LLC Filing Fee</h2>
            <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 18 }}>LLC filing fees, filing agencies, and state-specific notes for every state.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {states.map(s => (
                <a key={s.code} href={url(`/start-a-roofing-business/${s.slug}`)} style={{ fontSize: 12.5, color: '#64748b', textDecoration: 'none', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 12px' }}>
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '24px 28px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 6 }}>Not ready to build your own marketing yet?</div>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>RoofingCal's Partner Program gives one roofing company per city exclusive, guaranteed lead visibility — no website required to start.</p>
            <a href={url('/partner-with-us')} style={{ background: PRIMARY, color: 'white', padding: '12px 28px', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
              See If Your City Is Available →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
