'use strict';
const networkService = require('./networkService');
/**
 * Responsible for getting hotels information either from network or from
 * database cache
 */
module.exports = {
  getHotels: function(latitude, longitude, radius) {
    return networkService.getHotels(latitude, longitude, radius);
  },

  getHotelDetails: function() {
  },
};
