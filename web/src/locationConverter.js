'use strict';
/**
 * Converts location provided to external provider's location format
 * @param {{latitude: number, longitude: number}} location
 * @return {{lat: number, lng: number}}
 */
export default function toExternalLocation(location) {
  return {
    lat: location.latitude,
    lng: location.longitude,
  };
}
