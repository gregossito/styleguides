'use strict';
require('velocity-animate');

var algoliasearch = require('algoliasearch');
var instantsearch = require('instantsearch.js');
var instantsearchMapbox = require('instantsearch-mapbox');
var Flickity = require('flickity');

var Paris = window.Paris || {};

Paris.listEquipments = (function(){

  var defaultOptions = {
    // the Algolia index to use (should be defined in config.js)
    index: 'equipments',
    searchParams: {
      "attributesToRetrieve": "*"
    },
    mobileMediaQuery: window.matchMedia("(max-width: 767px)")
  };

  function listEquipments(selector, userOptions) {
    var $el = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      api = {},
      search;

    function init() {
      initOptions();

      // Init instantsearch
      var search = instantsearch({
        appId: Paris.config.algolia.id,
        apiKey: Paris.config.algolia.api_key,
        indexName: Paris.config.algolia.indexes[options.index],
        searchParameters: options.searchParams
      });

      // Search box widget
      search.addWidget(
        instantsearch.widgets.searchBox({
          container: '.block-search-field .search-field-input',
          searchOnEnterKeyPressOnly: true
        })
      );

      // Search refinement list widget
      search.addWidget(
        Paris.instantsearch.widgets.refinementList({
          container: '.block-search-filters .block-search-content',
          attributeName: 'categories',
          operator: 'or',
          limit: 10,
          sortBy: ['name:asc', 'count:desc'],
          numberOfFacets: 200,
          moreButtonText: 'Afficher la liste complète'
        })
      );
      
      // Search reset widget
      search.addWidget(
        instantsearch.widgets.clearAll({
          container: '.block-search-filters .block-search-top-link',
          autoHideContainer: false,
          templates: {
            link: Paris.i18n.t('list_equipments/reset_filters')
          }
        })
      );

      // Search results widget
      search.addWidget(
        instantsearch.widgets.hits({
          container: '#hits-container',
          templates: {
            empty: '<p>' + Paris.i18n.t('list_equipments/no_result') + '</p>',
            item: '<a href="#" class="card open" lat="{{_geoloc.lat}}" lng="{{_geoloc.lng}}"><div style="background-image: url()" class="card-image {{^img}} no-img {{/img}}"></div><div class="card-content"><h3 class="card-title">{{name}}</h3><div class="card-text">{{address}}<br>{{zipCode}} {{city}}</div><div class="card-hours open">Ouvert jusqu’à 21h</div></div></a>'
          },
          cssClasses: {
            root: 'carousel',
            item: 'carousel-cell'
          }
        })
      );

      // Mapbox widget
      var mapboxWidget = instantsearch.widgets.mapbox({
        container: '#map',
        mapBoxAccessToken: 'pk.eyJ1IjoicGFyaXNudW1lcmlxdWUiLCJhIjoiY2loZG1vMnYyMDAzNnY0a3FvNG1nNG55biJ9.MP1qcHkEecFGqSTs9gg7cw',
        mapbox: {
          style: 'mapbox://styles/parisnumerique/cis1rkqoj000khinpthppoaqd',
          zoom: 11,
          minZoom: 10,
          center: [2.349272, 48.856579],
          maxBounds:
          [
            [2.021942, 48.731991], // SW coordinates
            [2.698162, 48.985029]  // NE coordinates
          ]
        },
        cluster: {
          circleColor: '#f89cd3',
          circleRadius: 15
        },
        openedHit: function() {
          console.log('Click on hit on map event');
          // TODO scroll to hit
        },
        popupHTMLForHit: function(hit) {
          console.log(hit);
          return '<div class="card-content"><h3 class="card-title">'+hit.name+'</h3><div class="card-text">'+hit.address+'</div><div class="card-hours open">Ouvert jusqu’à 21h</div><a href="/">Fiche complète</a></div>';
        }
      });

      // Search map widget
      search.addWidget(mapboxWidget);

      // On search submit
      $('form.search-field').submit(function(event) {

        // Prevent form to conflict with instantsearch behavior
        event.preventDefault();

        // Close autocomplete when submitting search
        $('.layout-list-map .search-field-input').autocomplete('close');

        // [mobile] Display results list
        if (options.mobileMediaQuery.matches) {
          $('.block-search-results').show();
        }

      });

      // Form submit button will reload the page. Instantsearch has not yet make it fully compatible with forms. So manually handle the submit action by triggering search
      $('form.search-field').on('click', '.search-field-submit', function(event) {
        search.helper.search();
      });

      // Center map and open pin on list result click
      $('#hits-container').on('click', '.card', function(event) {
        var card = event.target.closest('.card');
        mapboxWidget.openHit('<div class="card-content"><h3 class="card-title">Titre</h3><div class="card-text">Adresse</div><div class="card-hours open">Ouvert jusqu’à 21h</div><a href="/">Fiche complète</a></div>', [card.getAttribute('lng'), card.getAttribute('lat')]);
      });

      // Handle click on map popup
      $('#map').on('click', '.card-title', function(event) {
        console.log("popup clicked");
      });

      // Autocompletion is not an instantsearch feature. Must use algolia.js directly
      var algolia = algoliasearch(Paris.config.algolia.id, Paris.config.algolia.api_key);
      var index = algolia.initIndex(Paris.config.algolia.indexes[options.index]);

      $('.layout-list-map .search-field-input').autocomplete({ hint: false }, [{
        source: function(query, callback) {
          var categories = [];
          if (search.helper.state.disjunctiveFacetsRefinements && search.helper.state.disjunctiveFacetsRefinements.categories) {
            $.each(search.helper.state.disjunctiveFacetsRefinements.categories, function(index, category) {
               categories.push('categories:' + category);
            });
          }
          index.search(query, { 
            hitsPerPage: 8,
            facetFilters: ((categories && categories.length > 0) ? [categories] : '*'),
            attributesToRetrieve: "*"
          }).then(function(answer) {
            callback(answer.hits);
          }, function() {
            callback([]);
          });
        },
        displayKey: 'name',
        templates: {
          suggestion: function(suggestion) {
            return '<span class="autocomplete-category">' + 'Équipement' + '</span>' + '<span class="autocomplete-name">' + suggestion._highlightResult.name.value + '</span>';
          }
        }
      }
      ]).on('autocomplete:selected', function(event, suggestion, dataset) {
        search.helper.setQuery(suggestion.name);
        search.helper.search();

        mapboxWidget.openHit('<div class="card-content"><h3 class="card-title">'+suggestion.name+'</h3><div class="card-text">'+suggestion.address+'</div><div class="card-hours open">Ouvert jusqu’à 21h</div><a href="/">Fiche complète</a></div>', [suggestion._geoloc.lng, suggestion._geoloc.lat]);

      });

      search.start();


      // [mobile] Results list carousel
      if (options.mobileMediaQuery.matches) {
        var flkyCarousel;

        // On search, destroy carousel (if it exists)
        search.helper.on('search', function(state, lastResults) {

          $('.block-search-results').css('opacity', 0);
          if (flkyCarousel && flkyCarousel != undefined) {
            flkyCarousel.destroy();
          }

        });

        // On search result, init carousel
        search.helper.on('result', function(results, state) {
          console.log('render results');
          flkyCarousel = new Flickity('.carousel', {
            pageDots: false
          });
          $('.block-search-results').css('opacity', 1);
        });

      }

      $el.data('api', api);
    }

    function initOptions() {
      $.each($el.data(), function(key, value) {
        options[key] = value;
      });
    }

    init();

    return $el;
  }

  return function(selector, userOptions) {
    return $(selector).each(function() {
      listEquipments(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.listEquipments('body.list-equipments');
});
