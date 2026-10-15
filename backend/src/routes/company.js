const express = require('express');
const router = express.Router();
const { DEFAULT_COMPANY_CONFIG } = require('../config/defaults');
const { computeSubscriptionStatus } = require('../services/subscriptionStatus');
const { getCompanyConfig, saveCompanyConfig } = require('../services/companyConfig');
const { requireAuth } = require('../middleware/auth');

// POST /api/company/check-email-exists — no auth. Supabase's own
// signInWithPassword deliberately returns the same "Invalid login
// credentials" error whether the email isn't registered or the password is
// wrong (anti-enumeration by design), but AuthPage.js wants to tell those
// two apart ("Account not found" vs "Wrong email or password") after a
// failed login, so it calls this once the sign-in attempt itself has
// already failed. Supabase-js has no admin.getUserByEmail, so this
// paginates listUsers.
router.post('/check-email-exists', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email) return res.json({ success: true, exists: false });
  try {
    const { createClient } = require('@supabase/supabase-js');
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return res.json({ success: true, exists: false });
    const sb = createClient(url, key, { auth: { persistSession: false } });

    let page = 1;
    let found = false;
    // eslint-disable-next-line no-constant-condition
    while (!found) {
      const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw error;
      if (data.users.some(u => (u.email || '').toLowerCase() === email)) { found = true; break; }
      if (data.users.length < 1000) break;
      page += 1;
    }
    res.json({ success: true, exists: found });
  } catch (err) {
    console.error('POST check-email-exists error:', err.message);
    // Fail closed to "exists" -- worst case the error message stays generic
    // ("wrong email or password") rather than wrongly claiming an account
    // that actually exists was "not found".
    res.json({ success: true, exists: true });
  }
});

// GET /api/company/:id
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) return res.status(403).json({ success: false, error: 'Forbidden' });

  try {
    let config = await getCompanyConfig(id);
    if (!config) {
      config = {
        ...DEFAULT_COMPANY_CONFIG,
        subscription: {
          ...DEFAULT_COMPANY_CONFIG.subscription,
          trialStartedAt: new Date().toISOString(),
        },
      };
      await saveCompanyConfig(id, config);
    } else if (!config.subscription?.trialStartedAt) {
      config.subscription = {
        ...DEFAULT_COMPANY_CONFIG.subscription,
        ...(config.subscription || {}),
        trialStartedAt: new Date().toISOString(),
      };
      await saveCompanyConfig(id, config);
    }
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, data: config });
  } catch (err) {
    console.error('GET company config error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to load configuration' });
  }
});

// PUT /api/company/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) return res.status(403).json({ success: false, error: 'Forbidden' });

  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid config object' });
  }

  try {
    const existing = (await getCompanyConfig(id)) || { ...DEFAULT_COMPANY_CONFIG };
    const merged = { ...existing, ...updates };
    // Never allow subscription to be overwritten from client
    merged.subscription = existing.subscription || DEFAULT_COMPANY_CONFIG.subscription;
    await saveCompanyConfig(id, merged);
    res.json({ success: true, data: merged });
  } catch (err) {
    console.error('PUT company config error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to save configuration' });
  }
});

// PATCH /api/company/:id/question-config
router.patch('/:id/question-config', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) return res.status(403).json({ success: false, error: 'Forbidden' });
  const { questionConfig, enabledServices } = req.body;
  try {
    const existing = (await getCompanyConfig(id)) || { ...DEFAULT_COMPANY_CONFIG };
    if (questionConfig  !== undefined) existing.questionConfig  = questionConfig;
    if (enabledServices !== undefined) existing.enabledServices = enabledServices;
    await saveCompanyConfig(id, existing);
    res.json({ success: true, data: { questionConfig: existing.questionConfig, enabledServices: existing.enabledServices } });
  } catch (err) {
    console.error('PATCH question-config error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to save question config' });
  }
});

// PATCH /api/company/:id/services
router.patch('/:id/services', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) return res.status(403).json({ success: false, error: 'Forbidden' });

  const { services } = req.body;
  if (!services || typeof services !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid services object' });
  }

  try {
    const existing = (await getCompanyConfig(id)) || { ...DEFAULT_COMPANY_CONFIG };
    const mergedServices = { ...(existing.services || {}), ...services };
    const updated = { ...existing, services: mergedServices };
    updated.subscription = existing.subscription || DEFAULT_COMPANY_CONFIG.subscription;
    await saveCompanyConfig(id, updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('PATCH services error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to save services' });
  }
});

// GET /api/company/:id/public (no auth, for widget)
router.get('/:id/public', async (req, res) => {
  try {
    const config = (await getCompanyConfig(req.params.id)) || DEFAULT_COMPANY_CONFIG;
    const sub = computeSubscriptionStatus(config);
    const {
      companyName, logo, primaryColor, accentColor, fontFamily,
      ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl,
      serviceStates, frameHeight, borderRadius, services,
    } = config;
    res.json({
      success: true,
      data: {
        companyName, logo, primaryColor, accentColor, fontFamily,
        ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl,
        serviceStates, frameHeight, borderRadius, services,
        paused: !sub.active,
        trialDaysLeft: sub.daysLeft,
      },
    });
  } catch {
    res.json({ success: true, data: DEFAULT_COMPANY_CONFIG });
  }
});

module.exports = router;
