// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

var helper;
var settings;

var container, // DOM selector in which to add UI
    filtersPopupContainer; // DOM selector in which to add filters popup

// See more details in the documentation:
// https://community.algolia.com/instantsearch.js/documentation/#custom-widgets

// instantsearch.js custom widget with plain JavaScript
// First, we add ourselves to the instantsearch.widgets namespace
Paris.instantsearch.widgets.newrefinementList = function refinementList(options) {
  return {
    init: function(params) {
      helper = params.helper;
      settings = options;

      // Bind filter events
      $(options.container).on('click', '.apply-filters-button', onClickApplySearchButton.bind(this));
    },
    render: function(params) {
      // Nothing to re-render
    }
  };
};

function onClickApplySearchButton(e) {
  helper.search();
  // renderSelectedFacetFilters();
  $(e.target).closest('.layout-content-list').removeClass('searching');
}
