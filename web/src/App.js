'use strict';
import React, {useState, useEffect, useCallback} from 'react';
import Map from './map/Map';
import HotelDetails from './hotel-details/HotelDetails';
import getUserLocation from './userDataProvider';
import {
  getHotelDetails,
} from './hotelsDataProvider';

export default function App() {
  const [selectedHotel, setSelectedHotel] = useState();
  const centerLocation = useCenterLocation();
  const onHotelSelected = useCallback((id, context) => {
    getHotelDetails(id, context).then(function(details) {
      setSelectedHotel(details);
    });
  }, []);

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

  return (<React.Fragment>
    <Map center={centerLocation} onHotelSelected={onHotelSelected}/>
    <HotelDetails selectedHotel={selectedHotel} />
  </React.Fragment>);
}
