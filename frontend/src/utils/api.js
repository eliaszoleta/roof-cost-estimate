import { clientCalculate } from './calculate';

const API_URL = process.env.REACT_APP_API_URL || '';

async function apiFetch(path, options = {}) {
  const url = API_URL ? `${API_URL}${path}` : path;
  const { headers: optHeaders, ...restOptions } = options;
  const res = await fetch(url, {
    ...restOptions,
    headers: { 'Content-Type': 'application/json', ...(optHeaders || {}) },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function postCalculate(payload) {
  // If no backend configured, run calculation client-side
  if (!API_URL) {
    const result = clientCalculate(payload);
    // Save lead to localStorage if email provided
    if (payload.leadInfo?.email) {
      try {
        const leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
        leads.unshift({
          id: Date.now().toString(),
          name:  payload.leadInfo.name  || null,
          email: payload.leadInfo.email,
          phone: payload.leadInfo.phone || null,
          service_type: payload.serviceType,
          zip:   payload.zip   || null,
          state: payload.state || null,
          estimated_price_low:  result.data?.totalLow  || null,
          estimated_price_high: result.data?.totalHigh || null,
          service_details: payload.serviceDetails || {},
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('rc_leads', JSON.stringify(leads.slice(0, 1000)));
      } catch {}
    }
    return result;
  }
  return apiFetch('/api/calculate', { method: 'POST', body: JSON.stringify(payload) });
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
