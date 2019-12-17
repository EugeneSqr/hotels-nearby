'use strict';
describe('cachingService', function() {
  jest.mock('./settings');
  jest.mock('util');
  const cachingService = require('./cachingService');
  const redis = require('redis');

  beforeEach(function() {
    cachingService.__setClient(undefined);
    redis.createClient = jest.fn();
  });

  test(`get fails
  when getting redis client unexpectedly fails`, function() {
    redis.createClient.mockImplementation(function() {
      throw new Error('redis error');
    });
    return expect(cachingService.get('something'))
      .rejects.toStrictEqual(new Error('redis error'));
  });

  test(`get rejects
  when redis client get fails`, function() {
    cachingService.__setClient({
      get: jest.fn(function(key, callback) {
        callback(new Error('redis get error'));
      }),
    });
    return expect(cachingService.get('something'))
      .rejects.toStrictEqual(new Error('redis get error'));
  });

  test(`get resolves
  when redis client get succeeds`, function() {
    const testClient = {
      get: jest.fn(function(key, callback) {
        callback(null, '{"data": "test"}');
      }),
    };
    cachingService.__setClient(testClient);
    return cachingService.get('something').then(function(value) {
      expect(testClient.get).toBeCalledWith('something', expect.any(Function));
      expect(value).toEqual({
        data: 'test',
      });
    });
  });

  test(`set fails
  when getting redis client unexpectedly fails`, function() {
    redis.createClient.mockImplementation(function() {
      throw new Error('redis error');
    });
    return expect(cachingService.set('something'))
      .rejects.toStrictEqual(new Error('redis error'));
  });

  test(`set fails
  when redis client setex fails`, function() {
    const testClient = {
      setex: jest.fn(function(key, expiration, value, callback) {
        callback(new Error('redis setex error'));
      }),
    };
    cachingService.__setClient(testClient);
    return expect(cachingService.set('key', 'value'))
      .rejects.toStrictEqual(new Error('redis setex error'));
  });

  test(`set resolves with value
  when redis client setex succeeds`, function() {
    const testClient = {
      setex: jest.fn(function(key, expiration, value, callback) {
        callback(null, value);
      }),
    };
    cachingService.__setClient(testClient);
    return expect(cachingService.set('key', 'value'))
      .resolves.toEqual('value');
  });
});
