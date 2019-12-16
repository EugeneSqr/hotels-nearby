'use strict';
import React, {useEffect, useState} from 'react';
import {getMapApiKey} from '../settings';
import toExternalLocation from '../locationConverter';
import UserLocationMarker from './UserLocationMarker';
import NearbyHotelMarkers from './NearbyHotelMarkers';

export default React.memo(function Map({center, onHotelSelected}) {
  if (!center) {
    return null;
  }

  const mapRef = React.createRef();
  const map = useMap();
  const location = useLocation();
  useWindowSize();

  return (
    <div id='map' ref={mapRef}>
      <UserLocationMarker location={location} map={map} />
      <NearbyHotelMarkers
        userLocation={location}
        map={map}
        onHotelSelected={onHotelSelected} />
    </div>
  );

  function useMap() {
    const [map, setMap] = useState();
    useEffect(function() {
      if (!map && center) {
        const defaultZoomLevel = 14;
        const platform = new window.H.service.Platform({
          'apikey': getMapApiKey(),
        });
        const defaultLayers= platform.createDefaultLayers();
        const newMap = new window.H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map, {
            zoom: defaultZoomLevel,
            center: toExternalLocation(center),
          });
        enableMapEvents(newMap);
        setMap(newMap);
      }
    });

    return map;
  }

  function useLocation() {
    const [location, setLocation] = useState({...center});
    useEffect(function() {
      if (map && location) {
        const handleTap = function(evt) {
          const coord = map.screenToGeo(
            evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
          setLocation({
            latitude: coord.lat,
            longitude: coord.lng,
          });
        };
        map.addEventListener('tap', handleTap);
        return function() {
          map.removeEventListener('tap', handleTap);
        };
      }
    });

    return location;
  }

  function useWindowSize() {
    useEffect(function() {
      const handleResize = function() {
        if (map && map.getViewPort()) {
          map.getViewPort().resize();
        }
      };
      window.addEventListener('resize', handleResize);

      return function() {
        window.removeEventListener('resize', handleResize);
      };
    });
  }
});

function enableMapEvents(map) {
  new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
}
