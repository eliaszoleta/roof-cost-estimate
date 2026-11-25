import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../lib/supabase';
import AuthPage from './AuthPage';
import ResetPasswordPage from './ResetPasswordPage';
import RooferDashboard from './RooferDashboard';
import Header from '../ui/Header';
import Footer from '../ui/Footer';

export default function CompanyPortal() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  // Clicking a password-reset email link logs the visitor in with a real
  // (temporary) session -- Supabase fires PASSWORD_RECOVERY for exactly
  // this case, distinct from a normal sign-in. Without tracking it
  // separately, that session would satisfy the `!user` check below and drop
  // the visitor straight into the full dashboard instead of making them set
  // a new password first.
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    const timeout = setTimeout(() => setAuthLoading(false), 3000);
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    }).catch(() => { clearTimeout(timeout); setAuthLoading(false); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/company';
  };

  const helmet = (
    <Helmet>
      <title>Contractor Dashboard | RoofingCal</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );

  if (authLoading) {
    return (
      <>
        {helmet}
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
          <div style={{ color: 'white', fontSize: 16 }}>Loading…</div>
        </div>
      </>
    );
  }

  if (!user && !supabase) {
    return (
      <>
        {helmet}
        <div className="app">
          <Header />
          <main style={{ padding: 40, textAlign: 'center' }}>
            <h2>Authentication not configured</h2>
            <p style={{ color: '#64748b', marginTop: 8 }}>Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to enable the contractor login.</p>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (passwordRecovery) {
    return (
      <>
        {helmet}
        <ResetPasswordPage onDone={() => setPasswordRecovery(false)} />
      </>
    );
  }

  if (!user) {
    return (
      <>
        {helmet}
        <AuthPage onAuth={setUser} />
      </>
    );
  }

  return (
    <>
      {helmet}
      <RooferDashboard user={user} onLogout={handleLogout} />
    </>
  );
}
