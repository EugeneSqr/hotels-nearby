'use strict';
import React from 'react';

export default React.memo(function HotelDetailsEmail({email}) {
  if (!email) {
    return null;
  }

  return (<dl className='contact'>
    <dt className='label'>Email</dt>
    <dd className='value'><a href={`mailto:${email}`}>{email}</a></dd>
  </dl>);
});
