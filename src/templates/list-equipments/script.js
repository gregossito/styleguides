'use strict';
require('velocity-animate');

var jade = require('jade');
var algoliasearch = require('algoliasearch');
//var algoliaSearchHelper = require('algoliasearch-helper');
var instantsearch = require('instantsearch.js');
// var instantsearchGoogleMaps = require('instantsearch-googlemaps');

var Paris = window.Paris || {};

Paris.listEquipments = (function(){

  var defaultOptions = {
    // the Algolia index to use (should be defined in config.js)
    index: 'equipments',
    // matching the names of Algolia fields
    //fields: {
    //  // the field to use as a link
    //  link: 'url',
    //  // the field to use as the person-block title
    //  title: 'prenom_nom',
    //  // the field to use as the person-block text
    //  text: 'mandat',
    //  // the field to use as image
    //  image: 'portrait',
    //  // the field to use in the person-block text
    //  group: 'groupe_politique'
    //},
    // the number of results to display per page
    //resultsPerPage: 100,
    // the available facets that will be displayed in the left column (should have been created on Algolia)
    // you can set the name displayed in the left column in locales.js (key: $LOCALE/search_results/facets/$YOUR_FACET)
    //facets: ["groupe_politique", "secteur"],
    // the facetFilter you want to always add by default (useful for filtering results)
    //addFacetFilterJson: null,
    //algoliaHelperParams: {facets: ['mandat'], disjunctiveFacets: ['groupe_politique', 'secteur']}
    searchParams: {
      "facetFilters": [
        "onglet:Equipements"
      ]
    }
  };

  function listEquipments(selector, userOptions) {
    var $el = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      api = {},
      search;

    function init() {
      initOptions();

      var search = instantsearch({
        appId: Paris.config.algolia.id,
        apiKey: Paris.config.algolia.api_key,
        indexName: Paris.config.algolia.indexes[options.index]
        //searchParameters: options.searchParams
      });

      search.addWidget(
        instantsearch.widgets.searchBox({
          container: '.block-search-field .search-field-input',
          searchOnEnterKeyPressOnly: true
        })
      );

      search.addWidget(
        Paris.instantsearch.widgets.refinementList({
          container: '.block-search-filters .block-search-content',
          attributeName: 'categories',
          operator: 'or',
          limit: 10
        })
      );

      search.addWidget(
        instantsearch.widgets.clearAll({
          container: '.block-search-filters .block-search-top-link',
          autoHideContainer: false,
          templates: {
            link: 'Réinitialiser'
          }
        })
      );

      search.addWidget(
        instantsearch.widgets.hits({
          container: '#hits-container',
          templates: {
            empty: 'No results',
            item: '<a href="#" class="card open"><div style="background-image: url()" class="card-image"></div><div class="card-content"><h3 class="card-title">{{name}}</h3><div class="card-text">{{address}}<br>{{zipCode}} {{city}}</div><div class="card-hours open">Ouvert jusqu’à 21h</div></div></a>'
          }
        })
      );

      $('form.search-field').submit(function(event) {
        event.preventDefault();
      });

      $('form.search-field').on('click', '.search-field-submit', function(event) {
        search.helper.search();
      });

      // Autocompletion
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
            return suggestion._highlightResult.name.value;
          }
        }
      }
      ]).on('autocomplete:selected', function(event, suggestion, dataset) {
        search.helper.setQuery(suggestion.name);
        search.helper.search();
      });

      search.start();

      $el.data('api', api);
    }

    function initOptions() {
      $.each($el.data(), function(key, value) {
        options[key] = value;
      });
    }

    // The API for external interaction
    //api.search = function(query) {
    //};

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
