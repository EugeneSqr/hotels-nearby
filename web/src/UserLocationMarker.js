'use strict';
import toMapLocation from './mapLocation';
import {
  UserMarker,
} from './mapObjects';

export default function UserLocationMarker({location, map}) {
  if (!location || !map) {
    return null;
  }

  const marker = getUserLocationMarker(map);
  if (marker) {
    map.removeObject(marker);
  }

  map.addObject(new UserMarker(toMapLocation(location)));
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
