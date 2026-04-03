import React, { useEffect, useState } from 'react';
import RoofingCalculator from './calculator/RoofingCalculator';
import { getCompanyPublic } from '../utils/api';

export default function EmbedWrapper({ companyId }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(!!companyId);

  useEffect(() => {
    if (!companyId) { setLoading(false); return; }
    getCompanyPublic(companyId)
      .then(res => setConfig(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 14 }}>Loading…</div>
  );

  return <RoofingCalculator companyConfig={config} embedded={true} />;
}
