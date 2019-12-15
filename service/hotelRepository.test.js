'use strict';
describe(`hotelRepository`, function() {
  jest.mock('./networkService');
  jest.mock('./cachingService');
  const networkService = require('./networkService');
  const cachingService = require('./cachingService');
  const hotelRepository = require('./hotelRepository');
  beforeEach(function() {
    networkService.getHotels.mockReset();
    networkService.getHotelDetails.mockReset();
    cachingService.get.mockReset();
    cachingService.set.mockReset();
  });

  test(`getHotels resolves with hotel list from cache
  when cache is hit`, function() {
    const expectedHotels = ['hotel1', 'hotel2'];
    cachingService.get.mockImplementation(
      (providedKey) => Promise.resolve(
        'hotels-20-30-40' === providedKey ? expectedHotels : null));
    return hotelRepository.getHotels(20, 30, 40).then(function(actual) {
      expect(networkService.getHotels).not.toBeCalled();
      expect(actual).toEqual(expectedHotels);
    });
  });

  test(`getHotels rejects
  when caching service fails`, function() {
    cachingService.get.mockImplementation(
      () => Promise.reject(new Error('cache failure')));
    return expect(hotelRepository.getHotels(20, 30, 40))
      .rejects.toStrictEqual(new Error('cache failure'));
  });

  test(`getHotels rejects
  when network service fails`, function() {
    arrangeCacheMiss('hotels-20-30-40');
    networkService.getHotels.mockImplementation(
      () => Promise.reject(new Error('network error')));
    return expect(hotelRepository.getHotels(20, 30, 40))
      .rejects.toStrictEqual(new Error('network error'));
  });

  test(`getHotels rejects
  when data projection fails`, function() {
    arrangeCacheMiss('hotels-20-30-40');
    networkService.getHotels.mockImplementation(() => Promise.resolve());
    return expect(hotelRepository.getHotels(20, 30, 40))
      .rejects.toEqual(expect.any(Error));
  });

  test(`getHotels rejects
  when caching entire hotels list fails`, function() {
    arrangeCacheMiss('hotels-20-30-40');
    arrangeNetworkGetHotels();
    cachingService.set.mockImplementation(
      () => Promise.reject(new Error('put into cache error')));
    return expect(hotelRepository.getHotels(20, 30, 40))
      .rejects.toStrictEqual(new Error('put into cache error'));
  });

  test(`getHotels rejects
  when caching single hotel fails`, function() {
    arrangeCacheMiss('hotels-20-30-40');
    arrangeNetworkGetHotels();
    cachingService.set.mockImplementation(
      (key, value) => key === 'hotels-20-30-40' ?
        Promise.resolve(value) :
        Promise.reject(new Error('cache error')));
    return expect(hotelRepository.getHotels(20, 30, 40))
      .rejects.toStrictEqual(new Error('cache error'));
  });

  test(`getHotels resolves with list of hotels
  when network service, list caching,
  individual hotels caching succeed`, function() {
    arrangeCacheMiss('hotels-20-30-40');
    arrangeNetworkGetHotels();
    cachingService.set.mockImplementation(function(key, value) {
      switch(key) {
        case 'hotels-20-30-40':
        case 'hotel-details-item1':
        case 'hotel-details-item2':
          return Promise.resolve(value);
        default:
          return Promise.reject('cache error');
      }
    });

    return expect(hotelRepository.getHotels(20, 30, 40)).resolves.toEqual([{
      id: 'item1',
      name: 'item1-name',
      latitude: 2,
      longitude: 3,
      detailsRef: 'http://showmore.com',
    }, {
      id: 'item2',
      name: 'item2-name',
      latitude: 4,
      longitude: 5,
      detailsRef: 'http://showevenmore.com',
    }]);
  });

  function arrangeCacheMiss(key) {
    cachingService.get.mockImplementation(() => Promise.resolve(null));
  };

  function arrangeNetworkGetHotels() {
    networkService.getHotels.mockImplementation(
      () => Promise.resolve({
        results: {
          items: [{
            id: 'item1',
            title: 'item1-name',
            position: [2, 3],
            otherProp1: 'arbitrary data1',
            otherProp2: 'arbitrary data2',
            href: 'http://showmore.com',
          }, {
            id: 'item2',
            title: 'item2-name',
            position: [4, 5],
            prop1: 'data1',
            prop2: 'data2',
            href: 'http://showevenmore.com',
          }],
        },
      }));
  }
});
