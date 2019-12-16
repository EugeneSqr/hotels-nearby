'use strict';
import userMarkerIcon from '../img/user-marker.png';

const UserMarker = function(...args) {
  window.H.map.Marker.apply(this, args);
  const icon = new window.H.map.Icon(userMarkerIcon);
  this.setIcon(icon);
};
UserMarker.prototype = Object.create(window.H.map.Marker.prototype);
UserMarker.prototype.constructor = UserMarker;

export default UserMarker;
