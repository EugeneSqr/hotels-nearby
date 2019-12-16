'use strict';
import React from 'react';
import HotelDetailsPhone from './HotelDetailsPhone';
import HotelDetailsEmail from './HotelDetailsEmail';
import HotelDetailsWebsite from './HotelDetailsWebsite';

export default React.memo(function HotelDetails({selectedHotel}) {
  if (!selectedHotel) {
    return null;
  }

  return (<div id='hotel-details-panel'>
    <div className='name'>{selectedHotel.name}</div>
    <div className='address'>{selectedHotel.address}</div>
    <HotelDetailsPhone phone={selectedHotel.phone} />
    <HotelDetailsEmail email={selectedHotel.email} />
    <HotelDetailsWebsite website={selectedHotel.website} />
  </div>);
});
