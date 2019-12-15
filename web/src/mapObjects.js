'use strict';
import hotelMarkerIcon from './img/hotel-marker.png';
import userMarkerIcon from './img/user-marker.png';

const UserMarker = function(...args) {
  window.H.map.Marker.apply(this, args);
  const icon = new window.H.map.Icon(userMarkerIcon);
  this.setIcon(icon);
};
UserMarker.prototype = Object.create(window.H.map.Marker.prototype);
UserMarker.prototype.constructor = UserMarker;

const HotelMarker = function(...args) {
  window.H.map.Marker.apply(this, args);
  const icon = new window.H.map.Icon(hotelMarkerIcon);
  this.setIcon(icon);
};
HotelMarker.prototype = Object.create(window.H.map.Marker.prototype);
HotelMarker.prototype.constructor = HotelMarker;

const SearchRange = function(...args) {
  window.H.map.Circle.apply(this, args);
  this.setStyle({
    fillColor: 'rgba(0, 0, 128, 0.1)',
  });
};
SearchRange.prototype = Object.create(window.H.map.Circle.prototype);
SearchRange.prototype.constructor = SearchRange;

export {
  UserMarker,
  HotelMarker,
  SearchRange,
};
