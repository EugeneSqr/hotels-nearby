'use strict';
describe('network service', function() {
  jest.mock('./apiKeys');
  const networkService = require('./networkService');
  test(`getHotels returns list of hotels`, function() {
    // return expect(networkService.getHotels(buildLocation(10, 10)))
    //   .resolves.toEqual([{
    //     id: 'test',
    //   }]);
  });

  function buildLocation(latitude, longitude) {
    return {
      latitude,
      longitude,
    };
  }
});
