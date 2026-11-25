require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const calculateRouter = require('./routes/calculate');
const companyRouter = require('./routes/company');
const authRouter = require('./routes/auth');
const subscriptionRouter = require('./routes/subscription');
const leadsRouter = require('./routes/leads');
const websiteRequestRouter = require('./routes/websiteRequest');
const websiteRequestAdminRouter = require('./routes/websiteRequestAdmin');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// Public CORS — calculator widget is embedded on contractor sites
const publicCors = cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
});
app.use('/api/calculate', publicCors);
app.use('/api/company/:id/public', publicCors);
app.use('/api/leads', publicCors);

// Dashboard CORS — restricted to known origins
const dashboardOrigins = [
  'http://localhost:3000',
  'https://roofingcal.com',
  'https://www.roofingcal.com',
  /\.vercel\.app$/,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: dashboardOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting on calculate endpoint
app.use('/api/calculate', rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please wait a moment.' },
}));

// POST /api/company/check-email-exists — unauthenticated and paginates
// every Supabase auth user on each call, called once per failed login
// attempt (see AuthPage.js) -- rate-limited for the same reason /calculate is.
app.use('/api/company/check-email-exists', rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please wait a moment.' },
}));

// CRITICAL: Stripe webhook MUST be registered before express.json()
app.post(
  '/api/subscription/webhook',
  express.raw({ type: 'application/json' }),
  subscriptionRouter.webhookHandler
);
app.post(
  '/api/website-request/webhook',
  express.raw({ type: 'application/json' }),
  websiteRequestRouter.webhookHandler
);

// Body parsing — after webhook
app.use(express.json({ limit: '10kb' }));

// Auth routes
app.use('/api/auth', authRouter);

// Public routes
app.use('/api/calculate', calculateRouter);
app.use('/api/website-request', websiteRequestRouter);

// Admin routes (x-admin-key header auth handled inside the router)
app.use('/api/admin/website-requests', websiteRequestAdminRouter);

// Public leads API (API key auth handled inside router)
app.use('/api/leads', leadsRouter);

// requireAuth is applied per-route inside companyRouter, not blanket here --
// GET /:id/public and POST /check-email-exists must stay reachable without
// auth (the former is what the embedded widget calls, the latter is what
// AuthPage.js calls on a failed login, before any session exists). A
// standalone, duplicate /api/company/:id/public route used to live here
// too, which (since Express matches routes in registration order) silently
// shadowed company.js's own /public handler for any field added there after
// the duplicate was written. Removed; company.js is now the single source
// of truth for this path.
app.use('/api/company', companyRouter);
app.use('/api/subscription', requireAuth, subscriptionRouter);
app.use('/api/company-leads', requireAuth, leadsRouter);

// Health check
app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'RoofCalc API', version: '1.0.0' })
);

// DB connectivity check
app.get('/api/debug/db', async (req, res) => {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const result = {
    supabase_url_set: !!supabaseUrl,
    service_key_set: !!serviceKey,
    service_key_looks_valid: serviceKey ? serviceKey.startsWith('eyJ') : false,
  };
  if (supabaseUrl && serviceKey) {
    const sb = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    try {
      const { data, error } = await sb.from('roofing_company_configs').select('company_id').limit(3);
      if (error) { result.read = 'error'; result.read_error = error.message; }
      else { result.read = 'ok'; result.row_count = data.length; }
    } catch (e) { result.read = 'exception'; result.read_error = e.message; }
    const testId = '__debug_test__';
    try {
      const { error: we } = await sb.from('roofing_company_configs')
        .upsert(
          { company_id: testId, config: { test: true }, updated_at: new Date().toISOString() },
          { onConflict: 'company_id' }
        );
      if (we) { result.write = 'error'; result.write_error = we.message; }
      else {
        result.write = 'ok';
        await sb.from('roofing_company_configs').delete().eq('company_id', testId);
        result.cleanup = 'ok';
      }
    } catch (e) { result.write = 'exception'; result.write_error = e.message; }
  }
  res.json(result);
});

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`RoofCalc API running on port ${PORT}`);
  console.log(`Supabase: ${process.env.SUPABASE_URL ? 'configured' : 'not configured (file fallback active)'}`);
  console.log(`Stripe: ${process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured'}`);
});

module.exports = app;
