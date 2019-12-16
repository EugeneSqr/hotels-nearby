'use strict';
import React from 'react';

export default React.memo(function HotelDetailsPhone({website}) {
  if (!website) {
    return null;
  }

  return (<dl className='contact'>
    <dt className='label'>Website</dt>
    <dd className='value'>
      <a href={website} rel="noopener noreferrer" target='_blank'>{website}</a>
    </dd>
  </dl>);
});
