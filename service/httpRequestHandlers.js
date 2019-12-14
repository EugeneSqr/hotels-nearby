'use strict';
const createError = require('http-errors');
const hotelRepository = require('./hotelRepository');
/**
 * A set of handlers that deal with getting arguments from incomming http
 * requests and transform internal system errors to http ones.
 */
module.exports = {
  /**
   * Handles hotel list retrieval request
   * @param {request} request - incomming http request
   * @return {Promise}
   */
  handleGetHotels: function(request) {
    return new Promise(function(resolve, reject) {
      const {latitude, longitude, radius} = (request || {}).query || {};
      if (!isLatitudeValid(latitude)) {
        return reject(createError(400, 'Invalid latitude'));
      }

      if (!isLongitudeValid(longitude)) {
        return reject(createError(400, 'Invalid longitude'));
      }

      const radiusProvided = isRadiusProvided(radius);
      if (radiusProvided && !isRadiusValid(radius)) {
        return reject(createError(400, 'Invalid radius'));
      }

      const getHotelsPromise = hotelRepository.getHotels(
        latitude, longitude, radiusProvided ? radius : undefined);
      return getHotelsPromise.then(function(hotels) {
        return resolve(hotels);
      }, function() {
        return reject(createError(500));
      });
    });
  },

  /**
   * Handles hotel details request
   * @return {Promise}
   */
  // handleGetHotelDetails: function(request) {
  // },
};

function isLatitudeValid(latitude) {
  return isNumber(latitude) &&
    latitude >= -90 &&
    latitude <= 90;
}

function isLongitudeValid(longitude) {
  return isNumber(longitude) &&
    longitude >= -180 &&
    longitude <= 180;
}

function isRadiusValid(radius) {
  return isNumber(radius) &&
    radius > 50 &&
    radius <= 5000;
}

function isRadiusProvided(radius) {
  return typeof radius !== 'undefined' && radius !== null;
}

function isNumber(value) {
  return value !== null && !isNaN(value);
}
