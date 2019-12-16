'use strict';
import toExternalLocation from '../locationConverter';

const SearchRange = function(userLocation, ...args) {
  args.unshift(toExternalLocation(userLocation));
  window.H.map.Circle.apply(this, args);
  this.setStyle({
    fillColor: 'rgba(0, 0, 128, 0.1)',
  });
};
SearchRange.prototype = Object.create(window.H.map.Circle.prototype);
SearchRange.prototype.constructor = SearchRange;

export default SearchRange;
