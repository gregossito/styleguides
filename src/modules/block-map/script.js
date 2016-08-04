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

      // Set map options and init map
      var mapOptions = {
        container: $el.attr('id')
      };
      $.extend(mapOptions, defaultOptions);
      var map = new mapboxgl.Map(mapOptions);

      // Add map navigation and geolocate controls
      map.addControl(new mapboxgl.Navigation());
      map.addControl(new mapboxgl.Geolocate());

      // On map load
      map.on('load', function() {

        // Create markers
        map.addSource("places", {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [2.349282, 48.846579]
              },
              "properties": {
                "title": "Petit point 01",
                "address": "131 rue de Fontenay 75001 Paris",
                "icon": "marker"
              }
            }, {
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [2.339282, 48.843579]
              },
              "properties": {
                "title": "Petit point 02",
                "address": "132 rue Diderot 75002 Paris",
                "icon": "marker"
              }
            }]
          },
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });
        
        // Add markers layer
        map.addLayer({
          "id": "places",
          "type": "symbol",
          "source": "places",
          "layout": {
            "icon-image": "{icon}-15"
          }
        });

        // When a click event occurs near a place, open a popup at the location of
        // the feature, with description HTML from its properties.
        map.on('click', function (e) {
          var features = map.queryRenderedFeatures(e.point, { layers: ['places'] });

          if (!features.length) {
            return;
          }

          var feature = features[0];

            // Populate the popup and set its coordinates
            // based on the feature found.
            var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML('<div class="card-content"><h3 class="card-title">'+feature.properties.title+'</h3><div class="card-text">'+feature.properties.address+'</div><div class="card-hours open">Ouvert jusqu’à 21h</div></div>')
            .addTo(map);
          });

        // Use the same approach as above to indicate that the symbols are clickable
        // by changing the cursor style to 'pointer'.
        map.on('mousemove', function (e) {
          var features = map.queryRenderedFeatures(e.point, { layers: ['places'] });
          map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        });

        // Display the earthquake data in three layers, each filtered to a range of
        // count values. Each range gets a different fill color.
        var layers = [
          [150, '#f28cb1'],
          [20, '#f1f075'],
          [0, '#51bbd6']
        ];

        layers.forEach(function (layer, i) {
          map.addLayer({
            "id": "cluster-" + i,
            "type": "circle",
            "source": "places",
            "paint": {
              "circle-color": layer[1],
              "circle-radius": 18
            },
            "filter": i === 0 ?
              [">=", "point_count", layer[0]] :
                ["all",
                [">=", "point_count", layer[0]],
                ["<", "point_count", layers[i - 1][0]]]
          });
        });

        // Add a layer for the clusters' count labels
        map.addLayer({
          "id": "cluster-count",
          "type": "symbol",
          "source": "places",
          "layout": {
            "text-field": "{point_count}",
            "text-font": [
              "DIN Offc Pro Medium",
              "Arial Unicode MS Bold"
            ],
            "text-size": 12
          }
        });
      });
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
