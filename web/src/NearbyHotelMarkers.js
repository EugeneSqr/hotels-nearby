'use strict';
import toMapLocation from './mapLocation';
import {
  useEffect,
} from 'react';
import {
  getHotels,
} from './nearbyHotels';
import {
  HotelMarker,
  SearchRange,
} from './mapObjects';

const areaRadius = 1000;

export default function NearbyHotelMarkers({userLocation, map}) {
  if (!userLocation || !map) {
    return null;
  }

  useEffect(function() {
    getHotels(userLocation, areaRadius).then(function(hotels) {
      clearObjects(map);
      addNewHotelMarkers(hotels, map);
      addNewSearchRange(userLocation, map);
    });
  });

  return null;
}

function clearObjects(map) {
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

function addNewHotelMarkers(hotels, map) {
  hotels.forEach(function({latitude, longitude}) {
    map.addObject(new HotelMarker(toMapLocation({latitude, longitude})));
  });
}

function addNewSearchRange(userLocation, map) {
  map.addObject(new SearchRange(toMapLocation(userLocation), areaRadius));
}
