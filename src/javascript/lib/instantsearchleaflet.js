// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

Paris.instantsearch = Paris.instantsearch || {widgets: {}};

var leaflet = require('leaflet');
require('leaflet.markercluster');

/**
 * Instantsearch Mapbox widget
 */

var map,
  settings,
  geoJSON = {
    'type': 'FeatureCollection',
    'features': []
  },
  geojsonLayer,
  markers;

var defaults = {
  map: {
    center: [Paris.config.search.paris_coordinates.lat, Paris.config.search.paris_coordinates.lng],
    sleep: false,
    zoom: 12,
    maxZoom: 18
  }
};

 // instantsearch.js custom widget with plain JavaScript
 // First, we add ourselves to the instantsearch.widgets namespace
Paris.instantsearch.widgets.leaflet = function leaflet(options) {
  return {
    // getConfiguration: function() {
    //   // must return an helper configuration object, like the searchParameters
    //   // on the instantsearch constructor
    //   return {};
    // },
    init: function(params) {
      // params contains three keys:
      //   - helper: to modify the search state and propagate the user interaction
      //   - state: which is the state of the search at this point
      //   - templatesConfig: the configuration of the templates

      settings = $.extend(true, {}, defaults, options);
      initMap(options.container);
    },
    render: function(params) {
      // params contains four keys:
      //   - results: the results from the last request
      //   - helper: to modify the search state and propagate the user interaction
      //   - state: the state at this point
      //   - createURL: if the url sync is active, will make it possible to create new URLs

      // Convert results to geoJSON and render
      geojson = hitsToGeoJSON(params.results.hits);
      renderMap();
    }
  };
};

/**
 * Init Leaflet into container and set it up
 * @param  {String | DOM Element}
 */
function initMap(container){
  map = L.map('map', settings.map);

  L.tileLayer('http://filer.paris.fr/leaflet/paris2/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

/**
 * Display pin on the map based on current geoJSON
 */
function renderMap() {

  if (map.hasLayer(markers)) {
    map.removeLayer(markers);
  }

  markers = L.markerClusterGroup();
  geojsonLayer = L.geoJSON(geojson);

  markers.addLayer(geojsonLayer);
  map.fitBounds(markers.getBounds());

  map.addLayer(markers);
}

/**
 * Helper method to create a geoJSON format object based on instantsearch hits
 * @param  {Object} Instantsearch hits
 * @return {[geoJSON]} geoJSON formated object
 */
function hitsToGeoJSON(hits) {

  // Abort when no hits
  if (!hits || (hits && hits.length == 0)) {
    geoJSON.features = [];
    return geoJSON;
  }

  var features = [];
  // For each hits return by instantsearch create its geoJson object
  hits.forEach(function(hit) {
    var feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [hit._geoloc.lng, hit._geoloc.lat]
      },
      properties: {}
    };
    // Store hit in properties
    $.extend(feature.properties, hit);
    features.push(feature);
  });

  geoJSON.features = features;
  return geoJSON;
}
