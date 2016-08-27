// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

Paris.instantsearch = {widgets: {}};

// See more details in the documentation:
// https://community.algolia.com/instantsearch.js/documentation/#custom-widgets

// Extending the instantsearch.widgets namespace, like regular widgets
// TODO: All html generated code could be a Paris module
Paris.instantsearch.widgets.refinementList = function refinementList({
  container, // DOM selector in which to add UI
  attributeName, // Attribute name for facets
  operator, // Facets operator
  sortBy, // Facet ordering
  numberOfFacets, // Expected number of facets (displayed in popup)
  moreButtonText, // Text for more facets button
  applyButtonText, // Text for apply facets button
  mainFacets // Main facets filter
}) {
  var helper;
  // Store all facets values
  var facets = [];
  // Internal selector ID for facet list html rendering
  var wrapperSelectorID = 'facet-list-wrapper';
  // Base HTML code for popup
  var popupHTML = '<div class="block-search-filters-popup"><div class="popup-background"></div><div class="popup-content"></div></div>';
  var options = {
    mobileMediaQuery: window.matchMedia("(max-width: 767px)")
  };

  return {

    getConfiguration(configuration) {
      var widgetConfiguration = {
        [operator === 'and' ? 'facets' : 'disjunctiveFacets']: [attributeName]
      };

      var currentMaxValuesPerFacet = configuration.maxValuesPerFacet || 0;
      widgetConfiguration.maxValuesPerFacet = Math.max(currentMaxValuesPerFacet, mainFacets.length);

      return widgetConfiguration;
    },

    // Initiate widget
    init({helper}) {

      this.helper = helper;

      // Bind filter button event
      $(container).on('click', '.filterButton', this.onClickButton.bind(this));
      $(container).on('click', '.apply-filters-button', this.onClickApplyButton.bind(this));

      var _this = this;

      // Trigger a fake search request just to retrieve all available facets
      helper.searchOnce({
        hitsPerPage: 1,
        // hierarchicalFacets: [{
        //   name: attributeName,
        //   attributes: [attributeName]
        // }],
        maxValuesPerFacet: numberOfFacets
      },
        function(error, content, state) {
          // Store all possible facets values (We don't store the facet object because we need to simplify some array object search)
          $.each(content.getFacetValues(attributeName, {sortBy}), function(i, facet) {
            facets.push(facet.name);
          });

          _this.orderFacets();

          // Init filter view
          _this.initView();
          _this.initSearchFiltersPopupEvents();
        }
      );

      // Use change event to detect facets reseting action
      helper.on('change', function(state, lastResults) {
        var refinementCount = 0;
        if (operator === 'and') {
          refinementCount = state.facetsRefinement[attributeName] ? state.facetsRefinement[attributeName].length : 0;
        } else {
          refinementCount = state.disjunctiveFacetsRefinements[attributeName] ? state.disjunctiveFacetsRefinements[attributeName].length : 0;
        }
        if (refinementCount == 0 && $(container + ' .filterButton.active').length > 0) {
          _this.renderList([]);
        }
      });
    },

    // Called whenever we receive new results from Algolia. This widget does not render anything after each search
    render({results}) {
      // Nothing to re-render
    },

    // Handle facet click action
    onClickButton(e) {
      e.preventDefault();
      // Find the button DOM element
      var $this = $(e.target).closest('.button');
      // Toggle the button
      $this.toggleClass('active');

      // Toggle facet and force new search request
      this.helper.toggleRefinement(attributeName,$this.text());

      if (!options.mobileMediaQuery.matches) {
        this.helper.search();
      }
    },

    onClickApplyButton(e) {
      this.helper.search();
      $(e.target).closest('.layout-content-list').removeClass('searching');
    },

    orderFacets() {
      // Clean not valid facets passed as parameters
      mainFacets = $.grep(mainFacets, function(n, i) {
        return $.inArray(n, facets) >= 0;
      });
      // Remove duplicate between mainfacets and facets
      facets = $.grep(facets, function(n, i) {
        return $.inArray(n, mainFacets) < 0;
      });
      // Merge into a unique array with mainFacets at the beginninf of the arry
      facets = $.merge($.merge( [], mainFacets ), facets);
    },
    
    // Initiate view
    initView() {
      var $container = $(container);

      // Build html for rendering
      var content = '<div id="' + wrapperSelectorID + '"></div>';
      content += popupHTML;

      $container.html(content);

      // Render list with no selected values
      this.renderList([]);
    },

    // Init popup events
    initSearchFiltersPopupEvents() {

      var _this = this;

      // Open popup event
      $('.block-search-filters .block-search-content').on('click', '.more-filters-button', function(event) {
        // Get current selected values
        var selectedValues = [];
        $.each($(container + ' .filterButton.active'), function(i, el) {
          selectedValues.push($(el).text());
        });
        // Render popup with selected values
        _this.renderPopup(selectedValues);
        // Show popup
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeIn(400, function() {
          $('input[type="text"]').focus();
        });
      });

      // Close popup
      $('.block-search-filters .block-search-content .block-search-filters-popup').on('click', '.popup-background', function(event) {
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
      });

      // Discard popup
      $('.block-search-filters .block-search-content .block-search-filters-popup').on('click', '.discard', function(event) {
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
      });

      // Confirm popup
      $('.block-search-filters .block-search-content .block-search-filters-popup').on('click', '.confirm', function(event) {
        var selectedValues = [];
        var inputs = $('.block-search-filters .filters-list input[type="checkbox"]:checked');
        // Clear all facets refinements of Algolia's helper
        _this.helper.clearRefinements();
        // Get selected values and toggle them
        $.each(inputs, function(i, input) {
          selectedValues.push(input.value);
          _this.helper.toggleRefinement(attributeName, input.value);
        });

        // Render list with selected values
        _this.renderList(selectedValues);
        // Trigger search with new facet refinement
        _this.helper.search();

        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
      });

      // Override jQuery contains function (case insensitive + accents)
      jQuery.expr[':'].contains = function(a, i, m) {
        var rExps=[
          {re: /[\xC0-\xC6]/g, ch: "A"},
          {re: /[\xE0-\xE6]/g, ch: "a"},
          {re: /[\xC8-\xCB]/g, ch: "E"},
          {re: /[\xE8-\xEB]/g, ch: "e"},
          {re: /[\xCC-\xCF]/g, ch: "I"},
          {re: /[\xEC-\xEF]/g, ch: "i"},
          {re: /[\xD2-\xD6]/g, ch: "O"},
          {re: /[\xF2-\xF6]/g, ch: "o"},
          {re: /[\xD9-\xDC]/g, ch: "U"},
          {re: /[\xF9-\xFC]/g, ch: "u"},
          {re: /[\xC7-\xE7]/g, ch: "c"},
          {re: /[\xD1]/g, ch: "N"},
          {re: /[\xF1]/g, ch: "n"}
        ];

        var element = $(a).text();
        var search  = m[3];

        $.each(rExps, function() {
          element = element.replace(this.re, this.ch);
          search = search.replace(this.re, this.ch);
        });

        return element.toUpperCase().indexOf(search.toUpperCase()) >= 0;
      };

      // Search input
      $('.block-search-filters .block-search-content .block-search-filters-popup').on('input', 'input[name="search-filters"]', function(event) {
        $('.filters-list label').hide();
        $('.filters-list label:contains('+$(this).val()+')').show();
      });
    },

    // Render facet list
    renderList(selectedValues) {

      var $container = $(container + ' #' + wrapperSelectorID);

      var content = '';
      // For each main facet create html button
      $.each(mainFacets, function(i, facet) {
        var data = {
          text: facet,
          modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton']
        };
        // If selected set to active
        if ($.inArray(facet, selectedValues) >= 0) {
          data.modifiers.push('active'); 
        }
        content += Paris.templates['button']['button'](data);
      });

      // Test if we have a need for main and second facets display (so we need to show more facets in a popup)
      if (facets.length > mainFacets.length) {

        // Check if some selected values are not main filters.
        $.each(selectedValues, function(i, value) {
          // If a selected value is not already a rendered main facets, append a new filter button
          if ($.inArray(value, mainFacets) < 0) {
            var data = {
              text: value,
              modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton', 'active']
            };
            content += Paris.templates['button']['button'](data); 
          }
        });

        // At the end append a more button
        var data = {
          text: moreButtonText,
          modifiers: ["secondary", "small", "more-filters-button"]
        };
        content += Paris.templates['button']['button'](data);

        // At the end append a apply button
        var data = {
          text: applyButtonText,
          modifiers: ["apply-filters-button"]
        };
        content += Paris.templates['button']['button'](data);
      }

      $container.html(content);
    },

    // Render popup
    renderPopup(selectedValues) {

      var content = '';
      content += '<div class="search-filters-container">';
      content += '<input type="text" name="search-filters" placeholder="Rechercher un filtre...">';
      content += '</div>';
      content += '<div class="filters-list">';
      // For each facets build html
      $.each(facets, function(i, facet) {
        var checked = ($.inArray(facet, selectedValues) >= 0) ? 'checked="checked"' : '';
        content += '<label><input type="checkbox" name="categories[]" value="' + facet + '" ' + checked + '><span class="label-bg"></span><span class="label-txt">' + facet + '</span></label>';
      });
      content += '</div>';

      // Add popup buttons
      content += '<div class="buttons">';
      content += Paris.templates['button']['button']({
        text: 'Annuler',
        modifiers: ["discard", "action"]
      });
      content += Paris.templates['button']['button']({
        text: 'Valider',
        modifiers: ["confirm", "action"]
      });
      content += '</div>';

      $('.popup-content').html(content);
    }

  }
};


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
  skipRefine = false,
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
userMarkerEl.innerHTML = 'User\'s position';

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
      circleColor: '#000',
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
    openHit: function(html, coordinates) {
      skipRefine = true;
      map.flyTo({
        center: coordinates,
        zoom: settings.cluster.clusterMaxZoom + 1,
        curve: 1.2
      });
      showPopup(html, coordinates);
      settings.openedHit();
    }
  }
}

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
  var geolocate = new mapboxgl.Geolocate();
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
    helper.setQueryParameter('aroundLatLng', e.coords.latitude+','+e.coords.longitude);
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
    // open hit
    } else {
      var html = settings.popupHTMLForHit(feature.properties);
      showPopup(html, feature.geometry.coordinates); 
      settings.openedHit();
    }
  });

  // Trigger search based on map bounds when user moves map
  map.on('moveend', function (e) {

    // For some scenario we skip launching geo based request (drag tolerance, or programmatic movement, ...)
    if (skipRefine) {
      skipRefine = false;
      return;
    }

    var bounds = map.getBounds();
    helper
      .setQueryParameter('insideBoundingBox', bounds._sw.lat+','+bounds._sw.lng+','+bounds._ne.lat+','+bounds._ne.lng)
      .search()
      // Clear geoloc param right after launching request
      .setQueryParameter('insideBoundingBox', undefined);
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

  // Search is based on map bounds all the time except when user type in a text in search field
  helper.on('change', function(state, lastResults) {
    if (lastResults.query != state.query) {
    // Clear geoloc param right after launching request
      helper.setQueryParameter('insideBoundingBox', undefined);
    } else {
      var bounds = map.getBounds();
      helper.setQueryParameter('insideBoundingBox', bounds._sw.lat+','+bounds._sw.lng+','+bounds._ne.lat+','+bounds._ne.lng)
    }
  });
  
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

  var popup = new mapboxgl.Popup();
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
    var clusterCircleID = 'cluster-circle'
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
          'icon-image': 'marker-'+symbol
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
    }
    // Store hit in properties
    $.extend(feature.properties, hit);
    features.push(feature);
  });

  geoJSON.features = features;

  return geoJSON;
}