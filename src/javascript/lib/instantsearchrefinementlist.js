// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

var helper;
// Store all facets values
var facets = [];
// Keep reference of facets selected via UI
// var selectedFacets = [];
// Internal selector ID for facet list html rendering
// var equipementFacetsWrapperID = 'equipement-facets-list-wrapper';
// Base HTML code for popup
// var popupHTML = '<div class="block-search-filters-popup"><div class="popup-background"></div><div class="popup-content"></div></div>';
var settings;
// var mediaQuery = {
//   mobileMediaQuery: window.matchMedia("(max-width: 767px)")
// };

var container, // DOM selector in which to add UI
    // selectedFiltersContainer, // DOM selector in which to add selected filters
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
      // $(options.container).on('click', '.filterButton', onClickFilterButton.bind(this));
      $(options.container).on('click', '.apply-filters-button', onClickApplySearchButton.bind(this));
      // $(options.selectedFiltersContainer).on('click', '.selected-filters-buttons-container .filterButton', onClickSelectedFacetFilterButton.bind(this));
      // $(options.selectedFiltersContainer).on('click', '.selected-facets-popup .filterButton', onClickSelectedFacetPopupFilterButton.bind(this));

      // Wait until window is done resizing to update some UI rendering
      // PubSub.subscribe('responsive.resize', onResize);
      // function onResize() {
      //   // renderSelectedFacetFilters();
      // }

      // Trigger a fake search request just to retrieve all available facets
      // helper.searchOnce({
      //   hitsPerPage: 1,
      //   maxValuesPerFacet: settings.numberOfFacets
      // },
      //   function(error, content, state) {
      //     // Store all possible facets values (We don't store the facet object because we need to simplify some array object search)
      //     $.each(content.getFacetValues(options.attributeName, {sortBy: options.sortBy}), function(i, facet) {
      //       facets.push(facet.name);
      //     });
      //
      //     // Init filter view
      //     // initView();
      //     initSearchFiltersPopupEvents();
      //     // initSelectedFiltersPopupEvents();
      //   }
      // );

      initSearchFiltersPopupEvents();
    },
    render: function(params) {
      // Nothing to re-render
    },
    getAndRenderSelectedFacets: function() {
      var selectedValues = getSelectedValues($(settings.container + ' .filterButton.active'));
      // renderSelectedFacetFilters();
    }
  };
};



//////////////////////////
//// Facet management ////
//////////////////////////

// This function toggles a facet for Algolia and store the value in selectedFacets
// function toggletFacet(facetFilter, active) {
//   console.log('toggletFacet', facetFilter, active);
//
//   if (active === true) {
//     helper.addDisjunctiveFacetRefinement(facetFilter.facet, facetFilter.value);
//   } else if (active === false) {
//     helper.removeDisjunctiveFacetRefinement(facetFilter.facet, facetFilter.value);
//   } else {
//     helper.toggleFacetRefinement(facetFilter.facet, facetFilter.value);
//   }
//
//   var index = -1;
//
//   // Check for existing facet
//   $.each(selectedFacets, function(i, el) {
//     if (el.facet == facetFilter.facet && el.value == facetFilter.value) {
//       index = i;
//       return;
//     }
//   });
//
//   var facetExists = (index >= 0);
//
//   // If existing remove otherwise store
//   if (facetExists) {
//     selectedFacets.splice(index, 1);
//   } else {
//     selectedFacets.push(facetFilter);
//   }
//
//   console.log('facetExists', facetExists, selectedFacets);
// }


////////////////////
//// UI Actions ////
////////////////////



function onClickApplySearchButton(e) {
  helper.search();
  // renderSelectedFacetFilters();
  $(e.target).closest('.layout-content-list').removeClass('searching');
}


// // Handle click on filter button. List displaying main facets + selected facets.
// function onClickFilterButton(e) {
//   e.preventDefault();
//
//   // Find the button DOM element
//   var $button = $(e.target).closest('.button');
//   var facetFilter = {
//     facet: $button.attr('data-facet'),
//     value: $button.attr('data-value'),
//     label: $button.attr('data-label')
//   };
//
//   // Remove the button
//   $button.remove();
//   toggletFacet(facetFilter, false);
//
//   // Clicking filter buttons trigger search except on mobile
//   if (!mediaQuery.mobileMediaQuery.matches) {
//     helper.search();
//   }
// }

// UI click on facet filter buttons in all selected facet filters (mobile only)
// function onClickSelectedFacetFilterButton(e) {
//   onClickFilterButton(e);
//   $(e.target).closest('button').remove();
//   updateUI();
//   helper.search();
// }

// UI click on facet filter buttons in all selected facet filters popup (mobile only)
// function onClickSelectedFacetPopupFilterButton(e) {
//   var button = $(e.target).closest('.button');
//   var removedFacet = $(button).attr('data-value');
//   button.remove();
// }

///////////////////////
//// UI Rendering  ////
///////////////////////
//
//
//
// function updateUI() {
//   renderEquipmentsFacetFilters();
//   // renderSelectedFacetFilters();
// }
//
// Render facet list
// function renderEquipmentsFacetFilters() {
//
//   var $container = $(settings.container + ' #' + equipementFacetsWrapperID);
//   var content = '';
//
//   // Prepend an around me button
//   var data = {
//     text: Paris.i18n.t('list_equipments/around_me'),
//     modifiers: ["secondary", "around-me-button"]
//   };
//   // TODO: re-add Around me button
//   // content += Paris.templates['button']['button'](data);
//
//   // For each selected facet create html button
//   $.each(selectedFacets, function(i, facet) {
//     var data = {
//       text: facet.label,
//       modifiers: ['closable', 'white', 'small', 'icon', 'filterButton'],
//       attributes: {
//         'data-facet': facet.facet,
//         'data-value': facet.value,
//         'data-label': facet.label,
//       }
//     };
//     var facetIcon = $.grep(settings.mainFacetsIcons, function(facetIcon) {
//       return (facetIcon.facet == facet.value);
//     });
//     if (facetIcon.length > 0) {
//       data['icon'] = facetIcon[0].icon;
//     }
//
//     content += Paris.templates['button']['button'](data);
//   });
//
//   // Test if we have a need for main and more facets display (so we need to show more facets in a popup)
//   // if (facets.length > settings.mainFacets.length) {
//     // Append a more button if it doesn't already exist
//     if ($container.next('.js-more-filters-button').length == 0) {
//       var button = '<button class="block-search-filters-more js-more-filters-button">' + Paris.i18n.t('list_equipments/more_filters') + '</button>';
//       $container.after(button);
//     }
//   // }
//
//   $container.html(content);
// }
//
// // Render selected facets
// function renderSelectedFacetFilters() {
//
//   $selectedFiltersContainer = $(settings.selectedFiltersContainer);
//   var content = '';
//   var buttonsHTML = '';
//
//   content += '<div class="selected-filters-buttons-container">';
//
//   // Add category_names
//   console.log('renderSelectedFacetFilters', selectedFacets);
//   $.each(selectedFacets, function(i, facetFilter) {
//     var data = {
//       text: facetFilter.label,
//       modifiers: ['closable', 'white', 'small', 'icon', 'filterButton', 'active'],
//       attributes: {
//         'data-facet': facetFilter.facet,
//         'data-value': facetFilter.value,
//         'data-label': facetFilter.label
//       }
//     };
//     buttonsHTML += Paris.templates['button']['button'](data);
//   });
//   content += buttonsHTML;
//   content += '</div>';
//
//   // Render popup
//   content += '<div class="list-equipment-popup selected-facets-popup">';
//   content += '<div class="popup-background"></div>';
//   content += '<div class="popup-content">';
//   content += '<div class="filters-buttons"></div>';
//
//   // Add popup buttons
//   content += '<div class="popup-buttons">';
//   content += Paris.templates['button']['button']({
//     text: Paris.i18n.t('list_equipments/cancel'),
//     modifiers: ["discard", "action", "js-discard"]
//   });
//   content += Paris.templates['button']['button']({
//     text: Paris.i18n.t('list_equipments/confirm'),
//     modifiers: ["secondary", "action", "js-confirm"]
//   });
//   content += '</div>';
//   content += '</div>';
//   content += '</div>';
//
//   $selectedFiltersContainer.html(content);
//
//
//   // Calculate map height
//   setTimeout(function() {
//     if (mediaQuery.mobileMediaQuery.matches) {
//       var mapHeight = $(window).height() - $('header').height() - $('.layout-content-list').height();
//     } else {
//       var mapHeight = '100%';
//     }
//     $('.layout-content-map').height(mapHeight);
//   }, 1);
//
//   selectedFacetsMoreButtonDisplay();
// }

// function selectedFacetsMoreButtonDisplay() {
//   // Set filters in one line and add a more button if needed
//   $selectedFiltersContainer = $(settings.selectedFiltersContainer);
//   var totalWidth = 0;
//   var moreButtonWidth = 0;
//   var maxWidth = $selectedFiltersContainer.width();
//   var btnLeft = $selectedFiltersContainer.find('.selected-filters-buttons-container button.filterButton').length;
//
//   $selectedFiltersContainer.find('.selected-filters-buttons-container button.js-more-filters-button').hide();
//
//   setTimeout(function() {
//     $selectedFiltersContainer.find('.selected-filters-buttons-container button.filterButton').each(function(i) {
//       // Calculate total width
//       totalWidth += $(this).width() + 50;
//
//       // Set more filters button
//       if (btnLeft > 1 ) {
//         $selectedFiltersContainer.find('.selected-filters-buttons-container button.js-more-filters-button').html(Paris.i18n.t("list_equipments/more_filters_nb", [btnLeft - 1]));
//         $selectedFiltersContainer.find('.selected-filters-buttons-container button.js-more-filters-button').show();
//         moreButtonWidth = $selectedFiltersContainer.find('.selected-filters-buttons-container button.js-more-filters-button').width() + 20;
//       } else if (totalWidth < maxWidth) {
//         $selectedFiltersContainer.find('.selected-filters-buttons-container button.js-more-filters-button').hide();
//         moreButtonWidth = 0;
//       }
//
//       if (totalWidth + moreButtonWidth > maxWidth) {
//         $(this).addClass('hidden');
//         $selectedFiltersContainer.find('.selected-filters-buttons-container button.js-more-filters-button').html(Paris.i18n.t("list_equipments/more_filters_nb", [btnLeft]));
//         totalWidth += moreButtonWidth;
//         return;
//       } else {
//         $(this).removeClass('hidden');
//       }
//       btnLeft--;
//     });
//   }, 1);
// }

// function closeSelectedFiltersPopup() {
//   $(settings.selectedFiltersContainer).find('.list-equipment-popup').fadeOut(400);
// }
//
// // Render search filters popup
// function renderPopup() {
//
//   var content = '';
//   content += '<div class="search-filters-container">';
//   content += '<input type="text" name="search-filters" placeholder="'+Paris.i18n.t('list_equipments/search_filter')+'">';
//   content += '</div>';
//   content += '<div class="filters-list">';
//   // For each facets build html
//   $.each(facets, function(i, facet) {
//     var checked = '';
//     // Check if the facet is one of the selected values
//     $.each(selectedFacets, function(i, el) {
//       if (el.facet == 'category_names' && el.value == facet) {
//         checked = 'checked="checked"';
//       }
//     });
//     content += '<label><input type="checkbox" name="category_names[]" value="' + facet + '" ' + checked + ' data-facet="category_names" data-value="'+facet+'" data-label="'+facet+'"><span class="label-bg"></span><span class="label-txt">' + facet + '</span></label>';
//   });
//   content += '</div>';
//
//   // Add popup buttons
//   content += '<div class="buttons">';
//   content += Paris.templates['button']['button']({
//     text: Paris.i18n.t('list_equipments/cancel'),
//     modifiers: ["discard", "action", "js-discard"]
//   });
//   content += Paris.templates['button']['button']({
//     text: Paris.i18n.t('list_equipments/confirm'),
//     modifiers: ["secondary", "action", "js-confirm"]
//   });
//   content += '</div>';
//
//   $('.popup-content').html(content);
// }



//////////////////////
//// Init methods ////
//////////////////////



// function initView() {
//   // $(settings.container).html('<div class="block-search-filters-items" id="' + equipementFacetsWrapperID + '"></div>');
//   // $(settings.filtersPopupContainer).html(popupHTML);
//
//   // Render facets filters
//   // renderEquipmentsFacetFilters();
// }

// Init search filters popup events
function initSearchFiltersPopupEvents() {
  // Open popup event
  $(settings.container).on('click', '.js-more-filters-button', function(event) {
    // Render popup with selected values
    // renderPopup();

    // Show popup
    $(settings.filtersPopupContainer).fadeIn(400, function() {
      $(this).find('.filters-list').css('max-height', $(this).find('.popup-content').height() - $(this).find('.search-filters-container').innerHeight() - $(this).find('.buttons').innerHeight());
      $(this).find('input[type="text"]').focus();
    });
  });

  // Close popup
  $(settings.filtersPopupContainer).on('click', '.popup-background', function(event) {
    $(settings.filtersPopupContainer).fadeOut();
  });

  // Discard popup
  $(settings.filtersPopupContainer).on('click', '.js-discard', function(event) {
    $(settings.filtersPopupContainer).fadeOut();
  });

  // Confirm popup
  $(settings.filtersPopupContainer).on('click', '.js-confirm', function(event) {
    $(settings.filtersPopupContainer).fadeOut();

    // // To ease treatment reset everything upon applying filters
    // resetFacets();
    //
    // var selectedFacetFilters = getSelectedValues($(settings.filtersPopupContainer).find('.filters-list input[type="checkbox"]:checked'));
    // console.log('selectedFacetFilters', selectedFacetFilters);
    //
    // // Apply value selected in popup
    // $.each(selectedFacetFilters, function(i, facetFilter) {
    //   toggletFacet(facetFilter, true);
    // });
    //
    // // Render UI
    // updateUI();
    //
    // // Trigger search with new facet refinement
    // if (!mediaQuery.mobileMediaQuery.matches) {
    //   helper.search();
    // }
    //
    // $(settings.filtersPopupContainer).fadeOut();
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

  // Search for facet values
  // helper.searchForFacetValues(options.attributeName, "", 100)
  //   .then(function (content){
  //     console.log(content);
  //   }
  // );

  // Search input
  $(settings.filtersPopupContainer).on('input', 'input[name="search-filters"]', function(event) {
    $('.filters-list label').hide();
    $('.filters-list label:contains('+$(this).val()+')').show();
  });
}

// Init selected filters popup events
// function initSelectedFiltersPopupEvents() {
//   // Open popup event
//   $(settings.selectedFiltersContainer).on('click', '.js-more-filters-button', function(event) {
//
//     // Set popup content
//     var $button = $selectedFiltersContainer.find('.selected-filters-buttons-container button.filterButton').clone();
//     $(settings.selectedFiltersContainer).find('.list-equipment-popup .filters-buttons').html($button);
//     $(settings.selectedFiltersContainer).find('.list-equipment-popup .filters-buttons .filterButton').removeClass('hidden');
//
//     // Show popup
//     $(settings.selectedFiltersContainer).find('.list-equipment-popup').fadeIn(400);
//   });
//
//   // Discard popup
//   $(settings.selectedFiltersContainer).on('click', '.js-discard', function(event) {
//     // Close popup
//     closeSelectedFiltersPopup();
//   });
//
//   // Confirm popup
//   // UI click when apply and closing popup showing all selected facet filters (mobile only)
//   $(settings.selectedFiltersContainer).on('click', '.js-confirm', function(event) {
//     var selectedFacetFilters = getSelectedValues($(settings.selectedFiltersContainer + ' .selected-facets-popup .filterButton.active'));
//
//     // To ease treatment reset everything upon applying filters
//     resetFacets();
//
//     // Apply value selected in popup
//     $.each(selectedFacetFilters, function(i, facetFilter) {
//       toggletFacet(facetFilter, true);
//     });
//
//     // Render UI
//     updateUI();
//
//     // Refresh results
//     helper.search();
//
//     // Close popup
//     closeSelectedFiltersPopup();
//   });
// }



////////////////////////
//// Helper methods ////
////////////////////////



// Getter of selected facet buttons
function getSelectedValues(parentSelector) {

  var selectedValues = [];
  $.each(parentSelector, function(i, el) {
    selectedValues.push({
      facet: $(el).attr('data-facet'),
      value: $(el).attr('data-value'),
      label: $(el).attr('data-label')
    });
  });

  return selectedValues;
}
