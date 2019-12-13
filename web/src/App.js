'use strict';
import React, {useState, useEffect} from 'react';
import Map from './Map';
import getCurrentLocation from './currentLocation';

export default function App() {
  const centerLocation = useCenterLocation();

  function useCenterLocation() {
    const [centerLocation, setCenterLocation] = useState();
    useEffect(function() {
      if (centerLocation) {
        return;
      }

      getCurrentLocation().then(function(currentLocation) {
        setCenterLocation(currentLocation);
      });
    });

    return centerLocation;
  }

  return (<Map center={centerLocation}></Map>);
}
