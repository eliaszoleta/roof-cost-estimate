import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthPage from './AuthPage';
import RooferDashboard from './RooferDashboard';

function loadSession() {
  try { return JSON.parse(localStorage.getItem('rc_session')) || null; } catch { return null; }
}

export default function CompanyPortal() {
  const [session, setSession] = useState(loadSession);

  return (
    <>
      <Helmet>
        <title>Contractor Dashboard | RoofCalc</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {session
        ? <RooferDashboard session={session} onLogout={() => setSession(null)} />
        : <AuthPage onAuth={s => setSession(s)} />
      }
    </>
  );
}
