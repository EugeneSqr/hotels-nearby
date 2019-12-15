'use strict';
describe('addressFormatter', function() {
  const formatAddress = require('./addressFormatter');
  test(`formatAddress return empty string
  when no address specified`, function() {
    expect(formatAddress()).toEqual('');
  });

  test(`formatAddress formats input address`, function() {
    const address = {
      house: 54,
      street: 'prospekt Gagarina',
      postalCode: 603057,
      city: 'Nizhniy Novgorod',
      country: 'Russia',
    };
    const actual = formatAddress(address);
    expect(actual).toEqual(
      'prospekt Gagarina, 54, Nizhniy Novgorod, 603057, Russia');
  });

  test(`formatAddress formats input address
  when some of the properties are missing`, function() {
    const address = {
      house: undefined,
      street: 'prospekt Gagarina',
      postalCode: undefined,
      city: 'Nizhniy Novgorod',
      country: 'Russia',
    };
    const actual = formatAddress(address);
    expect(actual).toEqual(
      'prospekt Gagarina, Nizhniy Novgorod, Russia');
  });
});
