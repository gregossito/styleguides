'use strict';
require('velocity-animate');

var jade = require('jade');
//var algoliasearch = require('algoliasearch');
//var algoliaSearchHelper = require('algoliasearch-helper');
var instantsearch = require('instantsearch.js');
//var instantsearchGoogleMaps = require('instantsearch-googlemaps');

var Paris = window.Paris || {};

Paris.listEquipments = (function(){

  var defaultOptions = {
    // the Algolia index to use (should be defined in config.js)
    index: 'global',
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
          container: '#search-box',
          placeholder: 'Equipement, adresse, métro, arrondissement...'
        })
      );

      search.addWidget(
        instantsearch.widgets.menu({
          container: '#filters',
          attributeName: 'onglet',
          limit: 10,
          templates: {
            header: 'Filtres'
          }
        })
      );

      search.addWidget(
        instantsearch.widgets.hits({
          container: '#hits-container',
          templates: {
            empty: 'No results',
            item: '<li>{{{_highlightResult.titre.value}}}</li>'
          }
        })
      );

      //search.addWidget(
      //  instantsearchGoogleMaps({
      //    container: document.querySelector('#map'),
      //    prepareMarkerData: function(hit, index, hits) {
      //      return {
      //        label: hit.name,
      //        title: hit.description
      //      };
      //    },
      //    refineOnMapInteraction: true
      //  })
      //);

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
