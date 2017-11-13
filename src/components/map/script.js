'use strict';

var Paris = window.Paris || {};

Paris.map = (function(){

  var defaultOptions = {
    lat: Paris.config.mapbox.defaultCenter.lat,
    lon: Paris.config.mapbox.defaultCenter.lon,
    zoom: 15,
    geojson: false // URL of the GeoJSON to display on the map
  };

  function map(selector, userOptions){
    var $el = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      $map,
      map,
      defaultHeight,
      featureLayer;

    function init(){
      $map = $el.find('.component-map-map');

      map = L.mapbox.map($map.get(0), null, {
        center: [options.lat, options.lon],
        hoverToWake: false,
        sleepNote: false,
        sleepOpacity: 1,
        sleepTime: 750,
        wakeTime: 1000,
        zoom: options.zoom
      });

      defaultHeight = $el.outerHeight();

      // Add custom style tiles
      L.mapbox.styleLayer(Paris.config.mapbox.styleLayer).addTo(map);

      featureLayer = L.mapbox.featureLayer(null, {
        sanitizer: function(data){return data;} // prevent from removing href
      }).addTo(map);

      addMarker();
    }

    function initOptions(){
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function addMarker(){
      featureLayer.setGeoJSON({
        // this feature is in the GeoJSON format: see geojson.org
        // for the full specification
        type: 'Feature',
        geometry: {
          type: 'Point',
          // coordinates here are in longitude, latitude order because
          // x, y is the standard for GeoJSON and many formats
          coordinates: [options.lon, options.lat]
        },
        properties: {
          'marker-size': 'large',
          'marker-color': options.color || '#0C518A'
        }
      });
    }

    initOptions();
    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      map(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.map('.component-map');
});
