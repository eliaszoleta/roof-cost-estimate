import { useState, useEffect } from 'react';
import { getCompanyPublic } from '../utils/api';

export default function useCompanyConfig(companyId) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(!!companyId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) { setLoading(false); return; }
    getCompanyPublic(companyId)
      .then(res => setConfig(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [companyId]);

  return { config, loading, error };
}
