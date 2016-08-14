'use strict';
require('velocity-animate');

var algoliasearch = require('algoliasearch');
var instantsearch = require('instantsearch.js');
var instantsearchMapbox = require('instantsearch-mapbox');

var Paris = window.Paris || {};

Paris.listEquipments = (function(){

  var defaultOptions = {
    // the Algolia index to use (should be defined in config.js)
    index: 'equipments',
    searchParams: {
      "attributesToRetrieve": "*"
    }
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

      // Search refinement list
      search.addWidget(
        Paris.instantsearch.widgets.refinementList({
          container: '.block-search-filters .block-search-content',
          attributeName: 'categories',
          operator: 'or',
          limit: 10
        })
      );

      // Search reset
      search.addWidget(
        instantsearch.widgets.clearAll({
          container: '.block-search-filters .block-search-top-link',
          autoHideContainer: false,
          templates: {
            link: Paris.i18n.t('list_equipments/reset_filters')
          }
        })
      );

      // Search results
      search.addWidget(
        instantsearch.widgets.hits({
          container: '#hits-container',
          templates: {
            empty: '<p>' + Paris.i18n.t('list_equipments/no_result') + '</p>',
            item: '<a href="#" class="card open"><div style="background-image: url()" class="card-image"></div><div class="card-content"><h3 class="card-title">{{name}}</h3><div class="card-text">{{address}}<br>{{zipCode}} {{city}}</div><div class="card-hours open">Ouvert jusqu’à 21h</div></div></a>'
          }
        })
      );

      // Search map
      search.addWidget(
        instantsearch.widgets.mapbox({
          container: '#map',
          mapBoxAccessToken: 'pk.eyJ1IjoicGFyaXNudW1lcmlxdWUiLCJhIjoiY2loZG1vMnYyMDAzNnY0a3FvNG1nNG55biJ9.MP1qcHkEecFGqSTs9gg7cw',
          mapbox: {
            style: 'mapbox://styles/parisnumerique/cilnr6b9h0047c4knsv84lpv3',
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
          }
        })
      );

      // Prevent form to conflict with instantsearch behavior
      $('form.search-field').submit(function(event) {
        event.preventDefault();
      });

      // Form submit button will reload the page. Instantsearch has not yet make it fully compatible with forms. So manually handle the submi action by triggering search
      $('form.search-field').on('click', '.search-field-submit', function(event) {
        search.helper.search();
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
            facetFilters: ((categories && categories.length > 0) ? [categories] : '*')
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
      });

      initSearchFiltersPopupEvents();

      search.start();

      $el.data('api', api);
    }

    function initOptions() {
      $.each($el.data(), function(key, value) {
        options[key] = value;
      });
    }

    function initSearchFiltersPopupEvents() {

      // Open popup
      $('.block-search-filters .block-search-content #more-filters-button').click(function(event) {
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeIn();
      });

      // Close popup
      $('.block-search-filters .block-search-content .block-search-filters-popup .popup-background').click(function(event) {
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
      });

      // Discard popup
      $('.block-search-filters .block-search-content .block-search-filters-popup .discard').click(function(event) {
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
      });

      // Confirm popup
      $('.block-search-filters .block-search-content .block-search-filters-popup .confirm').click(function(event) {
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
        // TODO: set filters
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
