'use strict';
const {
  getRestApiKey,
} = require('./settings');
const request = require('request-promise-native');
const baseUrl = 'https://places.sit.ls.hereapi.com/places/v1';
const defaultSize = 100;
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
        apiKey: getRestApiKey(),
        in: buildIn(latitude, longitude, radius),
        cat: hotelCategory,
        size: defaultSize,
      },
      json: true,
    };

    return request(options);
  },

  /**
   * Gets details for specific hotel
   */
  // TODO: implement me
  getHotelDetails: function(id) {
  },
};

function buildIn(latitude, longitude, radius) {
  return `${latitude},${longitude};r=${radius}`;
}
