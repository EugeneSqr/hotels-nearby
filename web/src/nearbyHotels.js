'use strict';
import fetch from 'cross-fetch';
import {getHotelsNearbyServiceUrl} from './settings';

const areaRadius = 2000;

export function getHotels(userLocation) {
  const endpointUrl = `${getHotelsNearbyServiceUrl()}/hotels`;
  const queryString = `?latitude=${userLocation.latitude}&` +
    `longitude=${userLocation.longitude}&` +
    `radius=${areaRadius}`;
  return fetch(endpointUrl + queryString).then(function(response) {
    if (response.status !== 200) {
      throw new Error();
    }

    return response.json();
  }).catch(function() {
    return [];
  });
}
