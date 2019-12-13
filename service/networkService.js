'use strict';
const apiKey = require('./apiKeys')();
const request = require('request-promise');
const baseUrl = 'https://places.sit.ls.hereapi.com/places/v1';
const hotelCategory = 'hotel';
/**
 * Gets data from a remote geolocation service
 */
module.exports = {
  /**
   * Gets list of hotels in the specified circular area
   * @param {number} latitude - latitude of the center of the area
   * @param {number} longitude - longitude of the center of the area
   * @param {number} radius - area radius
   * @return {Promise<array<object>>}
   */
  getHotels: function(latitude, longitude, radius) {
    const options = {
      uri: `${baseUrl}/browse`,
      qs: {
        apiKey,
        in: buildCircularIn(latitude, longitude, radius),
        cat: hotelCategory,
      },
    };

    return request(options);
  },

  /**
   * Gets details for specific hotel
   */
  getHotelDetails: function(id) {
  },
};

function buildCircularIn(latitude, longitude, radius) {
  return `${latitude},${longitude};r=${radius}`;
}
