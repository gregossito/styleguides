'use strict';

require('mapbox.js');
require('leaflet-sleep');

$(document).ready(function(){
  // Define API access token
  L.mapbox.accessToken = Paris.config.mapbox.accessToken;

  // Dynamically add CSS
  if ($('.component-map-map').length) {
    $('head').append('<link href="https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.css" rel="stylesheet" />');
  }
});
