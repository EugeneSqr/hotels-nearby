'use strict';
import React, {useState, useEffect} from 'react';
import Map from './Map';
import getUserLocation from './userLocation';

export default function App() {
  const centerLocation = useCenterLocation();

  function useCenterLocation() {
    const [centerLocation, setCenterLocation] = useState();
    useEffect(function() {
      if (centerLocation) {
        return;
      }

      getUserLocation().then(function(userLocation) {
        setCenterLocation(userLocation);
      });
    });

    return centerLocation;
  }

  return (<Map center={centerLocation}></Map>);
}
