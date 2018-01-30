'use strict';

var Paris = window.Paris || {};

var L = require('leaflet');
require('leaflet-sleep');

Paris.map = (function(){

  var defaultOptions = {
    lat: Paris.config.leaflet.defaultCenter.lat,
    lon: Paris.config.leaflet.defaultCenter.lon,
    zoom: 15
  };

  function map(selector, userOptions){
    var $el = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      $map,
      map,
      defaultHeight,
      marker,
      icon;

    function init(){
      $map = $el.find('.component-map-map');

      map = L.map($map.get(0), {
        center: [options.lat, options.lon],
        minZoom: Paris.config.leaflet.minZoom,
        maxBounds: Paris.config.leaflet.maxBounds,
        hoverToWake: false,
        sleepNote: false,
        sleepOpacity: 1,
        sleepTime: 750,
        wakeTime: 1000,
        zoom: options.zoom
      });

      defaultHeight = $el.outerHeight();

      icon = L.icon({
        iconUrl: '../../modules/block-map/ico-nef-open.svg',
        iconSize: [49, 55],
        iconAnchor: [19, 54],
        popupAnchor: [5, -45]
      });

      L.tileLayer(Paris.config.leaflet.tileLayer, {
        attribution: Paris.config.leaflet.tileLayerAttribution
      }).addTo(map);

      addMarker();
    }

    function initOptions(){
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function addMarker(){
      marker = L.marker([options.lat, options.lon], {
        icon: icon
      }).addTo(map);
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
