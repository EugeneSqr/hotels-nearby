'use strict';
describe('promiseHandlerAdapter', function() {
  const adaptPromiseHandler = require('./promiseHandlerAdapter');

  test(`calls next with error
  when promise gets rejected`, function(done) {
    const error = new Error('rejected');
    error.status = 400;
    const handler = function() {
      return Promise.reject(error);
    };
    const handlerAdapter = adaptPromiseHandler(handler);
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    const next = jest.fn(function() {
      expect(res.status).toBeCalledWith(error.status);
      expect(res.send).toBeCalledWith(error.message);
      expect(next).toBeCalledWith();
      done();
    });
    handlerAdapter(null, res, next);
  });

  test(`calls response.send with status code and result
  and calls next without arguments
  when promise resolves`, function(done) {
    const result = {
      success: true,
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    const successHttpCode = 200;
    const handler = function() {
      return Promise.resolve(result);
    };
    const handlerAdapter = adaptPromiseHandler(handler);
    const next = jest.fn(function() {
      expect(res.status).toBeCalledWith(successHttpCode);
      expect(res.send).toBeCalledWith(result);
      expect(next).toBeCalledWith();
      done();
    });
    handlerAdapter(null, res, next);
  });
});
