import { clientCalculate } from './calculate';

const API_URL = process.env.REACT_APP_API_URL || '';

async function apiFetch(path, options = {}) {
  const url = API_URL ? `${API_URL}${path}` : path;
  const { headers: optHeaders, ...restOptions } = options;
  const res = await fetch(url, {
    ...restOptions,
    headers: { 'Content-Type': 'application/json', ...(optHeaders || {}) },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server returned an invalid response (${res.status})`);
  }
  if (!res.ok || !data.success) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function postCalculate(payload) {
  // No backend configured — run client-side
  if (!API_URL) {
    return clientCalculate(payload);
  }
  // Backend configured — try Railway, fall back to client-side if unavailable
  try {
    return await apiFetch('/api/calculate', { method: 'POST', body: JSON.stringify(payload) });
  } catch (err) {
    console.warn('API unreachable, falling back to client-side calculator:', err.message);
    return clientCalculate(payload);
  }
}

export async function getCompanyPublic(companyId) {
  // No backend: read roofer's saved settings from localStorage (demo / same-browser preview)
  if (!API_URL) {
    try {
      const branding      = JSON.parse(localStorage.getItem('rc_branding'))       || {};
      const questionConfig= JSON.parse(localStorage.getItem('rc_question_config'))|| {};
      const enabledServices = JSON.parse(localStorage.getItem('rc_services'))     || null;
      return {
        success: true,
        data: {
          companyName:    branding.companyName  || null,
          primaryColor:   branding.primaryColor || '#ea580c',
          logoUrl:        branding.logoUrl      || null,
          ctaPhone:       branding.phone        || null,
          ctaButtonText:  branding.ctaText      || 'Get a Free Quote',
          ctaButtonUrl:   branding.ctaUrl       || null,
          questionConfig,
          enabledServices,
        },
      };
    } catch { return { success: true, data: null }; }
  }
  return apiFetch(`/api/company/${companyId}/public`);
}

export async function getCompanyConfig(token, companyId) {
  return apiFetch(`/api/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function putCompanyConfig(token, companyId, config) {
  return apiFetch(`/api/company/${companyId}`, {
    method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(config),
  });
}

export async function patchCompanyServices(token, companyId, services) {
  return apiFetch(`/api/company/${companyId}/services`, {
    method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ services }),
  });
}

export async function getSubscriptionStatus(token) {
  return apiFetch('/api/subscription/status', { headers: { Authorization: `Bearer ${token}` } });
}

export async function postCheckout(token) {
  return apiFetch('/api/subscription/checkout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
}

export async function postPortal(token) {
  return apiFetch('/api/subscription/portal', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
}

export async function verifyCheckout(token, sessionId) {
  return apiFetch('/api/subscription/verify-checkout', {
    method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ sessionId }),
  });
}

export async function getCompanyLeads(token) {
  return apiFetch('/api/leads/company', { headers: { Authorization: `Bearer ${token}` } });
}

export async function patchQuestionConfig(token, companyId, questionConfig, enabledServices) {
  if (!API_URL) {
    localStorage.setItem('rc_question_config', JSON.stringify(questionConfig));
    if (enabledServices !== undefined) localStorage.setItem('rc_services', JSON.stringify(enabledServices));
    return { success: true };
  }
  return apiFetch(`/api/company/${companyId}/question-config`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ questionConfig, enabledServices }),
  });
}

export async function patchLead(token, leadId, updates) {
  return apiFetch(`/api/leads/company/${leadId}`, {
    method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(updates),
  });
}

// WebsiteSubscription.js's "Get a Done-For-You Website" application form --
// triggers an internal notification email instead of relying on a
// third-party form service whose destination inbox isn't controlled from
// this codebase.
export async function postWebsiteRequest(payload) {
  return apiFetch('/api/website-request', { method: 'POST', body: JSON.stringify(payload) });
}

// AdminWebsiteRequests.js -- "Get a Website" applications, same adminKey
// convention (x-admin-key header) as the backend route gate.
export async function getAdminWebsiteRequests(adminKey) {
  return apiFetch('/api/admin/website-requests', { headers: { 'x-admin-key': adminKey } });
}

// Manual add (e.g. a client who reached out outside the public apply form)
// -- deliberately skips both the internal "new application" notification
// and the applicant's own "we got your request" confirmation email.
export async function createAdminWebsiteRequest(adminKey, payload) {
  return apiFetch('/api/admin/website-requests', {
    method: 'POST', headers: { 'x-admin-key': adminKey }, body: JSON.stringify(payload),
  });
}

export async function patchAdminWebsiteRequest(adminKey, id, updates) {
  return apiFetch(`/api/admin/website-requests/${id}`, {
    method: 'PATCH', headers: { 'x-admin-key': adminKey }, body: JSON.stringify(updates),
  });
}

export async function cancelAdminWebsiteSubscription(adminKey, id) {
  return apiFetch(`/api/admin/website-requests/${id}/cancel-subscription`, {
    method: 'POST', headers: { 'x-admin-key': adminKey }, body: JSON.stringify({ confirm: true }),
  });
}

// Permanent, immediate delete -- cancels their Stripe subscription (if any)
// and removes the request row. No undo.
export async function deleteAdminWebsiteRequestForever(adminKey, id) {
  return apiFetch(`/api/admin/website-requests/${id}`, {
    method: 'DELETE', headers: { 'x-admin-key': adminKey }, body: JSON.stringify({ confirm: true }),
  });
}

// WebsiteApproval.js -- public, token-gated (no adminKey/login; the random
// token in the URL is the auth). Backs the prospect-facing approve-and-pay
// flow for a "Get a Website" application.
export async function getWebsiteRequestByToken(token) {
  return apiFetch(`/api/website-request/by-token/${token}`);
}

export async function postWebsiteRequestCheckout(token) {
  return apiFetch(`/api/website-request/by-token/${token}/checkout`, { method: 'POST' });
}

export async function postWebsiteRequestVerifySetup(token, sessionId) {
  return apiFetch(`/api/website-request/by-token/${token}/verify-setup`, {
    method: 'POST', body: JSON.stringify({ sessionId }),
  });
}
