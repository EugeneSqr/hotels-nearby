'use strict';
const networkService = require('./networkService');
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
   * @return {{id: string, name: string, latitude: number, longitude: number}}
   */
  getHotels: function(latitude, longitude, radius) {
    const hotelsPromise = networkService.getHotels(latitude, longitude, radius);
    return hotelsPromise.then(function({results}) {
      return results.items.map(toListHotel);
    });
  },

  // TODO: implement me
  getHotelDetails: function() {
  },
};

function toListHotel(rawHotel) {
  return {
    id: rawHotel.id,
    name: rawHotel.title,
    latitude: rawHotel.position[0],
    longitude: rawHotel.position[1],
  };
}
