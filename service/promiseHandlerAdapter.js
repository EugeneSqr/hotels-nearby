'use strict';
const successStatusCode = 200;

/**
 * Adapts a promise-based handler interface to a one, which can be consumed
 * by popular frameworks like express or restify
 * @param {function} promiseHandler - a promise-based http request handler
 * @return {function} adapted handler, which can be directly express or restify
 */
module.exports = function adapt(promiseHandler) {
  return function(req, res, next) {
    promiseHandler(req).then(function(result) {
      res.status(successStatusCode).send(result);
      next();
    }, function(error) {
      res.status(error.status).send(error.message);
      next();
    });
  };
};
