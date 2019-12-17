'use strict';
const redis = require('redis');
const {
  getRedisUrl,
} = require('./settings');
const expirationSec = 60 * 60 * 24;

let client;

/**
 * A caching layer
 */
module.exports = {
  /**
   * Gets value from cache
   * @param {string} key
   * @return {Promise<object>} cached value
   */
  get: function(key) {
    return getClient()
      .then((client) => clientGet(client, key))
      .then((json) => JSON.parse(json));
  },

  /**
   * Sets value to cache with one day expiration
   * @param {string} key
   * @param {object} value
   * @return {Promise<object>}
   */
  set: function(key, value) {
    return getClient()
      .then((client) => clientSetex(
        client, key, expirationSec, JSON.stringify(value)))
      .then(() => value);
  },

  // for tesing only
  __setClient: function(testClient) {
    client = testClient;
  },
};

function getClient() {
  return new Promise(function(resolve, reject) {
    if (client) {
      return resolve(client);
    }

    const cli = redis.createClient(getRedisUrl());
    /* istanbul ignore next */
    cli.on('connect', function() {
      client = cli;
      return resolve(client);
    });
    /* istanbul ignore next */
    cli.on('error', reject);
  });
}

function clientGet(client, key) {
  return new Promise(function(resolve, reject) {
    client.get(key, function(error, response) {
      if (error) {
        return reject(error);
      }

      return resolve(response);
    });
  });
}

function clientSetex(client, key, expiration, value) {
  return new Promise(function(resolve, reject) {
    client.setex(key, expiration, value, function(error, response) {
      if (error) {
        return reject(error);
      }

      return resolve(value);
    });
  });
}
