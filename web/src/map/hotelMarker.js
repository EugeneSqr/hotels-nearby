'use strict';
import toExternalLocation from '../locationConverter';
import hotelMarkerIcon from '../img/hotel-marker.png';

const HotelMarker = function(hotel, ...args) {
  args.unshift(toExternalLocation(hotel));
  window.H.map.Marker.apply(this, args);
  this.hotelId = hotel.id;
  this.hotelContext = hotel.context;
  this.setIcon(new window.H.map.Icon(hotelMarkerIcon));
};
HotelMarker.prototype = Object.create(window.H.map.Marker.prototype);
HotelMarker.prototype.constructor = HotelMarker;

export default HotelMarker;
