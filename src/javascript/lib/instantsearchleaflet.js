// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

Paris.instantsearch = Paris.instantsearch || {widgets: {}};

var L = require('leaflet');
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
    minZoom: Paris.config.leaflet.minZoom,
    maxBounds: Paris.config.leaflet.maxBounds,
    sleep: false,
    zoom: 12,
    maxZoom: 18
  },
  markerClusterGroup: {
    showCoverageOnHover: false
  },
  popupHTMLForHit: function(hit) {},
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
      initMap(settings.container);
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
    },
    // Used for example to open a hit from a list outside the map
    openHit: function(html, coordinates, hitID) {
      map.flyTo(coordinates, 17);
      showPopup(html, coordinates);
      // settings.openedHit(hitID);
    },
    flyTo: function(coordinates) {
      map.flyTo(coordinates, 16);
    },
  };
};

/**
 * Init Leaflet into container and set it up
 * @param  {String | DOM Element}
 */
function initMap(container){
  map = L.map('map', settings.map);

  L.tileLayer(Paris.config.leaflet.tileLayer, {
    attribution: Paris.config.leaflet.tileLayerAttribution
  }).addTo(map);
}

/**
 * Display pin on the map based on current geoJSON
 */
function renderMap() {
  if (map.hasLayer(markers)) {
    map.removeLayer(markers);
  }

  markers = L.markerClusterGroup(settings.markerClusterGroup);
  geojsonLayer = L.geoJSON(geojson, {
    pointToLayer: function(point, latlng) {
      var layer = L.marker(latlng, {
        icon: getIconForPoint(point)
      });
      var popupHTML = settings.popupHTMLForHit(point.properties);
      layer.bindPopup(popupHTML);
      return layer;
    }
  });

  markers.addLayer(geojsonLayer);
  // map.fitBounds(markers.getBounds());

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

function getIconForPoint(feature) {
  var symbol = feature.properties.icon || "nef";
  var state = "unknown";
  if (feature.properties.is_open === true) {
    state = "open";
  } else if (feature.properties.is_open === false) {
    state = "closed";
  }
  var iconName = 'ico-' + symbol + '-' + state;
  var icon = L.icon({
    iconUrl: '../../modules/block-map/' + iconName + '.svg',
    iconSize: [49, 55],
    iconAnchor: [19, 54],
    popupAnchor: [5, -45]
  });
  return icon;
}

/**
 * Display a popup on the map
 * @param  {String} html        Html to show
 * @param  {[Coordinates]} coordinates Point coordinates
 */
function showPopup(html, coordinates) {
  if (!html) return;

  var popup = L.popup({
    offset: [5, -40]
  }).setLatLng(coordinates)
    .setContent(html);

  map.once("zoomend", function(){
    map.openPopup(popup);
  });
}
