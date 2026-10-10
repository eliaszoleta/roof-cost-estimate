const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { sendWebsiteSampleReadyEmail, sendWebsiteSubscriptionConfirmedEmail } = require('../services/websiteRequestEmails');

// ─── Website requests ("Get a Website" applications) ──────────────────────
// Standalone admin surface for the website_requests table only -- this repo
// has no broader admin dashboard for the roofing-calculator embed/company
// product (that one is fully self-serve via routes/subscription.js), so
// this file doesn't share anything with that flow. Gates every route with
// the same x-admin-key header convention described below.

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// Presentation-only values for the activation confirmation email below --
// the real trial length/price live in Stripe itself (the admin sets both
// when manually creating each client's subscription), these just need to
// match what's quoted on the pricing page and the $5 receipt
// (routes/websiteRequest.js).
const WEBSITE_TRIAL_DAYS = 60;
const WEBSITE_MONTHLY_PRICE = 249;

function getSupabase() {
  if (!SUPABASE_URL || !SERVICE_KEY()) return null;
  return createClient(SUPABASE_URL, SERVICE_KEY(), { auth: { persistSession: false } });
}

// Gates every route in this file. A header the frontend only ever forwards
// from whatever the admin types into the login form at runtime, never a
// REACT_APP_* env var -- those get baked into the public JS bundle at build
// time and are readable by anyone. Fails closed if the key isn't set at all.
function requireAdminKey(req, res, next) {
  const configured = process.env.ADMIN_API_KEY;
  if (!configured) return res.status(503).json({ success: false, error: 'Admin API not configured' });
  if (req.headers['x-admin-key'] !== configured) return res.status(401).json({ success: false, error: 'Unauthorized' });
  next();
}

router.use(requireAdminKey);

// GET /api/admin/website-requests
router.get('/', async (req, res) => {
  const sb = getSupabase();
  if (!sb) return res.status(503).json({ success: false, error: 'Supabase not configured' });

  try {
    const { data, error } = await sb.from('website_requests').select('*').order('created_at', { ascending: false }).limit(500);
    if (error) throw error;
    const rows = (data || []).map(row => ({
      ...row,
      approvalUrl: `${FRONTEND_URL}/website-approval/${row.approval_token}`,
    }));
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Admin website-requests list error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to load website requests' });
  }
});

// POST /api/admin/website-requests — lets an admin add a client directly
// (e.g. one who reached out outside the public apply form) instead of only
// ever reviewing requests that came in through it. Deliberately sends
// neither the internal "new application" notification nor the applicant's
// own "we got your request" confirmation -- that email promises a sample is
// coming "within a few days," which isn't a promise this route should make
// on an admin's behalf. The row lands as a normal 'submitted' request
// otherwise, so it moves through sample_ready / approved / active exactly
// like one from the public form from here on.
router.post('/', async (req, res) => {
  const sb = getSupabase();
  if (!sb) return res.status(503).json({ success: false, error: 'Supabase not configured' });

  const { name, business, email, phone, business_address: businessAddress } = req.body || {};
  if (!name || !business || !email) {
    return res.status(400).json({ success: false, error: 'Name, business, and email are required.' });
  }

  try {
    const { data, error } = await sb.from('website_requests').insert({
      name, business, email,
      phone: phone || null,
      business_address: businessAddress || null,
    }).select().single();
    if (error) throw error;

    res.json({ success: true, data: { ...data, approvalUrl: `${FRONTEND_URL}/website-approval/${data.approval_token}` } });
  } catch (err) {
    console.error('Admin create website-request error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to create website request' });
  }
});

// PATCH /api/admin/website-requests/:id — sets sample_url / status /
// admin_notes / stripe_subscription_id. Moving status to 'sample_ready'
// (either explicitly, or implicitly by attaching a sample_url to a request
// that's still 'submitted') emails the prospect their approval link.
//
// stripe_subscription_id is how an admin links a client's $249/mo trial
// subscription once they've created it by hand in the Stripe Dashboard (see
// routes/websiteRequest.js -- the automated checkout only ever collects the
// $5 setup fee, on purpose). Verified against Stripe itself before trusting
// it. Linking it is what emails the client their "2 months free, billed
// starting month 3" confirmation -- Stripe already sends its own receipt
// the moment the $5 fee clears, so this is deliberately the one and only
// point this second, different email goes out.
router.patch('/:id', async (req, res) => {
  const sb = getSupabase();
  if (!sb) return res.status(503).json({ success: false, error: 'Supabase not configured' });

  const { id } = req.params;
  const { sample_url, status, admin_notes, stripe_subscription_id } = req.body || {};
  const allowedStatuses = ['submitted', 'sample_ready', 'approved', 'active', 'declined', 'canceled'];
  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  try {
    const { data: existing, error: fetchErr } = await sb.from('website_requests').select('*').eq('id', id).maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!existing) return res.status(404).json({ success: false, error: 'Not found' });

    const updates = { updated_at: new Date().toISOString() };
    if (sample_url !== undefined) updates.sample_url = sample_url;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    let subscriptionLinked = false;
    if (stripe_subscription_id && !existing.stripe_subscription_id) {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({ success: false, error: 'Stripe is not configured' });
      }
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      let subscription;
      try {
        subscription = await stripe.subscriptions.retrieve(stripe_subscription_id.trim());
      } catch (err) {
        return res.status(400).json({ success: false, error: 'That subscription ID could not be found in Stripe.' });
      }
      if (existing.stripe_customer_id && subscription.customer !== existing.stripe_customer_id) {
        return res.status(400).json({ success: false, error: "That subscription belongs to a different customer than this request's — double-check the ID." });
      }
      updates.stripe_subscription_id = subscription.id;
      updates.subscription_started_at = new Date().toISOString();
      subscriptionLinked = true;
    }

    // Explicit status always wins; otherwise linking a subscription implies
    // 'active', and (failing that) attaching a sample link to a fresh
    // request implicitly marks it 'sample_ready'.
    if (status !== undefined) {
      updates.status = status;
    } else if (subscriptionLinked) {
      updates.status = 'active';
    } else if (existing.status === 'submitted' && (sample_url || existing.sample_url)) {
      updates.status = 'sample_ready';
    }

    const { data: updated, error: updateErr } = await sb.from('website_requests').update(updates).eq('id', id).select().single();
    if (updateErr) throw updateErr;

    const justBecameSampleReady = existing.status !== 'sample_ready' && updated.status === 'sample_ready';
    if (justBecameSampleReady && updated.sample_url) {
      sendWebsiteSampleReadyEmail({
        to: updated.email,
        name: updated.name,
        business: updated.business,
        sampleUrl: updated.sample_url,
        approvalUrl: `${FRONTEND_URL}/website-approval/${updated.approval_token}`,
      }).catch(err => console.error('sendWebsiteSampleReadyEmail failed:', err.message));
    }

    const justBecameActive = existing.status !== 'active' && updated.status === 'active' && updated.stripe_subscription_id;
    if (justBecameActive) {
      sendWebsiteSubscriptionConfirmedEmail({
        to: updated.email,
        name: updated.name,
        business: updated.business,
        trialDays: WEBSITE_TRIAL_DAYS,
        monthlyPrice: WEBSITE_MONTHLY_PRICE,
      }).catch(err => console.error('sendWebsiteSubscriptionConfirmedEmail failed:', err.message));
    }

    res.json({ success: true, data: { ...updated, approvalUrl: `${FRONTEND_URL}/website-approval/${updated.approval_token}` } });
  } catch (err) {
    console.error('Admin update website-request error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to update website request' });
  }
});

// POST /api/admin/website-requests/:id/cancel-subscription — cancels the
// client's Stripe subscription immediately and marks the request
// 'canceled'. Requires { confirm: true } so a GET/bookmark/retry never
// triggers this.
router.post('/:id/cancel-subscription', async (req, res) => {
  const sb = getSupabase();
  if (!sb) return res.status(503).json({ success: false, error: 'Supabase not configured' });
  if (req.body?.confirm !== true) {
    return res.status(400).json({ success: false, error: 'Refusing to cancel without { confirm: true } in the request body.' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ success: false, error: 'Stripe is not configured' });
  }

  const { id } = req.params;

  try {
    const { data: request, error: fetchErr } = await sb.from('website_requests').select('*').eq('id', id).maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!request) return res.status(404).json({ success: false, error: 'Not found' });
    if (request.status === 'canceled') return res.status(400).json({ success: false, error: 'Already canceled.' });
    if (!request.stripe_subscription_id) {
      return res.status(400).json({ success: false, error: 'This request has no active subscription to cancel.' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    try {
      await stripe.subscriptions.cancel(request.stripe_subscription_id);
    } catch (err) {
      // Already canceled on Stripe's own side -- treat as success rather
      // than blocking the admin from marking it canceled here too.
      if (err.code !== 'resource_missing') throw err;
    }

    const { data: updated, error: updateErr } = await sb
      .from('website_requests')
      .update({ status: 'canceled', canceled_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (updateErr) throw updateErr;

    res.json({ success: true, data: { ...updated, approvalUrl: `${FRONTEND_URL}/website-approval/${updated.approval_token}` } });
  } catch (err) {
    console.error('Admin cancel website-request subscription error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to cancel subscription' });
  }
});

// DELETE /api/admin/website-requests/:id — permanently deletes a website
// request. Cancels any still-active Stripe subscription first so no one
// keeps getting billed with no record left to trace it back to. Requires
// { confirm: true }. Immediate and irreversible.
router.delete('/:id', async (req, res) => {
  const sb = getSupabase();
  if (!sb) return res.status(503).json({ success: false, error: 'Supabase not configured' });
  if (req.body?.confirm !== true) {
    return res.status(400).json({ success: false, error: 'Refusing to delete without { confirm: true } in the request body.' });
  }

  const { id } = req.params;

  try {
    const { data: request, error: fetchErr } = await sb.from('website_requests').select('*').eq('id', id).maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!request) return res.status(404).json({ success: false, error: 'Not found' });

    if (request.stripe_subscription_id && request.status !== 'canceled' && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        await stripe.subscriptions.cancel(request.stripe_subscription_id);
      } catch (err) {
        if (err.code !== 'resource_missing') console.warn(`Admin delete website-request ${id}: Stripe cancel warning:`, err.message);
      }
    }

    const { error: deleteErr } = await sb.from('website_requests').delete().eq('id', id);
    if (deleteErr) throw deleteErr;

    res.json({ success: true });
  } catch (err) {
    console.error(`Admin delete website-request ${id} error:`, err.message);
    res.status(500).json({ success: false, error: 'Failed to delete website request' });
  }
});

module.exports = router;
