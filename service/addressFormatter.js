'use strict';

/**
 * Converts address object to string
 * @param {{
 *   house: string,
 *   street: string,
 *   postalCode: string,
 *   city: string,
 *   country: string}} address
 * @return {string}
 */
module.exports = function formatAddress(address) {
  if (!address) {
    return '';
  }

  return [
    address.street,
    address.house,
    address.city,
    address.postalCode,
    address.country].filter(function(el) {
    return !!el;
  }).join(', ');
};
