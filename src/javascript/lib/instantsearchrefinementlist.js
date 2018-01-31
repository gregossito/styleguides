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
    },
    render: function(params) {
      // Nothing to re-render
    }
  };
};
