'use strict';
const formatAddress = require('./addressFormatter');
/**
 * Map data obtained from remote service to local business entities
 */
module.exports = {
  /**
   * Maps list of hotels
   * @param {object} rawHotelList
   * @return {object}
   */
  mapHotels: function(rawHotelList) {
    return rawHotelList.results.items.map(function(rawHotel) {
      return {
        id: rawHotel.id,
        name: rawHotel.title,
        ...toLocation(rawHotel.position),
        context: /;context=(.*)$/.exec(rawHotel.href)[1],
      };
    });
  },

  /**
   * Maps hotel details
   * @param {object} rawHotel
   * @return {object}
   */
  mapHotelDetails: function(rawHotel) {
    return {
      id: rawHotel.id,
      name: rawHotel.name,
      ...toLocation(rawHotel.location.position),
      address: formatAddress(rawHotel.location.address),
      phone: toContact(rawHotel, 'phone'),
      email: toContact(rawHotel, 'email'),
      website: toContact(rawHotel, 'website'),
    };
  },
};

function toLocation(position) {
  return {
    latitude: position[0],
    longitude: position[1],
  };
}

function toContact(rawHotel, contactType) {
  const contact = rawHotel.contacts[contactType] || [];
  return contact.length ? contact[0].value : '';
}
