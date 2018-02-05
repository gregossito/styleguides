// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

var helper;
var settings;

var container, // DOM selector in which to add UI
    attributeName, // Attribute name for facets
    operator, // Facets operator
    defaultFacets; // Facets to filter by default

// instantsearch.js custom widget with plain JavaScript
Paris.instantsearch.widgets.resetButton = function resetButton(options) {
  return {
    getConfiguration: function(configuration) {
      if (options.operator === 'and') {
        return {
          facets: [options.attributeName]
        };
      } else {
        return {
          disjunctiveFacets: [options.attributeName]
        };
      }
    },
    init: function(params) {
      helper = params.helper;
      settings = options;

      setDefaultFacets();

      $(options.container).on('click', onClick);
    },
    render: function(params) {
      // Nothing to re-render
    }
  };
};

function setDefaultFacets() {
  $.each(settings.defaultFacets, function(i, facet) {
    helper.addDisjunctiveFacetRefinement(settings.attributeName, facet);
  });
}

function resetFacets() {
  helper.clearRefinements();
  setDefaultFacets();
}

function onClick(e) {
  e.preventDefault();
  resetFacets();
  helper.search();
}
