'use strict';
describe('httpRequestHandlers', function() {
  jest.mock('./hotelRepository');
  const {
    handleGetHotels,
  } = require('./httpRequestHandlers');
  const {
    BadRequest,
    InternalServerError,
  } = require('http-errors');
  const {
    getHotels,
  } = require('./hotelRepository');

  beforeEach(function() {
    getHotels.mockReset();
  });

  test(`rejects with BadRequest 'Invalid latitude' error
  when no request is provided`, function() {
    return expect(handleGetHotels())
      .rejects.toStrictEqual(new BadRequest('Invalid latitude'));
  });

  test(`rejects with BadRequest 'Invalid latitude' error
  when request provided has no query`, function() {
    return expect(handleGetHotels({}))
      .rejects.toStrictEqual(new BadRequest('Invalid latitude'));
  });

  test(`rejects with BadRequest 'Invalid latitude' error
  when latitude argument is missing`, function() {
    return expect(handleGetHotels(buildHotelsRequest()))
      .rejects.toStrictEqual(new BadRequest('Invalid latitude'));
  });

  test(`rejects with BadRequest 'Invalid latitude' error
  when latitude argument is null`, function() {
    return expect(handleGetHotels(buildHotelsRequest(null)))
      .rejects.toStrictEqual(new BadRequest('Invalid latitude'));
  });

  test(`rejects with BadRequest 'Invalid latitude' error
  when latitude argument is not a number`, function() {
    return expect(handleGetHotels(buildHotelsRequest('a')))
      .rejects.toStrictEqual(new BadRequest('Invalid latitude'));
  });

  test(`rejects with BadRequest 'Invalid latitude' error
  when latitude argument is below -90`, function() {
    return expect(handleGetHotels(buildHotelsRequest(-91)))
      .rejects.toStrictEqual(new BadRequest('Invalid latitude'));
  });

  test(`rejects with BadRequest 'Invalid latitude' error
  when latitude argument is above 90`, function() {
    return expect(handleGetHotels(buildHotelsRequest(91)))
      .rejects.toStrictEqual(new BadRequest('Invalid latitude'));
  });

  test(`rejects with BadRequest 'Invalid longitude' error
  when longitude argument is missing`, function() {
    return expect(handleGetHotels(buildHotelsRequest(0)))
      .rejects.toStrictEqual(new BadRequest('Invalid longitude'));
  });

  test(`rejects with BadRequest 'Invalid longitude' error
  when longitude argument is null`, function() {
    return expect(handleGetHotels(buildHotelsRequest(0, null)))
      .rejects.toStrictEqual(new BadRequest('Invalid longitude'));
  });

  test(`rejects with BadRequest 'Invalid longitude' error
  when longitude argument is not a number`, function() {
    return expect(handleGetHotels(buildHotelsRequest(0, 'a')))
      .rejects.toStrictEqual(new BadRequest('Invalid longitude'));
  });

  test(`rejects with BadRequest 'Invalid longitude' error
  when longitude argument is below -180`, function() {
    return expect(handleGetHotels(buildHotelsRequest(0, -181)))
      .rejects.toStrictEqual(new BadRequest('Invalid longitude'));
  });

  test(`rejects with BadRequest 'Invalid longitude' error
  when longitude argument is above 180`, function() {
    return expect(handleGetHotels(buildHotelsRequest(0, 181)))
      .rejects.toStrictEqual(new BadRequest('Invalid longitude'));
  });

  test(`rejects with BadRequest 'Invalid radius' error
  when radius is provided, but not a number`, function() {
    return expect(handleGetHotels(buildHotelsRequest(0, 0, 'a')))
      .rejects.toStrictEqual(new BadRequest('Invalid radius'));
  });

  test(`rejects with BadRequest 'Invalid radius' error
  when radius is provided, but smaller than 0`, function() {
    return expect(handleGetHotels(buildHotelsRequest(0, 0, -1)))
      .rejects.toStrictEqual(new BadRequest('Invalid radius'));
  });

  test(`rejects with BadRequest 'Invalid radius' error
  when radius is provided, but larger than 5000`, function() {
    return expect(handleGetHotels(buildHotelsRequest(0, 0, 5001)))
      .rejects.toStrictEqual(new BadRequest('Invalid radius'));
  });

  test(`rejects with InternalServerError error
  when hotelRepository fails`, function() {
    getHotels.mockImplementation(function() {
      return Promise.reject(new Error());
    });
    return expect(handleGetHotels(buildHotelsRequest(0, 0, 100)))
      .rejects.toStrictEqual(new InternalServerError());
  });

  test(`resolves with list of hotels
  when all parameters are good and repository succeeds`, function() {
    const expectedHotels = ['hotel1', 'hotel2', 'hotel3'];
    getHotels.mockImplementation(function() {
      return Promise.resolve(expectedHotels);
    });
    return expect(handleGetHotels(buildHotelsRequest(0, 0, 100)))
      .resolves.toEqual(expectedHotels);
  });

  test(`resolves with list of hotels
  when radius isn't provided and repository succeeds`, function() {
    const expectedHotels = ['hotel1', 'hotel2', 'hotel3'];
    getHotels.mockImplementation(function() {
      return Promise.resolve(expectedHotels);
    });
    return expect(handleGetHotels(buildHotelsRequest(0, 0)))
      .resolves.toEqual(expectedHotels);
  });

  test(`resolves with list of hotels
  when radius is null and repository succeeds`, function() {
    const expectedHotels = ['hotel1', 'hotel2', 'hotel3'];
    getHotels.mockImplementation(function() {
      return Promise.resolve(expectedHotels);
    });
    return expect(handleGetHotels(buildHotelsRequest(0, 0, null)))
      .resolves.toEqual(expectedHotels);
  });

  function buildHotelsRequest(latitude, longitude, radius) {
    return {
      query: {
        latitude,
        longitude,
        radius,
      },
    };
  }
});
