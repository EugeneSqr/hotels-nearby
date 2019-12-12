import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'cross-fetch';
import {getMapApiKey} from './apiKeyProvider';
import 'here-js-api/scripts/mapsjs-core';
import 'here-js-api/scripts/mapsjs-service';
import './styles.less';

fetch('//ip-api.com/json').then(function(result) {
  return result.json();
}).then(function(res) {
  console.log(getMapApiKey());
  console.log(res);
});
ReactDOM.render(
  (<React.Fragment>
    <h1>I AM HERE!</h1>
  </React.Fragment>),
  document.getElementById('root'),
);
