'use strict';
import {useEffect} from 'react';
import {getHotels} from './nearbyHotels';

export default function NearbyHotelMarkers({userLocation, map}) {
  if (!userLocation || !map) {
    return null;
  }

  useHotelLocations(userLocation);

  return null;
}

function useHotelLocations(userLocation) {
  useEffect(function() {
    getHotels(userLocation).then(function(hotels) {
      console.log(hotels);
    });
  });
}
