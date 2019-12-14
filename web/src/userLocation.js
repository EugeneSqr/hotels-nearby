'use strict';
import fetch from 'cross-fetch';

const ipLookupServiceUri = 'http://ip-api.com/json';
const berlinLatitude = 52.51;
const berlinLongitude = 13.4;

/**
 * Gets current user location. Falls back to Berlin in case of an error.
 * @return {Promise<{latitude: number, longitude: number}>}
 */
export default function getUserLocation() {
  return fetch(ipLookupServiceUri).then(function(response) {
    if (response.status !== 200) {
      throw new Error();
    }

    return response.json();
  }).then(function({lat, lon}) {
    return (isNaN(lat) || isNaN(lon)) ?
      buildDefaultLocation() :
      buildLocation(lat, lon);
  }).catch(function() {
    return buildDefaultLocation();
  });
}

function buildLocation(latitude, longitude) {
  return {
    latitude,
    longitude,
  };
}

function buildDefaultLocation() {
  return buildLocation(berlinLatitude, berlinLongitude);
}
