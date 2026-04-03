import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import RoofingCalculator from './components/calculator/RoofingCalculator';
import ResultsScreen from './components/calculator/ResultsScreen';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import SEOContent from './components/ui/SEOContent';
import BlogIndex from './components/blog/BlogIndex';
import BlogCategory from './components/blog/BlogCategory';
import BlogPost from './components/blog/BlogPost';
import CompanyLanding from './components/pages/CompanyLanding';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import EmbedWrapper from './components/EmbedWrapper';
import './App.css';

const pathname = window.location.pathname.replace(/\/$/, '') || '/';
const searchParams = new URLSearchParams(window.location.search);

const isEmbed        = pathname.startsWith('/embed');
const isResults      = pathname === '/results';
const isBlog         = pathname === '/blog' || pathname.startsWith('/blog/');
const isForCompanies = pathname === '/for-companies';
const isAbout        = pathname === '/about';
const isContact      = pathname === '/contact';
const isPrivacy      = pathname === '/privacy-policy';
const isTerms        = pathname === '/terms-of-service';

const embedCompanyId = isEmbed ? searchParams.get('company') : null;

function ResultsPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    try {
      const hash = window.location.hash.slice(1);
      if (hash) setData(JSON.parse(decodeURIComponent(escape(atob(hash)))));
    } catch {}
  }, []);

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      Report not found. <a href="/" style={{ marginLeft: 8, color: '#ea580c' }}>Start a new estimate →</a>
    </div>
  );

  return (
    <div className="app">
      <Header />
      <main>
        <ResultsScreen
          result={data.r}
          serviceDetails={data.d}
          companyConfig={null}
          embedded={false}
          onReset={() => { window.location.href = '/'; }}
        />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  if (isEmbed) return (
    <HelmetProvider>
      <EmbedWrapper companyId={embedCompanyId} />
    </HelmetProvider>
  );

  if (isResults) return <HelmetProvider><ResultsPage /></HelmetProvider>;

  if (isBlog) {
    const blogPath = pathname.replace('/blog', '') || '/';
    let blogContent;
    if (blogPath === '/' || blogPath === '') blogContent = <BlogIndex />;
    else if (blogPath.startsWith('/category/')) blogContent = <BlogCategory category={blogPath.replace('/category/', '')} />;
    else blogContent = <BlogPost slug={blogPath.replace('/', '')} />;
    return <HelmetProvider><div className="app"><Header /><main>{blogContent}</main><Footer /></div></HelmetProvider>;
  }
  if (isForCompanies) return <HelmetProvider><CompanyLanding /></HelmetProvider>;
  if (isAbout)        return <HelmetProvider><div className="app"><Header /><main><About /></main><Footer /></div></HelmetProvider>;
  if (isContact)      return <HelmetProvider><div className="app"><Header /><main><Contact /></main><Footer /></div></HelmetProvider>;
  if (isPrivacy)      return <HelmetProvider><div className="app"><Header /><main><PrivacyPolicy /></main><Footer /></div></HelmetProvider>;
  if (isTerms)        return <HelmetProvider><div className="app"><Header /><main><TermsOfService /></main><Footer /></div></HelmetProvider>;

  // Home — public calculator
  return (
    <HelmetProvider>
      <div className="app">
        <Header />
        <main>
          <RoofingCalculator />
          <SEOContent />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
