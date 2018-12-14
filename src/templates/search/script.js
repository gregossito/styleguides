'use strict';
require('velocity-animate');

var values = require('lodash.values');
var algoliasearch = require('algoliasearch');
var PubSub = require('pubsub-js');
var DOMPurify = require('dompurify');

var Paris = window.Paris || {};

Paris.search = (function(){

  var defaultOptions = {
    breakpoint: "small",
    index: 'global', // the Algolia index to use (should be defined in config.js)
    fields: { // matching the names of Algolia fields
      link: 'url',           // the field to use as a link
      title: 'titre',        // the field to use as a title
      sections: 'onglet',    // the field to use as a section
      primary: 'isPromoted', // the field for primary results (boolean)
      anchors: 'ancres'      // the field for anchors (array of objects)
    },
    resultsPerPage: 8,  // the number of results to display per page
    facets: ["onglet"], // the available facets that will be displayed in the left column (should have been created on Algolia)
                        // you can set the name displayed in the left column in locales.js (key: $LOCALE/search_results/facets/$YOUR_FACET)
    headerSelector: '.rheader'
  };

  function search(selector, userOptions){
    var $el     = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      api = {},
      $searchFieldInput,
      $searchFieldForm,
      $results,
      $facetsContainer,
      currentFacets = [],
      algolia,
      index,
      currentPage = 0;

    function init(){
      initOptions();

      algolia = algoliasearch(Paris.config.algolia.id, Paris.config.algolia.api_key);
      index = algolia.initIndex(Paris.config.algolia.indexes[options.index]);

      PubSub.subscribe('responsive.' + options.breakpoint + '.enable', enableMobile);
      PubSub.subscribe('responsive.' + options.breakpoint + '.disable', disableMobile);

      $searchFieldInput = $el.find('#main-search');
      $searchFieldForm = $searchFieldInput.closest('form');
      $results = $el.find('#results');
      $facetsContainer = $el.find('#facets');

      $searchFieldInput.on('input', onInput);
      $facetsContainer.on('click', 'a', toggleFacet);
      $facetsContainer.on('change', 'select', updateFacets);
      $el.on('click', '.search-results-list-more .button', onClickMore);

      $searchFieldInput.trigger('focus');
      $searchFieldForm.on('submit', onSubmit);

      // If the search field is not empty, trigger the search on page load
      if ($searchFieldInput.val() != "" && options.results !== true) {
        $searchFieldInput.trigger('input');
      }

      $el.data('api', api);
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function enableMobile() {
      // Hide facets if empty
      if ($facetsContainer.is(':empty')) {
        $facetsContainer.closest('.layout-aside').hide();
      }
    }

    function disableMobile() {
      // Unhide facets
      $facetsContainer.closest('.layout-aside').show();
    }

    function onInput() {
      currentPage = 0;
      var query = DOMPurify.sanitize($searchFieldInput.val());
      if (query !== "") {
        launchSearch(query);
      } else {
        updateResults(false);
        renderFacets(false);
      }
    }

    function onSubmit(e){
      e.preventDefault();
      onInput();
      $results
        .velocity("stop")
        .velocity("scroll", {
          duration: 800,
          offset: 0, // height of folded rheader
          complete: function(){
            $searchFieldInput.trigger('blur');
          }
        });
    }

    function launchSearch(query){
      if (typeof query === 'undefined') {
        query = DOMPurify.sanitize($searchFieldInput.val());
      }

      var params = {
        // Pagination params
        page: currentPage,
        hitsPerPage: options.resultsPerPage,

        // Explicitly request necessary facets (as defined in options)
        facets: options.facets.join(','),

        // Explicitly request necessary attributes (as defined in options)
        attributesToRetrieve: values(options.fields).join(','),

        // // On ne veut pas l'espace PRO dans les résultats des recherches
        // filters: "(NOT onglet:Professionnels)"
      };

      // If some facets filters are active, add them to the request
      if (currentFacets.length !== 0) {
        params.facetFilters = currentFacets;
      }

      // Launch the search
      index.search(query, params, onSearchResults);
    }

    function onSearchResults(err, data) {
      if (err) {return;}

      if (data && data.query !== $searchFieldInput.val()) {
        // do not take out-dated answers into account
        return;
      }

      updateResults(data);
      renderFacets(data);
    }

    function updateResults(data) {
      var search_results_list_data = {
        items: []
      };

      if (!data) {
        // No search
        $.getJSON(Paris.config.algolia.url.api_popular_searches, function(data){
          if ($searchFieldInput.val() === "") {
            // do not take render if out-dated
            renderResults(data);
          }
        });

        if (Modernizr.history) {
          history.replaceState({}, Paris.i18n.t("search_results/search"), options.baseUrl);
        }
      } else if (data.nbHits === 0) {
        // Search with no results
        search_results_list_data.title = Paris.i18n.t("search_results/no_result");

        if (Modernizr.history) {
          history.replaceState({}, Paris.i18n.t("search_results/search"), options.searchUrl.replace('${search}', data.query));
        }
      } else {
        // Search with results
        if (data.page === 0) {
          // On the first page, add a title
          if(data.nbHits < 2 ) {
            search_results_list_data.title = Paris.i18n.t("search_results/title/one", [Paris.i18n.formatNumber(data.nbHits)]);
          }
          else {
            search_results_list_data.title = Paris.i18n.t("search_results/title/plural", [Paris.i18n.formatNumber(data.nbHits)]);
          }
        } else {
          // On other pages, add the page separator
          search_results_list_data.page = Paris.i18n.t("search_results/page", [data.page + 1]);
        }

        if (Modernizr.history) {
          history.replaceState({}, Paris.i18n.t("search_results/search"), options.searchUrl.replace('${search}', data.query));
        }

        $.each(data.hits, function(index, hit){
          var modifiers = [];
          var anchors = [];

          // Add the `primary` modifier when needed
          if (hit[options.fields.primary] === 1) {modifiers.push("primary");}

          // Parse the anchors if they exist
          if (hit[options.fields.anchors]) {
            anchors = JSON.parse(hit[options.fields.anchors]);

            // Concatenate hit href and anchor href
            $.each(anchors, function(index, anchor){
              anchor.href = hit[options.fields.link] + "#" + anchor.href;
            });
          }

          search_results_list_data.items.push({
            href: hit[options.fields.link],
            modifiers: modifiers,
            title: hit[options.fields.title],
            text: hit[options.fields.sections],
            anchors: anchors
          });
        });

        // Add "more" button if needed
        if (data.page + 1 < data.nbPages) {
          search_results_list_data.more = {
            text: Paris.i18n.t("search_results/more"),
            page: data.page + 1
          };
        }
      }

      search_results_list_data.page = data.page;

      renderResults(search_results_list_data);
    }

    function renderResults(data) {
      var results = Paris.templates["search-results-list"]["search-results-list"](data);

      if (data.page > 0) {
        $results.find('.search-results-list-more').remove();
        $results.append(results);
      } else {
        $results.html(results);
      }
    }

    function renderFacets(data) {

      if (!data || data.nbHits === 0) {
        // No search or search with no results
        $facetsContainer.empty().closest('.layout-aside').hide();
      } else { // Search with results
        if (currentFacets.length === 0
          && !$.isEmptyObject(options.facets)
          && !$.isEmptyObject(data.facets)
        ) {
          $facetsContainer.empty().closest('.layout-aside').show();

          $.each(options.facets, function(index, facet) {

            var block_aside_checkboxes_data = {
              title: Paris.i18n.t("search_results/facets/"+facet),
              name: facet,
              items: []
            };

            $.each(data.facets[facet], function (name, number) {
              block_aside_checkboxes_data.items.push({
                value: name,
                text: name,
                number: Paris.i18n.formatNumber(number)
              });
            });

            var facet_block = Paris.templates["block-aside-checkboxes"]["block-aside-checkboxes"](block_aside_checkboxes_data);
            $facetsContainer.append(facet_block);
          });
        }
      }
    }

    function updateFacets() {
      var isSmall = Paris.responsive.is(options.breakpoint);

      currentFacets = [];
      $.each(options.facets, function(index, facet) {
        var facetValues = [];
        if (isSmall) {
          var values = $facetsContainer.find("select[name^='" + facet + "']").val();
          if (values) {
            facetValues = $.map(values, function(val){
              return facet + ":" + val;
            });
          }
        } else {
          // var $checkboxes = $facetsContainer.find("input[type=checkbox][name^='" + facet + "']:checked");
          var $checkboxes = $facetsContainer.find("a[data-name^='" + facet + "'].checked");
          $checkboxes.each(function() {
            // facetValues.push(facet + ":" + $(this).val());
            facetValues.push(facet + ":" + $(this).data('value'));
          });
        }
        if (facetValues.length > 0) {
          currentFacets.push(facetValues);
        }
      });
      onInput();
    }

    function toggleFacet(event) {
      if (event) {event.preventDefault();}

      $(this).toggleClass('checked');
      updateFacets();
    }

    function onClickMore(e){
      e.preventDefault();
      currentPage = $(this).data('page');
      launchSearch();
    }


    // The API for external interaction

    api.search = function(query){
      query = DOMPurify.sanitize(query);
      $searchFieldInput.val(query).trigger('input');
    };

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      search(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.search('body.search');
});
