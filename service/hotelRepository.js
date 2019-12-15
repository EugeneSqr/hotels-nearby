'use strict';
const networkService = require('./networkService');
const cachingService = require('./cachingService');
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
        .then(({results}) => results.items.map(toHotel))
        .then((hotelList) => cachingService.set(cacheKey, hotelList))
        .then((hotelList) => Promise.all(hotelList.map(cacheHotel)));
    });
  },

  // TODO: implement me
  getHotelDetails: function() {
  },
};

function toHotel(rawHotel) {
  return {
    id: rawHotel.id,
    name: rawHotel.title,
    latitude: rawHotel.position[0],
    longitude: rawHotel.position[1],
    detailsRef: rawHotel.href,
  };
}

function cacheHotel(hotel) {
  const cacheKey = buildHotelDetailsKey(hotel.id);
  return cachingService.set(cacheKey, hotel);
}

function buildHotelListKey(latitude, longitude, radius) {
  return `hotels-${latitude}-${longitude}-${radius}`;
}

function buildHotelDetailsKey(hotelId) {
  return `hotel-details-${hotelId}`;
}
