// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

Paris.instantsearch = {widgets: {}};

var mapboxgl = require('mapbox-gl');

/**
 * Instantsearch Mapbox widget
 */

var _this,
  map,
  settings,
  helper,
  userMarker,
  lastPopup,
  geolocate,
  skipRefine = false,
  resizing = false,
  layersID = [],
  geoJSON = {
    'type': 'FeatureCollection',
    'features': []
  },
  // Ref for drag tolerance
  pointCoordinate,
  lastTouchMove,
  offsetTolerance = 85,
  cumulativeOffset = {
    x: 0,
    y: 0
  };

var userMarkerEl = document.createElement('div');
userMarkerEl.innerHTML = '<span class="mapbox-gl-user-marker"></span>';

/**
 * Widget options
 * @param {String} mapBoxAccessToken Mapbox access token. Mandatory.
 * @param {Object} mapbox Mapbox API options. See Mapbox documentation for more details.
 * @param {Object} cluster Cluster options.
 * @param {Bool} cluster.cluster Enable cluster.
 * @param {Int} cluster.clusterMaxZoom The maximum zoom level to cluster points in.
 * @param {Int} cluster.clusterRadius The radius of each cluster when clustering points, measured in pixels.
 * @param {String} templates.markerIconImage The marker string of the mapbox style.
 * @param {Elem} templates.userMarkerEl Dom element used for showing user's position.
 * @param {[String]} templates.cluster.textFont Array of font for cluster text
 * @param {String} templates.cluster.textColor Color of text for cluster
 * @param {Int} templates.cluster.textSize Size of text for cluster
 * @param {Color} templates.cluster.circleColor The color of the circle.
 * @param {Int} templates.cluster.circleRadiusStops Stops of circle radius.
 * @param {Int} templates.cluster.circleRadiusBase Base for stops.
 * @param {Function} openedHit Function called when a hit has been opened on map. Useful to update some UI.
 * @param {Function} popupHTMLForHit Function called to retrieve html to display when a hit is opened
 */
var defaults = {
  mapBoxAccessToken: 'YOUR-ACCESS-TOKEN',
  mapbox: {},
  cluster: {
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  },
  templates: {
    markerIconImage: 'marker',
    userMarkerEl: userMarkerEl,
    cluster: {
      textFont: [
        'DIN Offc Pro Medium',
        'Arial Unicode MS Bold'
      ],
      textColor: '#fff',
      textSize: 12,
      circleColor: '#0C518A',
      circleRadiusStops: [
        [1, 15],
        [100, 35],
      ],
      circleRadiusBase: 0.95
    }
  },
  openedHit: function() {},
  popupHTMLForHit: function(hit) {},
};


// instantsearch.js custom widget with plain JavaScript
// First, we add ourselves to the instantsearch.widgets namespace
Paris.instantsearch.widgets.mapbox = function mapbox(options) {
  
  return {
    // getConfiguration: function(configuration) {
      // return {
      //  hitsPerPage : 100
      // }
    // },
    init: function(params) {
      _this = this;
      helper = params.helper;
      initOptions(options);
      initMap(options.container);
    },
    render: function(params) {
      if (lastPopup && !skipRefine) {
        lastPopup.remove();
      }

      // Convert results to geoJSON and render
      geoJSON = hitsToGeoJSON(params.results.hits);
      renderMap(geoJSON, 'searchHits');
    },
    // Used for example to open a hit from a list outside the map
    openHit: function(html, coordinates, hitID) {
      skipRefine = true;
      map.flyTo({
        center: coordinates,
        zoom: settings.cluster.clusterMaxZoom + 1,
        curve: 1.2
      });
      showPopup(html, coordinates);
      settings.openedHit(hitID);
    },
    flyTo: function(coordinates) {
      map.flyTo({
        center: coordinates,
        zoom: settings.cluster.clusterMaxZoom,
        curve: 1.2
      });
    },
    removePopup: function() {
      if (lastPopup) {
        lastPopup.remove();
      }
    },
    zoomOut: function() {
      map.zoomOut();
    },
    geolocate: function() {
      geolocate._onClickGeolocate();
    }
  };
};

/**
 * @param  {Object} Options passed by user
 */
function initOptions(options) {
  settings = $.extend(true, {}, defaults, options);
}

/**
 * Init Mapbox into container and set it up
 * @param  {String | DOM Element}
 */
function initMap(container) {

  // Get Mapbox user access token
  var accessToken = settings.mapBoxAccessToken;
  if (accessToken == defaults.mapBoxAccessToken) {
    throw 'You need to pass your Mapbox access token';
  }
  mapboxgl.accessToken = accessToken;
  settings.mapbox.container = document.querySelector(container).getAttribute('id');

  map = new mapboxgl.Map(settings.mapbox);

  // Once ready load sources and layers
  map.on('load', function () {
    renderMap(geoJSON, 'searchHits');
  });

  //Add map navigation and geolocate controls
  map.addControl(new mapboxgl.Navigation());
  geolocate = new mapboxgl.Geolocate();
  map.addControl(geolocate);

  // Use this callback to show a marker at user's position
  geolocate.on('geolocate', function(e) {
    // add marker to map
    if(!userMarker) {
      userMarker = new mapboxgl.Marker(settings.templates.userMarkerEl);
      userMarker.setLngLat([e.coords.longitude, e.coords.latitude]);
      userMarker.addTo(map);
    }
    // update marker position each time
    userMarker.setLngLat([e.coords.longitude, e.coords.latitude]);
    // We can only have search send once with aroundLatLng since it's not working with insideBoundingBox
    helper
      .setQueryParameter('aroundLatLng', e.coords.latitude+','+e.coords.longitude)
      .search()
      .setQueryParameter('aroundLatLng', undefined);
  });

  // When a click event occurs near a place, open a popup at the location of
  // the feature, with description HTML from its properties.
  map.on('click', function (e) {

    var features = map.queryRenderedFeatures(e.point, { layers: layersID });
    if (!features.length) {
      return;
    }

    var feature = features[0];

    // Zoom cluster
    if (feature.properties.cluster) {
      skipRefine = true;
      map.flyTo({
        center: feature.geometry.coordinates,
        zoom: settings.cluster.clusterMaxZoom + 1,
        curve: 1.2
      });
    // Open hit
    } else {
      var html = settings.popupHTMLForHit(feature.properties);
      showPopup(html, feature.geometry.coordinates); 
      settings.openedHit(feature.properties.idequipements);
    }
  });

  // Trigger search based on map bounds when user moves map
  map.on('moveend', function (e) {
    // /!\ This fix a bug with Flickyity carousel which does not support dom changes once intiated. So we avoid triggering search upon window resizing.
    if (resizing) {
      return;
    }

    // Search on move is disable
    if (!$('input[name="map-refresh"]').is(':checked')) {
      return;
    }

    // For some scenario we skip launching geo based request (drag tolerance, or programmatic movement, ...)
    if (skipRefine) {
      skipRefine = false;
      return;
    }

    var bounds = map.getBounds();
    helper
      .setQueryParameter('insideBoundingBox', bounds._sw.lat+','+bounds._sw.lng+','+bounds._ne.lat+','+bounds._ne.lng)
      .search();
  });

  // Indicate that the symbols are clickable by changing the cursor style to 'pointer'.
  map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: layersID });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });

  // Touch and mouse event to handle drag tolerance of map. Unfortunatly in JS mouse and touch does not behave the same.

  // When start mouse drag store pointer coordinates
  map.on('mousedown', function (e) {
    pointCoordinate = {
      x: e.point.x, 
      y: e.point.y
    };
  });

  // Calculate the distance made by the cursor
  map.on('mouseup', function (e) {

    var offsetX = Math.abs((pointCoordinate.x - e.point.x)) + cumulativeOffset.x;
    var offsetY = Math.abs((pointCoordinate.y - e.point.y)) + cumulativeOffset.y;
    cumulativeOffset.x = offsetX;
    cumulativeOffset.y = offsetY;

    handleTolerance();
  });

  // When start touch store touch original coordinates
  map.on('touchstart', function (e) {
    lastTouchMove = e;
    pointCoordinate = {
      x: e.originalEvent.touches[0].pageX, 
      y: e.originalEvent.touches[0].pageY
    };
  });

  // Becauce the event touchend does not have point x,y of touch... we store the last touch recorded
  map.on('touchmove', function (e) {
    lastTouchMove = e;
  });

  // Calculate the distance made by the touch
  map.on('touchend', function (e) {
    var offsetX = Math.abs((pointCoordinate.x - lastTouchMove.originalEvent.touches[0].pageX)) + cumulativeOffset.x;
    var offsetY = Math.abs((pointCoordinate.y - lastTouchMove.originalEvent.touches[0].pageY)) + cumulativeOffset.y;
    cumulativeOffset.x = offsetX;
    cumulativeOffset.y = offsetY;

    handleTolerance();
  });

  // Search is based on map bounds all the time except when user type in a text in search field or search is around lat long
  helper.on('change', function(state, lastResults) {
    if ((state.query && (lastResults.query != state.query)) || helper.getQueryParameter('aroundLatLng')) {
      // Clear geoloc param right after launching request
      helper.setQueryParameter('insideBoundingBox', undefined);
    } else {
      var bounds = map.getBounds();
      helper.setQueryParameter('insideBoundingBox', bounds._sw.lat+','+bounds._sw.lng+','+bounds._ne.lat+','+bounds._ne.lng);
    }
  });

  // /!\ This fix a bug with Flickyity carousel which does not support dom changes once intiated. So we avoid triggering search upon window resizing.
  var windowTimer;
  $( window ).resize(function() {
    resizing = true;
    clearTimeout(windowTimer);
    windowTimer = setTimeout(windowDoneResizing, 100);
  });

  function windowDoneResizing() {
    resizing = false;
  }

}

/**
 * Display a popup on the map
 * @param  {String} html        Html to show
 * @param  {[Coordinates]} coordinates Point coordinates
 */
function showPopup(html, coordinates) {
  if (lastPopup) {
    lastPopup.remove();
  }

  if (!html) {
    return;
  }

  var popup = new mapboxgl.Popup({
    closeButton: false
  });
  popup.on('close', function(e) {
    $('.card').removeClass('active');
  });

  // To help some binding element
  var htmlWrapper = '<div class="map-popup">'+html+'</div>';

  popup.setLngLat(coordinates)
    .setHTML(htmlWrapper)
    .addTo(map);
  lastPopup = popup;
}

/**
 * Set skip if drag is tolerated by map
 */
function handleTolerance() {
  if (cumulativeOffset.x > offsetTolerance || cumulativeOffset.y > offsetTolerance) {
    cumulativeOffset.x = 0;
    cumulativeOffset.y = 0;
  } else {
    skipRefine = true;
  }
}

/**
 * Display pin on the map based on given geoJSON
 * @param  {geoJSON Object} Data of points to display on the map
 * @param  {String} Source id for mapbox
 */
function renderMap(geoJSON, sourceID) {

  var clusterCountID = 'cluster-count-'+sourceID;

  var mapSource = map.getSource(sourceID);
  if (!mapSource) {

    // Add source
    map.addSource(sourceID, {
      type: 'geojson',
      data: geoJSON,
      cluster: settings.cluster.cluster,
      clusterMaxZoom: settings.cluster.clusterMaxZoom,
      clusterRadius: settings.cluster.clusterRadius
    });

    // Circle for clustering with dynamic radius
    var clusterCircleID = 'cluster-circle';
    map.addLayer({
      id: clusterCircleID,
      type: 'circle',
      source: sourceID,
      paint: {
        'circle-color': settings.templates.cluster.circleColor,
        'circle-radius': {
          property: 'point_count',
          base: settings.templates.cluster.circleRadiusBase,
          stops: settings.templates.cluster.circleRadiusStops
        }
      },
      filter: ['>', 'point_count', 1]
    });
    layersID.push(clusterCircleID);

    // Add a layer for the clusters' count labels
    map.addLayer({
      id: clusterCountID,
      type: 'symbol',
      source: sourceID,
      paint: {
        'text-color': settings.templates.cluster.textColor
      },
      layout: {
        'text-field': '{point_count}',
        'text-font': settings.templates.cluster.textFont,
        'text-size': settings.templates.cluster.textSize
      },
      filter: ['>', 'point_count', 1]
    });
  } else {
    mapSource.setData(geoJSON);
  }


  geoJSON.features.forEach(function(feature) {
    var symbol = feature.properties.icon;
    var layerID = 'marker-' + symbol;

    // Add a layer for this symbol type if it hasn't been added already.
    if (!map.getLayer(layerID)) {
      // Add layer for unclestered points
      map.addLayer({
        id: layerID,
        type: 'symbol',
        source: sourceID,
        layout: {
          // TODO: Dynamic image
          'icon-image': 'marker-'+15
          // Icons must be added into Mapbox editor as SVG file
          // To export SVG from Illustrator:
          //// File > Export
          //// Name: 'ico-category-state.svg'
          //// Stylisation: Presentation attributes
          //// Responsive: unchecked
        },
        filter: ["==", "icon", symbol]
      });
      layersID.push(layerID);
    }
  });
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
      properties: {
        // TODO Activate dynamic icons
        // icon: hit.idcategories[0]
        icon: 15
      }
    };
    // Store hit in properties
    $.extend(feature.properties, hit);
    features.push(feature);
  });

  geoJSON.features = features;
  return geoJSON;
}