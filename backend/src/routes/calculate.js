const express = require('express');
const router = express.Router();
const { calculateRoofing } = require('../services/roofingCalculation');
const { STATE_PRICING_MULTIPLIERS, STATE_AVERAGE_ROOF_COST_PER_SQFT, STATE_NAMES } = require('../config/defaults');
const { getCompanyConfig } = require('../services/companyConfig');
const { saveLead } = require('./leads');

const VALID_SERVICE_TYPES = [
  'shingle_replacement', 'metal_roofing', 'flat_roof', 'tile_roofing',
  'roof_repair', 'roof_inspection', 'gutter_replacement', 'fascia_soffit',
];

// POST /api/calculate
router.post('/', async (req, res) => {
  const { serviceType, zip, state, serviceDetails, companyId, leadInfo } = req.body;

  if (!serviceType || !VALID_SERVICE_TYPES.includes(serviceType)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing serviceType' });
  }
  if (!zip && !state) {
    return res.status(400).json({ success: false, error: 'zip or state is required' });
  }

  try {
    let companyConfig = {};
    if (companyId) {
      try { companyConfig = (await getCompanyConfig(companyId)) || {}; } catch {}
    }

    const result = await calculateRoofing(
      { serviceType, zip: zip || null, state: state || null, serviceDetails: serviceDetails || {} },
      companyConfig
    );

    if (leadInfo && leadInfo.name && leadInfo.email) {
      try {
        await saveLead({
          companyId: companyId || null,
          name: leadInfo.name,
          email: leadInfo.email,
          phone: leadInfo.phone || null,
          serviceType,
          zip: zip || null,
          state: result.state,
          estimatedPriceLow: result.totalLow,
          estimatedPriceHigh: result.totalHigh,
          timeline: leadInfo.timeline || null,
          preferredContact: leadInfo.preferredContact || null,
          serviceDetails: serviceDetails || {},
          customAnswers: leadInfo.customAnswers || {},
        });
      } catch (leadErr) {
        console.warn('Lead save failed (non-critical):', leadErr.message);
      }
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Calculation error:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Calculation failed. Please try again.' });
  }
});

// GET /api/calculate/state-data
router.get('/state-data', (req, res) => {
  const data = Object.entries(STATE_PRICING_MULTIPLIERS).map(([abbr, mult]) => ({
    abbr,
    name: STATE_NAMES[abbr] || abbr,
    multiplier: mult,
    averageRoofCostPerSqft: STATE_AVERAGE_ROOF_COST_PER_SQFT[abbr] || null,
  }));
  res.json({ success: true, data });
});

module.exports = router;
