'use strict';
jest.mock('./addressFormatter');
describe('networkServiceDataMapper', function() {
  const formatAddress = require('./addressFormatter');
  const {
    mapHotels,
    mapHotelDetails,
  } = require('./networkServiceDataMapper');
  beforeEach(function() {
    formatAddress.mockReset();
  });

  test(`mapHotels maps raw data`, function() {
    const rawData = {
      results: {
        items: [{
          id: 'id1',
          title: 'name1',
          position: [22.333, 11.444],
          href: 'https://places.sit.ls.hereapi.com/places/v1/places/' +
            '643jx7ps-0164bd3f8b3d00604a1a575fff76d2cb;context=Zmxvdy1pZD0x' +
            'NzUyYjUzNi1hMzkwLTU1ODgtYWUwYS00MmFhYmNmM2RhNGVfMTU3NjQ5ODY4Nz' +
            'YzMl8zNTYxXzYzMTUmcmFuaz0w',
        }, {
          id: 'id2',
          title: 'name2',
          position: [44.22, 33.11],
          href: 'https://places.sit.ls.hereapi.com/places/v1/places/' +
            '643ufp20-973c516ec6a54dbbac0fec2dd7a39efd;context=Zmxvdy1pZD0x' +
            'NzUyYjUzNi1hMzkwLTU1ODgtYWUwYS00MmFhYmNmM2RhNGVfMTU3NjQ5ODY4Nz' +
            'YzMl8zNTYxXzYzMTUmcmFuaz0x',
        }],
      },
    };
    const actual = mapHotels(rawData);
    expect(actual).toEqual([{
      id: 'id1',
      name: 'name1',
      latitude: 22.333,
      longitude: 11.444,
      context: 'Zmxvdy1pZD0xNzUyYjUzNi1hMzkwLTU1ODgtYWUwYS00MmFhYmNmM2RhNGV' +
        'fMTU3NjQ5ODY4NzYzMl8zNTYxXzYzMTUmcmFuaz0w',
    }, {
      id: 'id2',
      name: 'name2',
      latitude: 44.22,
      longitude: 33.11,
      context: 'Zmxvdy1pZD0xNzUyYjUzNi1hMzkwLTU1ODgtYWUwYS00MmFhYmNmM2RhNGV' +
        'fMTU3NjQ5ODY4NzYzMl8zNTYxXzYzMTUmcmFuaz0x',
    }]);
  });

  test(`mapHotelDetails maps details data`, function() {
    formatAddress.mockReturnValue('mocked address');
    const rawData = {
      id: 'id1',
      name: 'name1',
      location: {
        position: [34.22, 44.11],
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
      },
    };
    const actual = mapHotelDetails(rawData);
    expect(actual).toEqual({
      id: 'id1',
      name: 'name1',
      latitude: 34.22,
      longitude: 44.11,
      address: 'mocked address',
      phone: 'phone1',
      email: 'email1',
      website: '',
    });
  });
});
