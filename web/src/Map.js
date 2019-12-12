'use strict';
import React, {useEffect} from 'react';
import {getMapApiKey} from './apiKeys';
import getCurrentLocation from './currentLocation';

export default function Map() {
  let map;
  const mapRef = React.createRef();
  const style = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  };

  useEffect(function() {
    let resizeTimer;
    const handleResize = function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        map.getViewPort().resize();
      }, 300);
    };
    window.addEventListener('resize', handleResize);

    return function() {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(function() {
    getCurrentLocation().then(function(currentLocation) {
      map = drawMap(mapRef.current, currentLocation);
    });
  });

  return (<div ref={mapRef} style={style}></div>);
}

function drawMap(container, currentLocation) {
  const defaultZoomLevel = 10;
  const platform = new window.H.service.Platform({
    'apikey': getMapApiKey(),
  });
  const defaultLayers= platform.createDefaultLayers();
  const map = new window.H.Map(
    container,
    defaultLayers.vector.normal.map, {
      zoom: defaultZoomLevel,
      center: {
        lng: currentLocation.longitude,
        lat: currentLocation.latitude,
      },
    });
  window.H.ui.UI.createDefault(map, defaultLayers);
  return map;
}
