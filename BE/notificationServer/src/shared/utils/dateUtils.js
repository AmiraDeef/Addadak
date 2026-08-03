'use strict';

/**
 * Formats a Date object to 'YYYY-MM-DD HH:mm:ss'
 * @param {Date|string|number} dateInput - The date to format
 * @returns {string} Formatted date string
 */
const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  
  if (isNaN(date.getTime())) return String(dateInput);

  const pad = (num) => String(num).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = {
  formatDate,
};
