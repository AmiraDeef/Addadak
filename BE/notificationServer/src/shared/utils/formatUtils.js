'use strict';

/**
 * Formats a number to EGP currency
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return '0.00 EGP';
  
  return `${num.toFixed(2)} EGP`;
};

/**
 * Formats a number to kWh consumption
 * @param {number|string} kwh - The consumption to format
 * @returns {string} Formatted consumption string
 */
const formatConsumption = (kwh) => {
  const num = Number(kwh);
  if (isNaN(num)) return '0 kWh';
  
  return `${num} kWh`;
};

module.exports = {
  formatCurrency,
  formatConsumption,
};
