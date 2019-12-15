'use strict';
describe('network service', function() {
  jest.mock('./settings');
  jest.mock('request-promise-native');
  const request = require('request-promise-native');
  const networkService = require('./networkService');
  const {
    getRestApiKey,
  } = require('./settings');
  beforeEach(function() {
    getRestApiKey.mockReturnValue('api-key-value');
    request.mockReset();
  });

  test(`getHotels rejects
  when underlying request library fails`, function() {
    request.mockImplementation(function() {
      return Promise.reject(new Error());
    });

    expect(networkService.getHotels()).rejects.toEqual(expect.any(Error));
  });

  test(`getHotels returns list of hotels
  from underlying request library`, function() {
    request.mockImplementation(function(options) {
      expect(options).toEqual({
        uri: 'https://places.sit.ls.hereapi.com/places/v1/browse',
        qs: {
          apiKey: getRestApiKey(),
          in: '10,20;r=2000',
          cat: 'hotel',
          size: 100,
        },
        json: true,
      });
      return Promise.resolve(['hotel1', 'hotel2', 'hotel3']);
    });
    return expect(networkService.getHotels(10, 20, 2000))
      .resolves.toEqual(['hotel1', 'hotel2', 'hotel3']);
  });
});
