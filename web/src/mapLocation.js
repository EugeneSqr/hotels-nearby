'use strict';
/**
 * Converts location provided to map provider's location format
 * @param {{latitude: number, longitude: number}} location
 * @return {{lat: number, lng: number}}
 */
export default function toMapLocation(location) {
  return {
    lat: location.latitude,
    lng: location.longitude,
  };
}
