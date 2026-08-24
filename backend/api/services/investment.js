/**
 * Investment Service — Stubs for BSE StarMF & SafeGold APIs
 *
 * These are realistic stubs that simulate the API responses.
 * Replace the stub sections (marked with TODO: LIVE API) with
 * actual API credentials and calls when BSE StarMF / SafeGold
 * business accounts are active.
 */

const crypto = require('crypto');

// Simulated market prices (in a real app, fetch from live APIs)
const MOCK_PRICES = {
  nifty_index_fund: {
    name: 'Nifty 50 Index Fund',
    nav: 215.43,       // NAV in INR per unit
    isin: 'INF204KB14I2',
    amc: 'UTI Mutual Fund',
  },
  digital_gold: {
    name: 'Digital Gold (24K)',
    pricePerGram: 7420, // INR per gram
    pricePerMg: 7.420,  // INR per milligram
    provider: 'SafeGold',
  },
};

/**
 * Calculate round-up delta
 * @param {number} amount - original spend amount in INR
 * @returns {{ roundedAmount: number, delta: number }}
 */
function computeRoundUp(amount) {
  if (amount <= 0) return { roundedAmount: amount, delta: 0 };
  const roundedAmount = Math.ceil(amount / 10) * 10;
  const delta = roundedAmount - amount;
  return { roundedAmount, delta };
}

/**
 * Invest a given amount into a Nifty 50 Index Fund via BSE StarMF
 * @param {string} userId
 * @param {number} amount - INR amount to invest
 * @param {string|null} goalId - optional goal to associate
 * @returns {Promise<object>} investment receipt
 */
async function investInMutualFund(userId, amount, goalId = null) {
  // TODO: LIVE API — Replace with BSE StarMF SIP/lumpsum API call
  // Endpoint: https://bsestarmf.in/RptDownload.aspx (SOAP/XML)
  // Requires: Member Code, Client ID, PAN, ISIN, Amount
  // Reference: https://www.bsestarmf.in/

  const instrument = MOCK_PRICES.nifty_index_fund;
  const units = parseFloat((amount / instrument.nav).toFixed(4));
  const orderId = `MF${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  // Simulate network delay
  await new Promise(r => setTimeout(r, 200));

  return {
    success: true,
    vehicle: 'mutual_fund',
    orderId,
    instrumentName: instrument.name,
    isin: instrument.isin,
    amc: instrument.amc,
    amountInvested: amount,
    units,
    nav: instrument.nav,
    timestamp: new Date().toISOString(),
    status: 'processing', // BSE typically confirms in T+1
    receiptHash: crypto.randomBytes(32).toString('hex'),
  };
}

/**
 * Purchase Digital Gold via SafeGold API
 * @param {string} userId
 * @param {number} amount - INR amount to invest
 * @param {string|null} goalId - optional goal to associate
 * @returns {Promise<object>} purchase receipt
 */
async function investInGold(userId, amount, goalId = null) {
  // TODO: LIVE API — Replace with SafeGold Purchase API call
  // Endpoint: https://api.safegold.com/v1/purchase (REST/JSON)
  // Requires: API Key, User ID, Amount in INR
  // Reference: https://www.safegold.com/partner-api

  const gold = MOCK_PRICES.digital_gold;
  const gramsAcquired = parseFloat((amount / gold.pricePerGram).toFixed(6));
  const mgAcquired = parseFloat((amount / gold.pricePerMg).toFixed(3));
  const orderId = `GLD${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  await new Promise(r => setTimeout(r, 150));

  return {
    success: true,
    vehicle: 'gold',
    orderId,
    instrumentName: gold.name,
    provider: gold.provider,
    amountInvested: amount,
    gramsAcquired,
    mgAcquired,
    pricePerGram: gold.pricePerGram,
    timestamp: new Date().toISOString(),
    status: 'completed', // Gold purchases are instant
    vaultLocation: 'MMTC-PAMP India, Uttarakhand',
    receiptHash: crypto.randomBytes(32).toString('hex'),
  };
}

/**
 * Route investment based on user's preferred vehicle
 * @param {string} userId
 * @param {number} amount
 * @param {string} vehicle - 'mutual_fund' | 'gold' | 'auto'
 * @param {string|null} goalId
 */
async function routeInvestment(userId, amount, vehicle = 'auto', goalId = null) {
  if (vehicle === 'gold') {
    return investInGold(userId, amount, goalId);
  }
  if (vehicle === 'mutual_fund') {
    return investInMutualFund(userId, amount, goalId);
  }
  // 'auto': use gold for amounts < ₹100 (no MF minimum), MF above
  if (amount < 100) {
    return investInGold(userId, amount, goalId);
  }
  return investInMutualFund(userId, amount, goalId);
}

/**
 * Get current market prices for display
 */
function getMarketPrices() {
  return {
    niftyIndexFund: {
      nav: MOCK_PRICES.nifty_index_fund.nav,
      name: MOCK_PRICES.nifty_index_fund.name,
    },
    digitalGold: {
      pricePerGram: MOCK_PRICES.digital_gold.pricePerGram,
      provider: MOCK_PRICES.digital_gold.provider,
    },
  };
}

module.exports = { computeRoundUp, investInMutualFund, investInGold, routeInvestment, getMarketPrices };
