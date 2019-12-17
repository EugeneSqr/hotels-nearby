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
   * @param {object} request
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
      return getHotelsPromise
        .then(resolve)
        .catch((error) => reject(createError(500)));
    });
  },

  /**
   * Handles hotel details request
   * @param {object} request
   * @return {Promise}
   */
  handleGetHotelDetails: function(request) {
    return new Promise(function(resolve, reject) {
      request = request || {};
      const {id} = request.params || {};
      if (isValueEmpty(id)) {
        return reject(createError(400, 'Invalid id'));
      }

      const {context} = request.query || {};
      if (isValueEmpty(context)) {
        return reject(createError(400, 'Invalid context'));
      }

      hotelRepository.getHotelDetails(id, context)
        .then(resolve)
        .catch(() => reject(createError(500)));
    });
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
  return Math.round((value + Number.EPSILON) * 10000 ) / 10000;
}

function isValueEmpty(value) {
  return !value;
}
