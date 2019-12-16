'use strict';
jest.mock('cross-fetch');
jest.mock('./settings');
import fetch from 'cross-fetch';
import {getHotels, getHotelDetails} from './hotelsDataProvider';
import {getHotelsNearbyServiceUrl} from './settings';

describe('nearbyHotels', function() {
  beforeEach(function() {
    fetch.mockReset();
    getHotelsNearbyServiceUrl.mockReset();
  });

  test(`getHotels resolves with empty list
  when loading fails`, function() {
    fetch.mockImplementation(function() {
      return Promise.reject(new Error());
    });

    expect(getHotels({})).resolves.toEqual([]);
  });

  test(`getHotels resolves with empty list
  when return code is not 200`, function() {
    fetch.mockImplementation(function() {
      return Promise.resolve({
        status: 400,
      });
    });
    expect(getHotels({})).resolves.toEqual([]);
  });

  test(`getHotels resolves with hotels list
  when loading succeeds and return code is 200`, function() {
    const expectedHotels = ['hotel1', 'hotel2'];
    const location = {
      latitude: 20.2345,
      longitude: 49.3421,
    };
    const areaRadius = 2000;
    getHotelsNearbyServiceUrl.mockReturnValue('http://localhost:8081');
    fetch.mockImplementation(function(url) {
      expect(url).toEqual(
        `http://localhost:8081/hotels?latitude=${location.latitude}&` +
        `longitude=${location.longitude}&radius=${areaRadius}`);
      return Promise.resolve({
        status: 200,
        json: jest.fn(() => Promise.resolve(expectedHotels)),
      });
    });
    expect(getHotels(location, areaRadius)).resolves.toEqual(expectedHotels);
  });

  test(`getHotelDetails resolves with null
  when loading fails`, function() {
    fetch.mockImplementation(function() {
      return Promise.reject(new Error());
    });

    expect(getHotelDetails({})).resolves.toEqual(null);
  });

  test(`getHotelDetails resolves with hotel details
  when loading succeeds and return code is 200`, function() {
    const expectedDetails = 'details';
    const id = 'test-id';
    const context = 'test-context';
    getHotelsNearbyServiceUrl.mockReturnValue('http://localhost:8081');
    fetch.mockImplementation(function(url) {
      expect(url).toEqual(
        `http://localhost:8081/hotels/${id}?context=${context}`);
      return Promise.resolve({
        status: 200,
        json: jest.fn(() => Promise.resolve(expectedDetails)),
      });
    });
    expect(getHotelDetails(id, context)).resolves.toEqual(expectedDetails);
  });
});
