'use strict';
import toExternalLocation from '../locationConverter';
import UserMarker from './userMarker';

export default function UserLocationMarker({location, map}) {
  if (!location || !map) {
    return null;
  }

  const marker = getUserLocationMarker(map);
  if (marker) {
    map.removeObject(marker);
  }

  map.addObject(new UserMarker(toExternalLocation(location)));
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
