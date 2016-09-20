// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

var helper;
// Store all facets values
var facets = [];
// Internal selector ID for facet list html rendering
var wrapperSelectorID = 'facet-list-wrapper';
// Base HTML code for popup
var popupHTML = '<div class="block-search-filters-popup"><div class="popup-background"></div><div class="popup-content"></div></div>';
var settings;
var mediaQuery = {
  mobileMediaQuery: window.matchMedia("(max-width: 767px)")
};

var container, // DOM selector in which to add UI
  selectedFiltersContainer, // DOM selector in which to add selected filters
  filtersPopupContainer, // DOM selector in which to add filters popup
  attributeName, // Attribute name for facets
  operator, // Facets operator
  sortBy, // Facet ordering
  numberOfFacets, // Expected number of facets (displayed in popup)
  mainFacets; // Main facets filter

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

      var _this = this;

      // Bind filter button event
      $(options.container).on('click', '.filterButton', onClickButton.bind(this));
      $(options.container).on('click', '.apply-filters-button', onClickApplyButton.bind(this));
      $(options.selectedFiltersContainer).on('click', '.filterButton', onClickSelectedFilter.bind(this));
      $(options.container).on('change', 'select', onChangeSelectSecondaryFilter.bind(this));
      $(options.container).on('change', 'input[type="checkbox"]', onCheckSecondaryFilter.bind(this));


      var windowTimer;
      $( window ).resize(function() {
        clearTimeout(windowTimer);
        windowTimer = setTimeout(windowDoneResizing, 100);
      });

      function windowDoneResizing() {
        selectedFacetsDisplay();
      }

      // Trigger a fake search request just to retrieve all available facets
      helper.searchOnce({
        hitsPerPage: 1,
        // hierarchicalFacets: [{
        //   name: attributeName,
        //   attributes: [attributeName]
        // }],
        maxValuesPerFacet: settings.numberOfFacets
      },
        function(error, content, state) {
          // Store all possible facets values (We don't store the facet object because we need to simplify some array object search)
          $.each(content.getFacetValues(options.attributeName, {sortBy: options.sortBy}), function(i, facet) {
            facets.push(facet.name);
          });

          prepareFacets();

          // Init filter view
          initView();
          initSearchFiltersPopupEvents();
          initSelectedFiltersPopupEvents();
        }
      );

      // Use change event to detect facets reseting action
      helper.on('change', function(state, lastResults) {
        var refinementCount = 0;
        if (options.operator === 'and') {
          refinementCount = state.facetsRefinement[options.attributeName] ? state.facetsRefinement[options.attributeName].length : 0;
        } else {
          refinementCount = state.disjunctiveFacetsRefinements[options.attributeName] ? state.disjunctiveFacetsRefinements[options.attributeName].length : 0;
        }
        if (refinementCount == 0 && $(options.container + ' .filterButton.active').length > 0) {
          renderList([]);
        }
      });
    },
    render: function(params) {
      // Nothing to re-render
    },
    getAndRenderSelectedFacets: function() {
      var selectedValues = getSelectedValues($(settings.container + ' .filterButton.active'));
      renderSelectedFacets(selectedValues);
    }
  };
};

// Get 
function getSelectedValues(parentSelector) {

  var selectedValues = [];
  $.each(parentSelector, function(i, el) {
    selectedValues.push($(el).text());
  });
  return selectedValues;
}

// Handle facet click action
function onClickButton(e) {
  
  e.preventDefault();

  // Find the button DOM element
  var $this = $(e.target).closest('.button');
  
  // Toggle the button
  $this.toggleClass('active');

  // Toggle facet and force new search request
  if ($this.attr('data-value') && $this.attr('data-value') != undefined) { // button or select
    helper.toggleRefinement($this.attr('data-facet'), $this.attr('data-value'));
  } else { // checkbox
    var isChecked = $this.is(':checked');
    if (isChecked) {
      helper.toggleRefinement($this.attr('data-facet'), isChecked.toString());
    } else {
        helper.clearRefinements($this.attr('data-facet'));
    }
  }

  // Handle secondary filters display
  handleSecondaryFilters();

  if (!mediaQuery.mobileMediaQuery.matches) {
    helper.search();
  }
}

function onClickApplyButton(e) {
  helper.search();
  var selectedValues = getSelectedValues($(settings.container + ' .filterButton.active'));
  renderSelectedFacets(selectedValues);
  $(e.target).closest('.layout-content-list').removeClass('searching');
}

function onClickSelectedFilter(e) {
  onClickButton(e);

  var facet = $(e.target).closest('.filterButton').attr('data-facet');
  var value =  $(e.target).closest('.filterButton').attr('data-value');

  // Remove clicked filter and filters that depend on it
  $(e.target).closest('.filterButton').remove();
  $(settings.selectedFiltersContainer + ' .selected-filters-buttons-container .filterButton[data-linked-filter-id="'+value+'"]').remove();

  selectedFacetsDisplay();
  // Get selected values and toggle them
  var selectedValues = getSelectedValues($(settings.selectedFiltersContainer + ' .selected-filters-buttons-container .filterButton.active'));
  // Render list with selected values
  renderList(selectedValues);
  helper.search();
}

function onChangeSelectSecondaryFilter(e) {
  var value = $(e.target).val();
  var attributeName = $(e.target).attr('name');
  helper.clearRefinements(attributeName);
  if (value != 'all') {
    helper.toggleRefinement(attributeName, value);
  }
  // Trigger search with new facet refinement
  if (!mediaQuery.mobileMediaQuery.matches) {
    helper.search();
  }
}

function onCheckSecondaryFilter(e) {
  var isChecked = $(e.target).is(':checked');
  var attributeName = $(e.target).attr('name');
  if (isChecked) {
    helper.toggleRefinement(attributeName, isChecked.toString());
  } else {
      helper.clearRefinements(attributeName);
  }
  // Trigger search with new facet refinement
  if (!mediaQuery.mobileMediaQuery.matches) {
    helper.search();
  }
}

function prepareFacets() {
  // Clean not valid facets passed as parameters
  settings.mainFacets = $.grep(settings.mainFacets, function(n, i) {
    return $.inArray(n, facets) >= 0;
  });
}

function initView() {
  $(settings.container).html('<div id="' + wrapperSelectorID + '"></div>');
  $(settings.filtersPopupContainer).html(popupHTML);

  // Render list with no selected values
  renderList([]);
}

// Init search filters popup events
function initSearchFiltersPopupEvents() {
  // Open popup event
  $(settings.container).on('click', '.more-filters-button', function(event) {
    // Get current selected values
    var selectedValues = getSelectedValues($(settings.container + ' .filterButton.active'));
    // Render popup with selected values
    renderPopup(selectedValues);
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
    var selectedValues = [];
    var inputs = $(settings.filtersPopupContainer).find('.filters-list input[type="checkbox"]:checked');
    // Clear all facets refinements of Algolia's helper
    helper.clearRefinements();
    // Get selected values and toggle them
    $.each(inputs, function(i, input) {
      selectedValues.push(input.value);
      helper.toggleRefinement(settings.attributeName, input.value);
    });

    // Render list with selected values
    renderList(selectedValues);
    renderSelectedFacets(selectedValues);
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
  $(settings.selectedFiltersContainer).on('click', '.confirm', function(event) {

    // Close popup
    closeSelectedFiltersPopup();
  });
}

function closeSelectedFiltersPopup() {
  $(settings.selectedFiltersContainer).find('.list-equipment-popup').fadeOut(400);
}

// Render facet list
function renderList(selectedValues) {

  var $container = $(settings.container + ' #' + wrapperSelectorID);

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
    // If selected set to active
    if ($.inArray(facet, selectedValues) >= 0) {
      data.modifiers.push('active'); 
    }
    content += Paris.templates['button']['button'](data);
  });

  // Test if we have a need for main and second facets display (so we need to show more facets in a popup)
  if (facets.length > settings.mainFacets.length) {

    // Check if some selected values are not main filters.
    $.each(selectedValues, function(i, value) {
      // If a selected value is not already a rendered main facets, append a new filter button
      if ($.inArray(value, settings.mainFacets) < 0) {
        var data = {
          text: value,
          modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton', 'active'],
          attributes: {
            'data-facet': 'categories',
            'data-value': value,
            'data-label': value
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

  // Append secondary filters
  content += '<div class="secondary-filters">';

  $.each(Paris.config.algolia.secondary_filters, function(index, val) {
       
    content += '<div class="secondary-filter">';
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

  $(settings.container).html(content);

  // Handle secondary filters display
  handleSecondaryFilters();
}

function handleSecondaryFilters() {

  // Handle secondary filters
  $.each($('.secondary-filters select'), function(i, el) {
    var linked_filter = $(el).attr('data-linked-filter-id');
    var selectedValues = getSelectedValues($(settings.container + ' .filterButton.active'));
    if (linked_filter && linked_filter != 'undefined') {
      if (selectedValues.indexOf(linked_filter) != -1) {
        $(this).closest('.secondary-filter').show();
      } else {
        var attributeName = $(el).attr('name');
        helper.clearRefinements(attributeName);
        $(el).val('all');
        $(this).closest('.secondary-filter').hide();
      }
    }
  });
}

// Render selected facets
function renderSelectedFacets(selectedValues) {

  // Render all selected values
  $selectedFiltersContainer = $(settings.selectedFiltersContainer);

  var content = '';
  var buttonsHTML = '';
  content += '<div class="selected-filters-buttons-container">';
  // Add categories
  $.each(selectedValues, function(i, value) {
    var data = {
      text: value,
      modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton', 'active'],
      attributes: {
        'data-facet': 'categories',
        'data-value': value,
        'data-label': value
      }
    };
    buttonsHTML += Paris.templates['button']['button'](data);
  });
  // Add secondary filters (select)
  $.each($('.secondary-filters .secondary-filter select'), function(i, el) {
    var facet = $(el).attr('name');
    var value = $(el).val();
    var label = $(el).find(':selected').text();
    var linkedFilter = ($(el).attr('data-linked-filter-id') ? $(el).attr('data-linked-filter-id') : '');
    if (value && value != 'all') {
      var data = {
        text: label,
        modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton', 'active'],
        attributes: {
          'data-facet': facet,
          'data-value': value,
          'data-label': label,
          'data-linked-filter-id': linkedFilter
        }
      };
      buttonsHTML += Paris.templates['button']['button'](data);
    }
  });
  // Add secondary filters (checkbox)
  $.each($('.secondary-filters .secondary-filter input[type="checkbox"]'), function(i, el) {
    var facet = $(el).attr('name');
    var value = $(el).is(':checked');
    var label = $(el).next('span').text();
    var linkedFilter = ($(el).attr('data-linked-filter-id') ? $(el).attr('data-linked-filter-id') : '');
    if (value) {
      var data = {
        text: label,
        modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton', 'active'],
        attributes: {
          'data-facet': facet,
          'data-value': value.toString,
          'data-label': label,
          'data-linked-filter-id': linkedFilter
        }
      };
      buttonsHTML += Paris.templates['button']['button'](data);
    }
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
  
  selectedFacetsDisplay();
}

function selectedFacetsDisplay() {
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

// Render search filters popup
function renderPopup(selectedValues) {

  var content = '';
  content += '<div class="search-filters-container">';
  content += '<input type="text" name="search-filters" placeholder="'+Paris.i18n.t('list_equipments/search_filter')+'">';
  content += '</div>';
  content += '<div class="filters-list">';
  // For each facets build html
  $.each(facets, function(i, facet) {
    var checked = ($.inArray(facet, selectedValues) >= 0) ? 'checked="checked"' : '';
    content += '<label><input type="checkbox" name="categories[]" value="' + facet + '" ' + checked + '><span class="label-bg"></span><span class="label-txt">' + facet + '</span></label>';
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