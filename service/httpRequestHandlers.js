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
      let {latitude, longitude, radius} = (request || {}).query || {};
      latitude = parseFloat(latitude);
      if (!isLatitudeValid(latitude)) {
        return reject(createError(400, 'Invalid latitude'));
      }

      longitude = parseFloat(longitude);
      if (!isLongitudeValid(longitude)) {
        return reject(createError(400, 'Invalid longitude'));
      }

      radius = parseInt(radius);
      if (!isRadiusValid(radius)) {
        return reject(createError(400, 'Invalid radius'));
      }

      const getHotelsPromise = hotelRepository.getHotels(
        roundCoordinate(latitude), roundCoordinate(longitude), radius);
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
  handleGetHotelDetails: function(request) {
  },
};

function isLatitudeValid(latitude) {
  return !isNaN(latitude) &&
    latitude >= -90 &&
    latitude <= 90;
}

function isLongitudeValid(longitude) {
  return !isNaN(longitude) &&
    longitude >= -180 &&
    longitude <= 180;
}

function isRadiusValid(radius) {
  return !isNaN(radius) &&
    radius > 50 &&
    radius <= 5000;
}

function roundCoordinate(value) {
  /* 4 digits give us around 11 meters precision, which is enough.
   * On the other hand, rounding the values increases cache hit rate */
  return Math.round((value + Number.EPSILON) * 10000 ) / 10000
}
