'use strict';
import toMapLocation from './mapLocation';

export default function UserLocationMarker({location, map}) {
  if (!location || !map) {
    return null;
  }

  const marker = getUserLocationMarker(map);
  if (marker) {
    map.removeObject(marker);
  }

  map.addObject(createUserLocationMarker(map, location));
  return null;
}

function getUserLocationMarker(map) {
  const objects = map.getObjects();
  for (let i = 0; i < objects.length; ++i) {
    if (objects[i] instanceof UserMarker) {
      return objects[i];
    }
  }
}

function createUserLocationMarker(map, location) {
  const icon = new window.H.map.Icon('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="#0260e8" d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>');
  return new UserMarker(toMapLocation(location), {icon});
}

const UserMarker = function(...args) {
  window.H.map.Marker.apply(this, args);
};
UserMarker.prototype = Object.create(window.H.map.Marker.prototype);
UserMarker.prototype.constructor = UserMarker;
