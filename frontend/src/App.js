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
import CompanyPortal from './components/dashboard/CompanyPortal';
import PartnerWithUs from './components/pages/PartnerWithUs';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import ServicePage from './components/pages/ServicePage';
import StatePage from './components/pages/StatePage';
import CityPage from './components/pages/CityPage';
import CalculatorPage from './components/pages/CalculatorPage';
import EstimatorPage from './components/pages/EstimatorPage';
import MethodologyPage from './components/pages/MethodologyPage';
import ServiceCalculatorPage, { calculatorSlugFor } from './components/pages/ServiceCalculatorPage';
import { getAllServices } from './data/services';
import EmbedWrapper from './components/EmbedWrapper';
import { getPathname, url } from './utils/routes';
import './App.css';

const pathname = getPathname();
const searchParams = new URLSearchParams(window.location.search);

const isEmbed        = pathname.startsWith('/embed');
const isResults      = pathname === '/results';
const isBlog         = pathname === '/blog' || pathname.startsWith('/blog/');
const isForCompanies = pathname === '/for-companies';
const isCompany      = pathname === '/company' || pathname.startsWith('/company/');
const isAbout        = pathname === '/about';
const isContact      = pathname === '/contact';
const isPrivacy      = pathname === '/privacy-policy';
const isTerms        = pathname === '/terms-of-service';
const isPartnerWithUs = pathname === '/partner-with-us';
const isServicePage = pathname.startsWith('/roofing-services/');
const isCityPage = pathname.startsWith('/roof-cost/city/');
const isStatePage = pathname.startsWith('/roof-cost/') && !isCityPage;
const isCalculatorPage = pathname === '/roof-cost-calculator';
const isEstimatorPage = pathname === '/roof-cost-estimator';
const isMethodologyPage = pathname === '/how-we-calculate-prices';
const isServiceCalculatorPage = getAllServices().some(s => pathname === '/' + calculatorSlugFor(s));

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
      Report not found. <a href={url('/')} style={{ marginLeft: 8, color: '#ea580c' }}>Start a new estimate →</a>
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

  if (isPartnerWithUs) return <HelmetProvider><div className="app"><Header /><main><PartnerWithUs /></main><Footer /></div></HelmetProvider>;

  if (isBlog) {
    const blogPath = pathname.replace('/blog', '') || '/';
    let blogContent;
    if (blogPath === '/' || blogPath === '') blogContent = <BlogIndex />;
    else if (blogPath.startsWith('/category/')) blogContent = <BlogCategory category={blogPath.replace('/category/', '')} />;
    else blogContent = <BlogPost slug={blogPath.replace('/', '')} />;
    return <HelmetProvider><div className="app"><Header /><main>{blogContent}</main><Footer /></div></HelmetProvider>;
  }
  if (isForCompanies) return <HelmetProvider><CompanyLanding /></HelmetProvider>;
  if (isCompany)      return <HelmetProvider><CompanyPortal /></HelmetProvider>;
  if (isAbout)        return <HelmetProvider><div className="app"><Header /><main><About /></main><Footer /></div></HelmetProvider>;
  if (isContact)      return <HelmetProvider><div className="app"><Header /><main><Contact /></main><Footer /></div></HelmetProvider>;
  if (isPrivacy)      return <HelmetProvider><div className="app"><Header /><main><PrivacyPolicy /></main><Footer /></div></HelmetProvider>;
  if (isTerms)        return <HelmetProvider><div className="app"><Header /><main><TermsOfService /></main><Footer /></div></HelmetProvider>;
  if (isServicePage)  return <HelmetProvider><div className="app"><Header /><main><ServicePage slug={pathname.replace('/roofing-services/', '')} /></main><Footer /></div></HelmetProvider>;
  if (isCityPage)     return <HelmetProvider><div className="app"><Header /><main><CityPage slug={pathname.replace('/roof-cost/city/', '')} /></main><Footer /></div></HelmetProvider>;
  if (isStatePage)    return <HelmetProvider><div className="app"><Header /><main><StatePage slug={pathname.replace('/roof-cost/', '')} /></main><Footer /></div></HelmetProvider>;
  if (isCalculatorPage) return <HelmetProvider><div className="app"><Header /><main><CalculatorPage /></main><Footer /></div></HelmetProvider>;
  if (isEstimatorPage)  return <HelmetProvider><div className="app"><Header /><main><EstimatorPage /></main><Footer /></div></HelmetProvider>;
  if (isMethodologyPage) return <HelmetProvider><div className="app"><Header /><main><MethodologyPage /></main><Footer /></div></HelmetProvider>;
  if (isServiceCalculatorPage) return <HelmetProvider><div className="app"><Header /><main><ServiceCalculatorPage slug={pathname.slice(1)} /></main><Footer /></div></HelmetProvider>;

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
