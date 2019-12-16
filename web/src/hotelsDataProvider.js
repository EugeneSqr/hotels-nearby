'use strict';
import fetch from 'cross-fetch';
import {getHotelsNearbyServiceUrl} from './settings';

/**
 * Gets nearby hotels info
 * @param {{latitude: number, longitude: number}} userLocation
 * @param {number} areaRadius
 * @return {Promise<Array<object>>}
 */
export function getHotels(userLocation, areaRadius) {
  const queryString = `?latitude=${userLocation.latitude}&` +
    `longitude=${userLocation.longitude}&` +
    `radius=${areaRadius}`;
  return fetchData(
    `${getHotelsNearbyServiceUrl()}/hotels`,
    queryString,
    []);
}

export function getHotelDetails(id, context) {
  return fetchData(
    `${getHotelsNearbyServiceUrl()}/hotels/${id}`,
    `?context=${context}`,
    null);
}

function fetchData(url, queryString, fallback) {
  return fetch(url + queryString).then(function(response) {
    if (response.status !== 200) {
      throw new Error();
    }
    return response.json();
  }).catch(function() {
    return fallback;
  });
}
