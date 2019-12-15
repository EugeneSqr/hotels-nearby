'use strict';
const networkService = require('./networkService');
const cachingService = require('./cachingService');
const {
  mapHotels,
  mapHotelDetails,
} = require('./networkServiceDataMapper');
/**
 * Responsible for retrieving and projecting hotels information from network or
 * from cache
 */
module.exports = {
  /**
   * Returns list of hotels nearby
   * @param {number} latitude
   * @param {number} longitude
   * @param {radius} radius
   * @return {Promise<Array<object>>}
   */
  getHotels: function(latitude, longitude, radius) {
    const cacheKey = buildHotelListKey(latitude, longitude, radius);
    return cachingService.get(cacheKey).then(function(hotelList) {
      if (hotelList) {
        return hotelList;
      }

      return networkService.getHotels(latitude, longitude, radius)
        .then(mapHotels)
        .then((hotelList) => cachingService.set(cacheKey, hotelList));
    });
  },

  /**
   * Returns hotel details
   * @param {string} id - hotel id
   * @param {string} context - location context
   * @return {Promise<object>}
   */
  getHotelDetails: function(id, context) {
    const cacheKey = buildHotelDetailsKey(id, context);
    return cachingService.get(cacheKey).then(function(hotelDetails) {
      if (hotelDetails) {
        return hotelDetails;
      }

      return networkService.getHotelDetails(id, context)
        .then(mapHotelDetails)
        .then((hotelDetails) => cachingService.set(cacheKey, hotelDetails));
    });
  },
};

function buildHotelListKey(latitude, longitude, radius) {
  return `hotels-${latitude}-${longitude}-${radius}`;
}

function buildHotelDetailsKey(id, context) {
  return `hotel-details-${id}-${context}`;
}
