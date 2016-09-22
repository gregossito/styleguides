// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

var helper;
// Store all facets values
var facets = [];
// Internal selector ID for facet list html rendering
var equipementFacetsWrapperID = 'equipement-facets-list-wrapper';
var secondaryFacetsWrapperID = 'secondary-facets-list-wrapper';
// Base HTML code for popup
var popupHTML = '<div class="block-search-filters-popup"><div class="popup-background"></div><div class="popup-content"></div></div>';
var settings;
var mediaQuery = {
  mobileMediaQuery: window.matchMedia("(max-width: 767px)")
};

var container, // DOM selector in which to add UI
    selectedFiltersContainer, // DOM selector in which to add selected filters
    resetFiltersButtonContainer, // DOM selector for reset button
    filtersPopupContainer, // DOM selector in which to add filters popup
    attributeName, // Attribute name for facets
    operator, // Facets operator
    sortBy, // Facet ordering
    numberOfFacets, // Expected number of facets (displayed in popup)
    mainFacets; // Main facets filter

// Keep referance of facets selected via UI
var selectedFacets = [];
// Settings linked secondary facets (pool size, etc)
var linkedFacets = [];

// See more details in the documentation:
// https://community.algolia.com/instantsearch.js/documentation/#custom-widgets

// instantsearch.js custom widget with plain JavaScript
// First, we add ourselves to the instantsearch.widgets namespace
Paris.instantsearch.widgets.newrefinementList = function refinementList(options) {
  
  return {
    getConfiguration: function(configuration) {
      if (options.operator === 'and') {
        widgetConfiguration = {
          'facets': [options.attributeName, 'sections', 'pool_length', 'accessibility', 'is_open']
        };
      } else {
        widgetConfiguration = {
          'disjunctiveFacets': [options.attributeName, 'sections', 'pool_length', 'accessibility', 'is_open']
        };
      }

      var currentMaxValuesPerFacet = configuration.maxValuesPerFacet || 0;
      widgetConfiguration.maxValuesPerFacet = Math.max(currentMaxValuesPerFacet, options.mainFacets.length);

      return widgetConfiguration;
    },
    init: function(params) {
      helper = params.helper;
      settings = options;

      // Bind filter events
      $(options.container).on('click', '.filterButton', onClickFilterButton.bind(this));
      $(options.container).on('click', '.apply-filters-button', onClickApplySearchButton.bind(this));
      $(options.selectedFiltersContainer).on('click', '.selected-filters-buttons-container .filterButton', onClickSelectedFacetFilterButton.bind(this));
      $(options.selectedFiltersContainer).on('click', '.selected-facets-popup .filterButton', onClickSelectedFacetPopupFilterButton.bind(this));
      $(options.resetFiltersButtonContainer).on('click', 'a', onClickResetFiltersButton.bind(this));
      $(options.container).on('change', 'select', onChangeSelectSecondaryFilter.bind(this));
      $(options.container).on('change', 'input[type="checkbox"]', onCheckSecondaryFilter.bind(this));

      // Wait until window is done resizing to update some UI rendering
      var windowTimer;
      $( window ).resize(function() {
        clearTimeout(windowTimer);
        windowTimer = setTimeout(windowDoneResizing, 100);
      });

      function windowDoneResizing() {
        renderSelectedFacetFilters();
      }

      // Trigger a fake search request just to retrieve all available facets
      helper.searchOnce({
        hitsPerPage: 1,
        maxValuesPerFacet: settings.numberOfFacets
      },
        function(error, content, state) {
          // Store all possible facets values (We don't store the facet object because we need to simplify some array object search)
          $.each(content.getFacetValues(options.attributeName, {sortBy: options.sortBy}), function(i, facet) {
            facets.push(facet.name);
          });

          // Store secondary linked facets
          $.each(Paris.config.algolia.secondary_filters, function(index, val) {
            linkedFacets.push(val.linked_filter);
          });

          cleanFacets();

          // Init filter view
          initView();
          initSearchFiltersPopupEvents();
          initSelectedFiltersPopupEvents();
        }
      );
    },
    render: function(params) {
      // Nothing to re-render
    },
    getAndRenderSelectedFacets: function() {
      var selectedValues = getSelectedValues($(settings.container + ' .filterButton.active'));
      renderSelectedFacetFilters();
    }
  };
};



//////////////////////////
//// Facet management ////
//////////////////////////



// This function toggles a facet for Algolia and store the value in selectedFacets
function toggletFacet(facetFilter) {

  helper.toggleRefinement(facetFilter.facet, facetFilter.value);  

  var index = -1;

  // Check for existing facet
  $.each(selectedFacets, function(i, el) {
    if (el.facet == facetFilter.facet && el.value == facetFilter.value) {
      index = i;
      return;
    }
  });

  // If existing remove otherwise store
  if (index >= 0) {
    selectedFacets.splice(index, 1);
  } else {
    selectedFacets.push(facetFilter);
  }

  needsToDisplaySecondaryBindedFilters(facetFilter, (index >= 0));
  needsToResetSecondaryFilter(facetFilter, (index >= 0));
}

// Check if a secondary filter needs to be displayed or hidden after a facet has been toggled
function needsToDisplaySecondaryBindedFilters(facetFilter, removed) {

  if (linkedFacets.indexOf(facetFilter.value) >= 0) {
    var inputWrapper = $('.secondary-filter[data-linked-filter-id="' + facetFilter.value+'"]');
    if (removed) {
      inputWrapper.hide();
      // Reset input value and refinement
      var facet = inputWrapper.find('select').attr('name');
      helper.clearRefinements(facet);

      var index = -1;
      // Check for attached filter
      $.each(selectedFacets, function(i, el) {
        if (el.facet == facet) {
          index = i;
          return;
        }
      });

      // If attached remove
      if (index >= 0) {
        selectedFacets.splice(index, 1);
      }

      inputWrapper.find('select').val('all');

    } else {
      inputWrapper.show();
    }
  }
}

function needsToResetSecondaryFilter(facetFilter, removed) {
  // For all secondary facet types check treatment
  $.each(Paris.config.algolia.secondary_filters, function(i, el) {
    if (facetFilter.facet == el.id) {
      var inputWrapper = $('.secondary-filter[data-facet="'+ facetFilter.facet+'"]');
      if (el.type == 'select') {
        if (removed) {
          inputWrapper.find('select').val('all');
        } else {
          inputWrapper.find('select').val(facetFilter.value);
        }
      } else if (el.type == 'checkbox') {
        inputWrapper.find('input[type="checkbox"]').prop('checked', !removed);
      }
    }
  });
}

function resetFacets() {
  $.each(selectedFacets, function(i, el) {
    needsToResetSecondaryFilter(el, true);
  });
  helper.clearRefinements();
  selectedFacets = [];
  hideSecondaryLinkedFilters();
}



////////////////////
//// UI Actions ////
////////////////////



function onClickApplySearchButton(e) {
  helper.search();
  renderSelectedFacetFilters();
  $(e.target).closest('.layout-content-list').removeClass('searching');
}


// Handle click on filter button. List displaying main facets + selected facets. No secondary facets here
function onClickFilterButton(e) {
  
  e.preventDefault();

  // Find the button DOM element
  var button = $(e.target).closest('.button');
  var facetFilter = {
    facet: button.attr('data-facet'),
    value: button.attr('data-value'),
    label: button.attr('data-label')
  };
  // Toggle the button style
  button.toggleClass('active');
  toggletFacet(facetFilter);

  // Clicking filter buttons trigger search except on mobile
  if (!mediaQuery.mobileMediaQuery.matches) {
    helper.search();
  }
}

// UI click on facet filter buttons in all selected facet filters (mobile only)
function onClickSelectedFacetFilterButton(e) {
  onClickFilterButton(e);
  $(e.target.closest('button')).remove();
  updateUI();
  helper.search();
}

// UI click on facet filter buttons in all selected facet filters popup (mobile only)
function onClickSelectedFacetPopupFilterButton(e) {
  var button = $(e.target).closest('.button');
  var removedFacet = $(button).attr('data-value');
  button.remove();

  if (linkedFacets.indexOf(removedFacet) >= 0) {
    // Check for attached filter
    var selectedButtons = $(settings.selectedFiltersContainer + ' .selected-facets-popup .filterButton.active');
    $.each(selectedButtons, function(i, el) {
      var facet = $(el).attr('data-facet');
      $.each(Paris.config.algolia.secondary_filters, function(index, val) {
        if (val.linked_filter == removedFacet && facet == val.id) {
          el.remove();
        }
      });
    });
  }
}

// UI click on reset filters button
function onClickResetFiltersButton(e) {
  resetFacets();
  helper.search();
  updateUI();
}


// UI action when secondary filter of select type changes value
function onChangeSelectSecondaryFilter(e) {

  var facet = $(e.target).attr('name');
  var value = $(e.target).val();
  var label = $(e.target).find(':selected').text();

  // Copy selectedValues array because it can be modified in each loop
  var selectedValuesCopy = $.merge([], selectedFacets);
  $.each(selectedValuesCopy, function(i, el) {
    if (el.facet == facet) {
      toggletFacet(el);
    }
  });

  if (value != 'all') {
    var facetFilter = {
      facet: facet,
      value: value,
      label: label
    };
    toggletFacet(facetFilter);
  }

  // Trigger search with new facet refinement
  if (!mediaQuery.mobileMediaQuery.matches) {
    helper.search();
  }
}

// UI Action when secondary filter of type checkbox is changed
function onCheckSecondaryFilter(e) {

  var facetFilter = {
    facet: $(e.target).attr('name'),
    value: "true",
    label: $(e.target).next('span').html()
  };
  toggletFacet(facetFilter);
 
  // Trigger search with new facet refinement
  if (!mediaQuery.mobileMediaQuery.matches) {
    helper.search();
  }
}



///////////////////////
//// UI Rendering  ////
///////////////////////



function updateUI() {
  renderEquipmentsFacetFilters();
  renderSelectedFacetFilters();
}

// Render facet list
function renderEquipmentsFacetFilters() {

  var $container = $(settings.container + ' #' + equipementFacetsWrapperID);

  var content = '';
  // Append an around me button
  var data = {
    text: Paris.i18n.t('list_equipments/around_me'),
    modifiers: ["secondary", "around-me-button"]
  };
  content += Paris.templates['button']['button'](data);

  // For each main facet create html button
  $.each(settings.mainFacets, function(i, facet) {
    var data = {
      text: facet,
      modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton'],
      attributes: {
        'data-facet': 'categories',
        'data-value': facet,
        'data-label': facet
      }
    };
    // Check if the main facet is one of the selected values
    $.each(selectedFacets, function(i, el) {
      if (el.facet == 'categories' && el.value == facet) {
        data.modifiers.push('active'); 
      }
    });
    content += Paris.templates['button']['button'](data);
  });

  // Test if we have a need for main and more facets display (so we need to show more facets in a popup)
  if (facets.length > settings.mainFacets.length) {

    // Check if some selected values are not main filters.
    $.each(selectedFacets, function(i, facetFilter) {
      // If a selected value is not already a rendered main facets and of type categories, append a new filter button
      if ($.inArray(facetFilter.value, settings.mainFacets) < 0 && facetFilter.facet == 'categories') {
        var data = {
          text: facetFilter.label,
          modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton', 'active'],
          attributes: {
            'data-facet': facetFilter.facet,
            'data-value': facetFilter.value,
            'data-label': facetFilter.label
          }
        };
        content += Paris.templates['button']['button'](data); 
      }
    });

    // At the end append a more button
    var data = {
      text: Paris.i18n.t('list_equipments/more_filters'),
      modifiers: ["secondary", "small", "more-filters-button"]
    };
    content += Paris.templates['button']['button'](data);
  }

  $container.html(content);
}

function renderSecondaryFacetFilters() {

  var $container = $(settings.container + ' #' + secondaryFacetsWrapperID);

  var content = '';
  // Append secondary filters
  content += '<div class="secondary-filters">';

  $.each(Paris.config.algolia.secondary_filters, function(index, val) {
       
    content += '<div class="secondary-filter" data-linked-filter-id="'+val.linked_filter+'" data-facet="'+val.id+'">';
    content += '<span class="secondary-filter-title">'+val.title+'</span>';

    if (val.type == 'checkbox') {
      content += '<label>';
      content += '<input type="checkbox" name="'+val.id+'">';
      content += '<span>'+val.label+'</span>';
      content += '</label>';
    } else if (val.type == 'select') {
      content += '<select name="'+val.id+'" data-linked-filter-id="'+(val.linked_filter ? val.linked_filter : '')+'">';
      $.each(val.values, function(index, option) {
        content += '<option value="'+option.id+'">'+option.label+'</option>';
      });
      content += '</select>';
    }

    content += '</div>';

  });

  content += '</div>';

  // At the end append a apply button
  var data = {
    text: Paris.i18n.t('list_equipments/apply_filters'),
    modifiers: ["apply-filters-button"]
  };
  content += Paris.templates['button']['button'](data);

  $container.html(content);

  hideSecondaryLinkedFilters();
}

// Render selected facets
function renderSelectedFacetFilters() {

  // Render all selected values
  $selectedFiltersContainer = $(settings.selectedFiltersContainer);

  var content = '';
  var buttonsHTML = '';
  content += '<div class="selected-filters-buttons-container">';
  // Add categories
  $.each(selectedFacets, function(i, facetFilter) {
    var data = {
      text: facetFilter.label,
      modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton', 'active'],
      attributes: {
        'data-facet': facetFilter.facet,
        'data-value': facetFilter.value,
        'data-label': facetFilter.label
      }
    };
    buttonsHTML += Paris.templates['button']['button'](data);
  });
  content += buttonsHTML;

  // Add a more filters button
  var data = {
    text: Paris.i18n.t('list_equipments/more_filters'),
    modifiers: ["secondary", "small", "more-filters-button"]
  };
  content += Paris.templates['button']['button'](data);
  content += '</div>';

  // Render popup
  content += '<div class="list-equipment-popup selected-facets-popup">';
  content += '<div class="popup-background"></div>';
  content += '<div class="popup-content">';
  content += '<div class="filters-buttons"></div>';
  // Add popup buttons
  content += '<div class="buttons">';
  content += Paris.templates['button']['button']({
    text: Paris.i18n.t('list_equipments/cancel'),
    modifiers: ["discard", "action"]
  });
  content += Paris.templates['button']['button']({
    text: Paris.i18n.t('list_equipments/confirm'),
    modifiers: ["confirm", "action"]
  });
  content += '</div>';
  content += '</div>';
  content += '</div>';

  $selectedFiltersContainer.html(content);
  
  selectedFacetsMoreButtonDisplay();
}

function selectedFacetsMoreButtonDisplay() {
  // Set filters in one line and add a more button if needed
  $selectedFiltersContainer = $(settings.selectedFiltersContainer);
  var totalWidth = 0;
  var moreButtonWidth = 0;
  var maxWidth = $selectedFiltersContainer.width();
  var btnLeft = $selectedFiltersContainer.find('.selected-filters-buttons-container button.filterButton').length;

  $selectedFiltersContainer.find('.selected-filters-buttons-container button.more-filters-button').hide();

  setTimeout(function() {
    $selectedFiltersContainer.find('.selected-filters-buttons-container button.filterButton').each(function(i) {
      // Calculate total width
      totalWidth += $(this).width() + 50;

      // Set more filters button
      if (btnLeft > 1 ) {
        $selectedFiltersContainer.find('.selected-filters-buttons-container button.more-filters-button').html(Paris.i18n.t("list_equipments/more_filters_nb", [btnLeft - 1])); 
        $selectedFiltersContainer.find('.selected-filters-buttons-container button.more-filters-button').show();
        moreButtonWidth = $selectedFiltersContainer.find('.selected-filters-buttons-container button.more-filters-button').width() + 20;
      } else if (totalWidth < maxWidth) {
        $selectedFiltersContainer.find('.selected-filters-buttons-container button.more-filters-button').hide();
        moreButtonWidth = 0;
      }

      if (totalWidth + moreButtonWidth > maxWidth) {
        $(this).addClass('hidden');
        $selectedFiltersContainer.find('.selected-filters-buttons-container button.more-filters-button').html(Paris.i18n.t("list_equipments/more_filters_nb", [btnLeft])); 
        totalWidth += moreButtonWidth;
        return;
      } else {
        $(this).removeClass('hidden');
      }
      btnLeft--;
    });
  }, 1);
}

// Hide secondary facets dom elements
function hideSecondaryLinkedFilters() {
  $.each(Paris.config.algolia.secondary_filters, function(index, val) {
    if (val.linked_filter != undefined) {
      $('.secondary-filter[data-facet="'+ val.id+'"]').hide();
    }
  });
}

function closeSelectedFiltersPopup() {
  $(settings.selectedFiltersContainer).find('.list-equipment-popup').fadeOut(400);
}

// Render search filters popup
function renderPopup() {

  var content = '';
  content += '<div class="search-filters-container">';
  content += '<input type="text" name="search-filters" placeholder="'+Paris.i18n.t('list_equipments/search_filter')+'">';
  content += '</div>';
  content += '<div class="filters-list">';
  // For each facets build html
  $.each(facets, function(i, facet) {
    var checked = '';
    // Check if the facet is one of the selected values
    $.each(selectedFacets, function(i, el) {
      if (el.facet == 'categories' && el.value == facet) {
        checked = 'checked="checked"';
      }
    });
    content += '<label><input type="checkbox" name="categories[]" value="' + facet + '" ' + checked + ' data-facet="categories" data-value="'+facet+'" data-label="'+facet+'"><span class="label-bg"></span><span class="label-txt">' + facet + '</span></label>';
  });
  content += '</div>';

  // Add popup buttons
  content += '<div class="buttons">';
  content += Paris.templates['button']['button']({
    text: Paris.i18n.t('list_equipments/cancel'),
    modifiers: ["discard", "action"]
  });
  content += Paris.templates['button']['button']({
    text: Paris.i18n.t('list_equipments/confirm'),
    modifiers: ["confirm", "action"]
  });
  content += '</div>';

  $('.popup-content').html(content);
}



//////////////////////
//// Init methods ////
//////////////////////



function initView() {
  $(settings.container).html('<div id="' + equipementFacetsWrapperID + '"></div><div id="' + secondaryFacetsWrapperID + '"></div>');
  $(settings.filtersPopupContainer).html(popupHTML);

  // Render facets filters
  renderEquipmentsFacetFilters();
  renderSecondaryFacetFilters();
}

// Init search filters popup events
function initSearchFiltersPopupEvents() {
  // Open popup event
  $(settings.container).on('click', '.more-filters-button', function(event) {
    
    // Render popup with selected values
    renderPopup();
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
  $(settings.filtersPopupContainer).on('click', '.discard', function(event) {
    $(settings.filtersPopupContainer).fadeOut();
  });

  // Confirm popup
  $(settings.filtersPopupContainer).on('click', '.confirm', function(event) {

    // To ease treatment reset everything upon applying filters
    resetFacets();

    var selectedFacetFilters = getSelectedValues($(settings.filtersPopupContainer).find('.filters-list input[type="checkbox"]:checked'));

    // Apply value selected in popup
    $.each(selectedFacetFilters, function(i, facetFilter) {
      toggletFacet(facetFilter);
    });

    // Render UI
    updateUI();

    // Trigger search with new facet refinement
    if (!mediaQuery.mobileMediaQuery.matches) {
      helper.search();
    }

    $(settings.filtersPopupContainer).fadeOut();
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
  $(settings.filtersPopupContainer).on('input', 'input[name="search-filters"]', function(event) {
    $('.filters-list label').hide();
    $('.filters-list label:contains('+$(this).val()+')').show();
  });
}

// Init selected filters popup events
function initSelectedFiltersPopupEvents() {
  // Open popup event
  $(settings.selectedFiltersContainer).on('click', '.more-filters-button', function(event) {
    
    // Set popup content
    var $button = $selectedFiltersContainer.find('.selected-filters-buttons-container button.filterButton').clone();
    $(settings.selectedFiltersContainer).find('.list-equipment-popup .filters-buttons').html($button);
    $(settings.selectedFiltersContainer).find('.list-equipment-popup .filters-buttons .filterButton').removeClass('hidden');

    // Show popup
    $(settings.selectedFiltersContainer).find('.list-equipment-popup').fadeIn(400);
  });

  // Discard popup
  $(settings.selectedFiltersContainer).on('click', '.discard', function(event) {
    // Close popup
    closeSelectedFiltersPopup();
  });

  // Confirm popup
  // UI click when apply and closing popup showing all selected facet filters (mobile only)
  $(settings.selectedFiltersContainer).on('click', '.confirm', function(event) {
    var selectedFacetFilters = getSelectedValues($(settings.selectedFiltersContainer + ' .selected-facets-popup .filterButton.active'));
    
    // To ease treatment reset everything upon applying filters
    resetFacets();

    // Apply value selected in popup
    $.each(selectedFacetFilters, function(i, facetFilter) {
      toggletFacet(facetFilter);
    });
    // Render UI
    updateUI();
    // Refresh results
    helper.search();

    // Close popup
    closeSelectedFiltersPopup();
  });
}



////////////////////////
//// Helper methods ////
////////////////////////



// Clean not valid facets passed as parameters
function cleanFacets() {
  settings.mainFacets = $.grep(settings.mainFacets, function(n, i) {
    return $.inArray(n, facets) >= 0;
  });
}

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