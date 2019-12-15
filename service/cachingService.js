'use strict';
const redis = require('redis');
const PORT = 6379;
const {
  getRedisHost,
} = require('./settings');
const {
  promisify,
} = require('util');
const expirationSec = 60 * 60 * 24;

let client;

/**
 * A caching layer
 */
module.exports = {
  /**
   * Gets value from cache
   * @param {string} key
   * @return {Promise{object}} cached value
   */
  get: function(key) {
    return getClient()
      .then((client) => client.get(key));
  },

  /**
   * Sets value to cache with one day expiration
   * @param {string} key
   * @param {object} value
   * @return {Promise}
   */
  set: function(key, value) {
    return getClient()
      .then((client) => client.setex(key, expirationSec, JSON.stringify(value)))
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

    const cli = redis.createClient(PORT, getRedisHost());
    /* istanbul ignore next */
    cli.on('connect', function() {
      cli.get = promisify(cli.get).bind(cli);
      cli.setex = promisify(cli.setex).bind(cli);
      client = cli;
      return resolve(client);
    });
    /* istanbul ignore next */
    cli.on('error', reject);
  });
}
