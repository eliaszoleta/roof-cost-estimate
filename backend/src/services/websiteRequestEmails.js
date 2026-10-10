// Standalone email service for the website_requests ("Get a Website")
// flow -- this repo has no broader transactional-email service file to
// extend (unlike cleanestimator.com's services/email.js, which this is
// ported from), so this file is self-contained: its own Resend wiring, its
// own small formatting helpers, nothing shared with the rest of the app.
const axios = require('axios');

const RESEND_API_BASE = 'https://api.resend.com';

function fmtOrDefault(v, fallback) {
  return v && String(v).trim() ? v : fallback;
}

// Normalizes any phone string to (XXX) XXX-XXXX for display in an email.
// Only reformats a clean 10-digit US number (or 11 with a leading 1);
// anything else is left exactly as stored rather than risking corrupting it.
function fmtPhone(value) {
  if (!value) return value;
  let digits = String(value).replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (digits.length !== 10) return value;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Appended to notification subject lines so each one is unique -- otherwise
// Gmail (and most other clients) groups emails with matching subjects into
// one conversation thread.
function fmtSubjectTimestamp() {
  return new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' });
}

function fmtMoney(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function labeledRows(lines) {
  return lines.filter(Boolean).map(l => {
    const idx = l.indexOf(': ');
    const label = idx === -1 ? l : l.slice(0, idx);
    const value = idx === -1 ? '' : l.slice(idx + 2);
    return `
    <tr>
      <td style="padding:5px 0;color:#666666;font-size:13.5px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:5px 0 5px 14px;text-align:left;font-size:13.5px;color:#111111;font-weight:600;">${value}</td>
    </tr>`;
  }).join('');
}

// Always returns every domain-related field (never omits one just because
// it's blank) -- which of domain1/2/3 vs. currentWebsite applies depends on
// hasDomain, same branching the form itself uses, not a case of hiding data.
function buildWebsiteRequestDomainLines({ hasDomain, currentWebsite, domain1, domain2, domain3, facebookPage }) {
  const lines = hasDomain
    ? [
        'Already has a domain: Yes',
        `Current domain: ${fmtOrDefault(currentWebsite, 'Not provided')}`,
      ]
    : [
        'Already has a domain: No',
        `1st choice: ${fmtOrDefault(domain1, 'Not provided')}`,
        `2nd choice: ${fmtOrDefault(domain2, 'Not provided')}`,
        `3rd choice: ${fmtOrDefault(domain3, 'Not provided')}`,
      ];
  lines.push(`Facebook page: ${fmtOrDefault(facebookPage, 'None')}`);
  return lines;
}

function buildWebsiteRequestText(args) {
  const { name, business, email, phone, servicesOffered, otherServices, businessAddress, serviceAreas, message } = args;
  const domainLines = buildWebsiteRequestDomainLines(args);

  const lines = [
    'New website application!',
    '',
    `${name} (${business}) just applied for a Done-For-You roofing website.`,
    '',
    'Contact info:',
    `  Email: ${email}`,
    `  Phone: ${fmtOrDefault(phone && fmtPhone(phone), 'Not provided')}`,
    '',
    'Business details:',
    `  Services offered: ${fmtOrDefault(servicesOffered, 'Not specified')}`,
    `  Other services: ${fmtOrDefault(otherServices, 'None')}`,
    `  Business address: ${fmtOrDefault(businessAddress, 'Not provided')}`,
    `  Service areas: ${fmtOrDefault(serviceAreas, 'Not provided')}`,
    '',
    'Domain:',
    ...domainLines.map(l => `  ${l}`),
    '',
    'Message:',
    `  ${fmtOrDefault(message, 'No additional message')}`,
    '',
    'Reply to this email to reach them directly.',
    '',
    'RoofingCal - roofingcal.com',
  ];

  return lines.join('\n');
}

function buildWebsiteRequestHtml(args) {
  const { name, business, email, phone, servicesOffered, otherServices, businessAddress, serviceAreas, message } = args;
  const domainLines = buildWebsiteRequestDomainLines(args);

  const contactRows = labeledRows([
    `Email: ${email}`,
    `Phone: ${fmtOrDefault(phone && fmtPhone(phone), 'Not provided')}`,
  ]);
  const businessRows = labeledRows([
    `Services offered: ${fmtOrDefault(servicesOffered, 'Not specified')}`,
    `Other services: ${fmtOrDefault(otherServices, 'None')}`,
    `Business address: ${fmtOrDefault(businessAddress, 'Not provided')}`,
    `Service areas: ${fmtOrDefault(serviceAreas, 'Not provided')}`,
  ]);
  const domainRows = labeledRows(domainLines);

  return `
<div style="max-width:520px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#111111;">
  <p style="font-size:16px;font-weight:700;margin:0 0 16px;">New website application!</p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
    <strong>${name}</strong> (${business}) just applied for a Done-For-You roofing website.
  </p>

  <p style="font-size:13px;color:#666666;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 6px;">Contact info</p>
  <table style="border-collapse:collapse;border-top:1px solid #e0e0e0;margin:0 0 20px;">${contactRows}</table>

  <p style="font-size:13px;color:#666666;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 6px;">Business details</p>
  <table style="border-collapse:collapse;border-top:1px solid #e0e0e0;margin:0 0 20px;">${businessRows}</table>

  <p style="font-size:13px;color:#666666;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 6px;">Domain</p>
  <table style="border-collapse:collapse;border-top:1px solid #e0e0e0;margin:0 0 20px;">${domainRows}</table>

  <p style="font-size:13px;color:#666666;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 6px;">Message</p>
  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;white-space:pre-wrap;">${fmtOrDefault(message, 'No additional message')}</p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
    Reply to this email to reach them directly.
  </p>

  <p style="font-size:12px;color:#999999;line-height:1.6;margin:28px 0 0;border-top:1px solid #e0e0e0;padding-top:16px;">
    RoofingCal · <a href="https://roofingcal.com" style="color:#999999;">roofingcal.com</a>
  </p>
</div>`;
}

async function sendWebsiteRequestNotificationEmail(args) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL, WEBSITE_REQUEST_NOTIFY_EMAIL } = process.env;
  if (!RESEND_API_KEY) {
    console.warn('sendWebsiteRequestNotificationEmail skipped: Resend not configured (RESEND_API_KEY)');
    return false;
  }

  const fromAddress = RESEND_FROM_EMAIL || 'info@roofingcal.com';
  const notifyEmail = WEBSITE_REQUEST_NOTIFY_EMAIL || 'eliaszoleta87@gmail.com';

  try {
    await axios.post(
      `${RESEND_API_BASE}/emails`,
      {
        from: `RoofingCal <${fromAddress}>`,
        to: [notifyEmail],
        reply_to: args.email || undefined,
        subject: `New website application — ${args.business || args.name} — ${fmtSubjectTimestamp()}`,
        html: buildWebsiteRequestHtml(args),
        text: buildWebsiteRequestText(args),
      },
      { headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return true;
  } catch (err) {
    console.warn('sendWebsiteRequestNotificationEmail failed:', err.response?.data ? JSON.stringify(err.response.data) : err.message);
    return false;
  }
}

function buildWebsiteRequestReceivedText({ name, business }) {
  return [
    `Hi ${name},`,
    '',
    `Got your request for a website for ${business}. We're building your sample now and will send a link to review it in a few days.`,
    '',
    'No action needed from you right now -- just reply to this email anytime if you have a question.',
    '',
    'RoofingCal',
  ].join('\n');
}

function buildWebsiteRequestReceivedHtml({ name, business }) {
  return `
<div style="max-width:520px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#111111;">
  <p style="font-size:14px;margin:0 0 20px;">Hi ${name},</p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
    Got your request for a website for ${business}. We're building your sample now and will send a link to review it in a few days.
  </p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
    No action needed from you right now -- just reply to this email anytime if you have a question.
  </p>

  <p style="font-size:13px;color:#555555;line-height:1.6;margin:28px 0 0;">
    RoofingCal
  </p>
</div>`;
}

// Sent to the applicant right after they submit the public "Get a Website"
// form. Deliberately NOT sent from the admin's own manual-add path -- a
// client an admin enters by hand wasn't necessarily told "a sample is
// coming in a few days," so that promise shouldn't go out on their behalf.
async function sendWebsiteRequestReceivedEmail({ to, name, business }) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY) {
    console.warn('sendWebsiteRequestReceivedEmail skipped: Resend not configured (RESEND_API_KEY)');
    return false;
  }
  if (!to) {
    console.warn('sendWebsiteRequestReceivedEmail skipped: no recipient email');
    return false;
  }

  const fromAddress = RESEND_FROM_EMAIL || 'info@roofingcal.com';

  try {
    await axios.post(
      `${RESEND_API_BASE}/emails`,
      {
        from: `RoofingCal <${fromAddress}>`,
        to: [to],
        subject: `We got your request, ${business}`,
        html: buildWebsiteRequestReceivedHtml({ name, business }),
        text: buildWebsiteRequestReceivedText({ name, business }),
      },
      { headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return true;
  } catch (err) {
    console.warn('sendWebsiteRequestReceivedEmail failed:', err.response?.data ? JSON.stringify(err.response.data) : err.message);
    return false;
  }
}

// ─── Website-request approval flow emails ──────────────────────────────────
// Sent to the prospect themselves (not the internal notification above,
// which goes to WEBSITE_REQUEST_NOTIFY_EMAIL) as their sample moves through
// routes/websiteRequest.js and routes/websiteRequestAdmin.js's approval flow.

function buildWebsiteSampleReadyText({ name, business, sampleUrl, approvalUrl }) {
  return [
    `Hi ${name},`,
    '',
    `Your free roofing website for ${business} is ready to review.`,
    '',
    `Take a look: ${sampleUrl}`,
    '',
    "Like what you see? Approve it to get started — just $5 one-time to lock in your build, then your first 2 months are completely free. After that it's a flat $249/month, cancel anytime.",
    '',
    `Review & approve: ${approvalUrl}`,
    '',
    "No obligation — if it's not for you, just ignore this and nothing happens.",
    '',
    'RoofingCal - roofingcal.com',
  ].join('\n');
}

function buildWebsiteSampleReadyHtml({ name, business, sampleUrl, approvalUrl }) {
  return `
<div style="max-width:520px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#111111;">
  <p style="font-size:14px;margin:0 0 20px;">Hi ${name},</p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
    Your free roofing website for <strong>${business}</strong> is ready to review.
  </p>

  <p style="margin:0 0 20px;">
    <a href="${sampleUrl}" style="display:inline-block;background-color:#0f172a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:6px;">View your website →</a>
  </p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
    Like what you see? Approve it to get started — just $5 one-time to lock in your build, then your first 2 months are completely free. After that it's a flat $249/month, cancel anytime.
  </p>

  <p style="margin:0 0 20px;">
    <a href="${approvalUrl}" style="display:inline-block;background-color:#ea580c;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:6px;">Review &amp; approve →</a>
  </p>

  <p style="font-size:13px;color:#666666;line-height:1.6;margin:0 0 20px;">
    No obligation — if it's not for you, just ignore this and nothing happens.
  </p>

  <p style="font-size:12px;color:#999999;line-height:1.6;margin:28px 0 0;border-top:1px solid #e0e0e0;padding-top:16px;">
    RoofingCal · <a href="https://roofingcal.com" style="color:#999999;">roofingcal.com</a>
  </p>
</div>`;
}

// Sent by PATCH /api/admin/website-requests/:id when an admin attaches a
// sample link and the request moves to 'sample_ready'.
async function sendWebsiteSampleReadyEmail({ to, name, business, sampleUrl, approvalUrl }) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY) {
    console.warn('sendWebsiteSampleReadyEmail skipped: Resend not configured (RESEND_API_KEY)');
    return false;
  }
  if (!to) {
    console.warn('sendWebsiteSampleReadyEmail skipped: no recipient email');
    return false;
  }

  const fromAddress = RESEND_FROM_EMAIL || 'info@roofingcal.com';

  try {
    await axios.post(
      `${RESEND_API_BASE}/emails`,
      {
        from: `RoofingCal <${fromAddress}>`,
        to: [to],
        subject: `Your website for ${business} is ready`,
        html: buildWebsiteSampleReadyHtml({ name, business, sampleUrl, approvalUrl }),
        text: buildWebsiteSampleReadyText({ name, business, sampleUrl, approvalUrl }),
      },
      { headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return true;
  } catch (err) {
    console.warn('sendWebsiteSampleReadyEmail failed:', err.response?.data ? JSON.stringify(err.response.data) : err.message);
    return false;
  }
}

function buildWebsiteSubscriptionConfirmedText({ name, business, trialDays, monthlyPrice }) {
  return [
    `Hi ${name},`,
    '',
    `You're all set! Your roofing website for ${business} is approved and your subscription is active.`,
    '',
    `Your first ${trialDays} days are completely free. After that, you'll be billed ${fmtMoney(monthlyPrice)}/month flat — cancel anytime.`,
    '',
    "We'll be in touch shortly to finish setting up your live site and domain.",
    '',
    'RoofingCal - roofingcal.com',
  ].join('\n');
}

function buildWebsiteSubscriptionConfirmedHtml({ name, business, trialDays, monthlyPrice }) {
  return `
<div style="max-width:520px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#111111;">
  <p style="font-size:14px;margin:0 0 20px;">Hi ${name},</p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
    You're all set! Your roofing website for <strong>${business}</strong> is approved and your subscription is active.
  </p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
    Your first ${trialDays} days are completely free. After that, you'll be billed ${fmtMoney(monthlyPrice)}/month flat — cancel anytime.
  </p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
    We'll be in touch shortly to finish setting up your live site and domain.
  </p>

  <p style="font-size:12px;color:#999999;line-height:1.6;margin:28px 0 0;border-top:1px solid #e0e0e0;padding-top:16px;">
    RoofingCal · <a href="https://roofingcal.com" style="color:#999999;">roofingcal.com</a>
  </p>
</div>`;
}

// Sent once an admin links the client's $249/mo subscription in the admin
// panel, not when the $5 fee itself clears -- Stripe already sends its own
// receipt for that charge automatically.
async function sendWebsiteSubscriptionConfirmedEmail({ to, name, business, trialDays, monthlyPrice }) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY) {
    console.warn('sendWebsiteSubscriptionConfirmedEmail skipped: Resend not configured (RESEND_API_KEY)');
    return false;
  }
  if (!to) {
    console.warn('sendWebsiteSubscriptionConfirmedEmail skipped: no recipient email');
    return false;
  }

  const fromAddress = RESEND_FROM_EMAIL || 'info@roofingcal.com';

  try {
    await axios.post(
      `${RESEND_API_BASE}/emails`,
      {
        from: `RoofingCal <${fromAddress}>`,
        to: [to],
        subject: `You're all set, ${business}! Your roofing website is confirmed`,
        html: buildWebsiteSubscriptionConfirmedHtml({ name, business, trialDays, monthlyPrice }),
        text: buildWebsiteSubscriptionConfirmedText({ name, business, trialDays, monthlyPrice }),
      },
      { headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return true;
  } catch (err) {
    console.warn('sendWebsiteSubscriptionConfirmedEmail failed:', err.response?.data ? JSON.stringify(err.response.data) : err.message);
    return false;
  }
}

module.exports = {
  sendWebsiteRequestNotificationEmail,
  sendWebsiteRequestReceivedEmail,
  sendWebsiteSampleReadyEmail,
  sendWebsiteSubscriptionConfirmedEmail,
};
