'use strict';
jest.mock('cross-fetch');
import fetch from 'cross-fetch';
import getUserLocation from './userLocation';

describe('currentLocation', function() {
  const defaultLocation = {
    latitude: 52.51,
    longitude: 13.4,
  };

  beforeEach(function() {
    fetch.mockReset();
  });

  test(`getUserLocation resolves with defaults
  when ip lookup fails`, function() {
    fetch.mockImplementation(function() {
      return Promise.reject();
    });
    return expect(getUserLocation()).resolves.toEqual(defaultLocation);
  });

  test(`getUserLocation resolves with defaults
  when ip lookup succeeds, but status !== 200`, function() {
    fetch.mockImplementation(function() {
      return Promise.resolve({
        status: 400
      });
    });
    return expect(getUserLocation()).resolves.toEqual(defaultLocation);
  });

  test(`getUserLocation resolves with defaults
  when ip lookup succeeds, but json payload is invalid`, function() {
    fetch.mockImplementation(function() {
      return Promise.resolve({
        status: 200,
        json: jest.fn(() => Promise.reject()),
      });
    });
    return expect(getUserLocation()).resolves.toEqual(defaultLocation);
  });

  test(`getUserLocation resolves with defaults
  when ip lookup succeeds, but location latitude is invalid`, function() {
    fetch.mockImplementation(function() {
      return Promise.resolve({
        status: 200,
        json: jest.fn(() => Promise.resolve({})),
      });
    });
    return expect(getUserLocation()).resolves.toEqual(defaultLocation);
  });

  test(`getUserLocation resolves with defaults
  when ip lookup succeeds, but location longitude is invalid`, function() {
    fetch.mockImplementation(function() {
      return Promise.resolve({
        status: 200,
        json: jest.fn(() => Promise.resolve({lat:50})),
      });
    });
    return expect(getUserLocation()).resolves.toEqual(defaultLocation);
  });

  test(`getUserLocation resolves with retrieved
  latitude and longitude`, function() {
    const expectedLatitude = 50.50;
    const expectedLongitude = 40.40;
    const resolvedLocation = {
      lat: 50.50,
      lon: 40.40,
    };
    fetch.mockImplementation(function() {
      return Promise.resolve({
        status: 200,
        json: jest.fn(() => Promise.resolve(resolvedLocation)),
      });
    });
    return expect(getUserLocation()).resolves.toEqual({
      latitude: expectedLatitude,
      longitude: expectedLongitude,
    });
  });
});
