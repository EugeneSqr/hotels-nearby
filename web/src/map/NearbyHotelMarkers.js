'use strict';
import {
  useEffect,
} from 'react';
import {
  getHotels,
} from '../hotelsDataProvider';
import HotelMarker from './hotelMarker';
import SearchRange from './searchRange';

const areaRadius = 1000;

export default function NearbyHotelMarkers({
  userLocation, map, onHotelSelected}) {
  if (!userLocation || !map) {
    return null;
  }

  useEffect(function() {
    getHotels(userLocation, areaRadius).then(function(hotels) {
      clearObjects();
      addNewSearchRange();
      addNewHotelMarkers(hotels);
    });
  });

  return null;

  function addNewHotelMarkers(hotels) {
    hotels.forEach(function(hotel) {
      const marker = new HotelMarker(hotel);
      marker.addEventListener('tap', function(e) {
        onHotelSelected(e.target.hotelId, e.target.hotelContext);
        e.stopPropagation();
      });
      map.addObject(marker);
    });
  }

  function clearObjects() {
    const objects = map.getObjects();
    for (let i = 0; i < objects.length; ++i) {
      const obj = objects[i];
      if (shouldClear(obj)) {
        map.removeObject(obj);
      }
    }

    function shouldClear(obj) {
      return (obj instanceof HotelMarker) || (obj instanceof SearchRange);
    }
  }

  function addNewSearchRange() {
    map.addObject(new SearchRange(userLocation, areaRadius));
  }
}
