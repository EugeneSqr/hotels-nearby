'use strict';
import React, {useEffect, useState} from 'react';
import {getMapApiKey} from './apiKeys';
import toMapLocation from './mapLocation';
import UserLocationMarker from './UserLocationMarker';
import NearbyHotelMarkers from './NearbyHotelMarkers';

export default function Map({center}) {
  if (!center) {
    return null;
  }

  const mapRef = React.createRef();
  const style = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  };

  const map = useMap();
  const location = useLocation();
  useWindowSize();

  return (
    <div ref={mapRef} style={style}>
      <UserLocationMarker location={location} map={map} />
      <NearbyHotelMarkers userLocation={location} map={map} />
    </div>
  );

  function useMap() {
    const [map, setMap] = useState();
    useEffect(function() {
      if (!map && center) {
        const defaultZoomLevel = 10;
        const platform = new window.H.service.Platform({
          'apikey': getMapApiKey(),
        });
        const defaultLayers= platform.createDefaultLayers();
        const newMap = new window.H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map, {
            zoom: defaultZoomLevel,
            center: toMapLocation(center),
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
}

function enableMapEvents(map) {
  new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
}
