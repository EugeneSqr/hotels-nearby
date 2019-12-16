'use strict';
import React from 'react';

export default React.memo(function HotelDetailsPhone({phone}) {
  if (!phone) {
    return null;
  }

  return (<dl className='contact'>
    <dt className='label'>Phone</dt>
    <dd className='value'>{phone}</dd>
  </dl>);
});
