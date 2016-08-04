'use strict';

// Load Mapbox dependency
var mapboxgl = require('mapbox-gl');

var Paris = window.Paris || {};

Paris.blockMap = (function(){

  var defaultOptions = {
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 11,
    minZoom: 10,
    center: [2.349272, 48.856579],
    maxBounds:
      [
       [2.021942, 48.731991], // SW coordinates
       [2.698162, 48.985029]  // NE coordinates
     ]
  };

  function blockMap(selector, userOptions){
    var $el     = $(selector),
        options = $.extend({}, defaultOptions, userOptions)

    function init(){
      initOptions();
      initMap();

      console.log(options);
    }

    function initOptions(){
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function initMap(){
      // TODO: Insert key into a config file?
      mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaXNudW1lcmlxdWUiLCJhIjoiY2loZG1vMnYyMDAzNnY0a3FvNG1nNG55biJ9.MP1qcHkEecFGqSTs9gg7cw';

      var mapOptions = {
        container: $el.attr('id')
      };
      $.extend(mapOptions, defaultOptions);
      var map = new mapboxgl.Map(mapOptions);

      // Add navigation and geolocate map
      map.addControl(new mapboxgl.Navigation());
      map.addControl(new mapboxgl.Geolocate());

    }

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      blockMap(this, userOptions);
    });
  };

})();

$(document).ready(function() {
  console.log("Scrip for block-map ready");
  // Mapbox expect only dom elements with an ID, do not pass a class name.
  Paris.blockMap('#map');
});
