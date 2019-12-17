/* istanbul ignore file */
'use strict';
module.exports = {
  getRestApiKey: function() {
    return process.env.HERE_REST_API_KEY;
  },
  getRedisUrl: function() {
    return process.env.REDIS_URL;
  },
};
