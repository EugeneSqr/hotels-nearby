'use strict';
describe(`hotelRepository`, function() {
  jest.mock('./networkService');
  jest.mock('./cachingService');
  jest.mock('./networkServiceDataMapper');
  const networkService = require('./networkService');
  const cachingService = require('./cachingService');
  const hotelRepository = require('./hotelRepository');
  const {
    mapHotels,
    mapHotelDetails,
  } = require('./networkServiceDataMapper');

  beforeEach(function() {
    networkService.getHotels.mockReset();
    networkService.getHotelDetails.mockReset();
    cachingService.get.mockReset();
    cachingService.set.mockReset();
    mapHotels.mockReset();
    mapHotelDetails.mockReset();
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
    mapHotels.mockImplementation(function() {
      throw new Error('mapping error');
    });
    return expect(hotelRepository.getHotels(20, 30, 40))
      .rejects.toStrictEqual(new Error('mapping error'));
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

  test(`getHotels resolves with list of hotels
  when network service and list caching succeed`, function() {
    arrangeCacheMiss('hotels-20-30-40');
    arrangeNetworkGetHotels();
    cachingService.set.mockImplementation(
      (key, value) => Promise.resolve(value));
    const mappedHotels = ['mapped hotel1', 'mapped hotel2'];
    mapHotels.mockReturnValue(mappedHotels);
    return expect(hotelRepository.getHotels(20, 30, 40))
      .resolves.toEqual(mappedHotels);
  });

  test(`getHotelDetails resolves with hotel details from cache
  when cache is hit`, function() {
    const expectedDetails = {
      id: 'details id',
      address: 'test address',
    };
    cachingService.get.mockImplementation(
      (providedKey) => Promise.resolve(
        'hotel-details-id-ctx' === providedKey ? expectedDetails : null));
    return hotelRepository.getHotelDetails('id', 'ctx').then(function(actual) {
      expect(networkService.getHotelDetails).not.toBeCalled();
      expect(actual).toEqual(expectedDetails);
    });
  });

  test(`getHotelDetails rejects
  when caching service fails`, function() {
    cachingService.get.mockImplementation(
      () => Promise.reject(new Error('cache failure')));
    return expect(hotelRepository.getHotelDetails('id', 'ctx'))
      .rejects.toStrictEqual(new Error('cache failure'));
  });

  test(`getHotelDetails rejects
  when network service fails`, function() {
    arrangeCacheMiss('hotel-details-id-ctx');
    networkService.getHotelDetails.mockImplementation(
      () => Promise.reject(new Error('network error')));
    return expect(hotelRepository.getHotelDetails('id', 'ctx'))
      .rejects.toStrictEqual(new Error('network error'));
  });

  test(`getHotelDetails rejects
  when data projection fails`, function() {
    arrangeCacheMiss('hotel-details-id-ctx');
    networkService.getHotelDetails.mockImplementation(() => Promise.resolve());
    mapHotelDetails.mockImplementation(function() {
      throw new Error('details mapping failure');
    });
    return expect(hotelRepository.getHotelDetails('id', 'ctx'))
      .rejects.toStrictEqual(new Error('details mapping failure'));
  });

  test(`getHotelDetails rejects
  when caching details fails`, function() {
    arrangeCacheMiss('hotels-details-id-ctx');
    arrangeNetworkGetHotelDetails();
    cachingService.set.mockImplementation(
      () => Promise.reject(new Error('put into cache error')));
    return expect(hotelRepository.getHotelDetails('id', 'ctx'))
      .rejects.toStrictEqual(new Error('put into cache error'));
  });

  test(`getHotelDetails resolves with hotel details
  when network service and details caching succeed`, function() {
    arrangeCacheMiss('hotel-details-id-ctx');
    arrangeNetworkGetHotelDetails();
    cachingService.set.mockImplementation(
      (key, value) => Promise.resolve(value));
    mapHotelDetails.mockReturnValue('mapped details');
    return expect(hotelRepository.getHotelDetails('id', 'ctx'))
      .resolves.toEqual('mapped details');
  });

  function arrangeCacheMiss(key) {
    cachingService.get.mockImplementation(() => Promise.resolve(null));
  };

  function arrangeNetworkGetHotels() {
    networkService.getHotels.mockReturnValue(Promise.resolve({
      results: {
        items: [{
          id: 'item1',
          title: 'name 1',
          position: [2, 3],
          otherProp1: 'arbitrary data1',
          otherProp2: 'arbitrary data2',
          href: 'http://showmore.com',
        }, {
          id: 'item2',
          title: 'name 2',
          position: [4, 5],
          prop1: 'data1',
          prop2: 'data2',
          href: 'http://showevenmore.com',
        }],
      },
    }));
  }

  function arrangeNetworkGetHotelDetails() {
    networkService.getHotelDetails.mockReturnValue(Promise.resolve({
      id: 'id1',
      title: 'name1',
      location: {
        position: [6, 7],
        address: {
        },
      },
      contacts: {
        phone: [{
          value: 'phone1',
        }],
        email: [{
          value: 'email1',
        }],
        website: [{
          value: 'website1',
        }],
      },
    }));
  }
});
