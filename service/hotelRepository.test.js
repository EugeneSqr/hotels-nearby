'use strict';
describe(`hotelRepository`, function() {
  jest.mock('./networkService');
  const networkService = require('./networkService');
  const hotelRepository = require('./hotelRepository');
  beforeEach(function() {
    networkService.getHotels.mockReset();
    networkService.getHotelDetails.mockReset();
  });

  test(`getHotels rejects
  when underlying networkService fails`, function() {
    networkService.getHotels.mockImplementation(function() {
      return Promise.reject(new Error());
    });
    expect(hotelRepository.getHotels()).rejects.toStrictEqual(new Error());
  });

  test(`getHotels rejects
  when returned results are invalid`, function() {
    networkService.getHotels.mockImplementation(function() {
      return Promise.resolve();
    });
    expect(hotelRepository.getHotels()).rejects.toEqual(expect.any(Error));
  });

  test(`getHotel projects the retrieved items`, function() {
    networkService.getHotels.mockImplementation(function() {
      return Promise.resolve({
        results: {
          items: [{
            id: 'item1',
            title: 'item1-name',
            position: [2, 3],
            otherProp1: 'arbitrary data1',
            otherProp2: 'arbitrary data2',
          }, {
            id: 'item2',
            title: 'item2-name',
            position: [4, 5],
            prop1: 'data1',
            prop2: 'data2',
          }],
        },
      });
    });
    expect(hotelRepository.getHotels()).resolves.toEqual([{
      id: 'item1',
      name: 'item1-name',
      latitude: 2,
      longitude: 3,
    }, {
      id: 'item2',
      name: 'item2-name',
      latitude: 4,
      longitude: 5,
    }]);
  });
});
