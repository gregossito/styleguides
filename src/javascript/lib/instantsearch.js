// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

Paris.instantsearch = {widgets: {}};

// See more details in the documentation:
// https://community.algolia.com/instantsearch.js/documentation/#custom-widgets

// Extending the instantsearch.widgets namespace, like regular widgets
// TODO: All html generated code could be a Paris module
Paris.instantsearch.widgets.refinementList = function refinementList({
  container, // DOM selector in which to add UI
  attributeName, // Attribute name for facets
  limit, // Limit of main facets
  operator, // Facets operator
  sortBy, // Facet ordering
  numberOfFacets, // Expected number of facets (displayed in popup)
  moreButtonText, // Text for more facets button
  applyButtonText // Text for apply facets button
}) {
  var helper;
  // Store all facets values
  var facets = [];
  // Internal selector ID for facet list html rendering
  var wrapperSelectorID = 'facet-list-wrapper';
  // Base HTML code for popup
  var popupHTML = '<div class="block-search-filters-popup"><div class="popup-background"></div><div class="popup-content"></div></div>';


  var options = {
    mobileMediaQuery: window.matchMedia("(max-width: 767px)")
  };

  return {

    getConfiguration(configuration) {
      var widgetConfiguration = {
        [operator === 'and' ? 'facets' : 'disjunctiveFacets']: [attributeName]
      };

      var currentMaxValuesPerFacet = configuration.maxValuesPerFacet || 0;
      widgetConfiguration.maxValuesPerFacet = Math.max(currentMaxValuesPerFacet, limit);

      return widgetConfiguration;
    },

    // Initiate widget
    init({helper}) {

      this.helper = helper;

      // Bind filter button event
      $(container).on('click', '.filterButton', this.onClickButton.bind(this));
      $(container).on('click', '.apply-filters-button', this.onClickApplyButton.bind(this));

      var _this = this;

      // Trigger a fake search request just to retrieve all available facets
      helper.searchOnce({
        hitsPerPage: 1,
        // hierarchicalFacets: [{
        //   name: attributeName,
        //   attributes: [attributeName]
        // }],
        maxValuesPerFacet: numberOfFacets
      },
        function(error, content, state) {
          // Store all possible facets values (We don't store the facet object because we need to simplify some array object search)
          $.each(content.getFacetValues(attributeName, {sortBy}), function(i, facet) {
            facets.push(facet.name);
          });
          // Init filter view
          _this.initView();
          _this.initSearchFiltersPopupEvents();
        }
      );

      // Use change event to detect facets reseting action
      helper.on('change', function(state, lastResults) {
        var refinementCount = 0;
        if (operator === 'and') {
          refinementCount = state.facetsRefinement[attributeName] ? state.facetsRefinement[attributeName].length : 0;
        } else {
          refinementCount = state.disjunctiveFacetsRefinements[attributeName] ? state.disjunctiveFacetsRefinements[attributeName].length : 0;
        }
        if (refinementCount == 0 && $(container + ' .filterButton.active').length > 0) {
          _this.renderList([]);
        }
      });
    },

    // Called whenever we receive new results from Algolia. This widget does not render anything after each search
    render({results}) {
      // Nothing to re-render
    },

    // Handle facet click action
    onClickButton(e) {
      e.preventDefault();
      // Find the button DOM element
      var $this = $(e.target).closest('.button');
      // Toggle the button
      $this.toggleClass('active');

      // Toggle facet and force new search request
      this.helper.toggleRefinement(attributeName,$this.text());

      if (!options.mobileMediaQuery.matches) {
        this.helper.search();
      }
    },

    onClickApplyButton(e) {
      this.helper.search();
      $(e.target).closest('.layout-content-list').removeClass('searching');
    },

    // Initiate view
    initView() {
      var $container = $(container);

      // Build html for rendering
      var content = '<div id="' + wrapperSelectorID + '"></div>';
      content += popupHTML;

      $container.html(content);

      // Render list with no selected values
      this.renderList([]);
    },

    // Init popup events
    initSearchFiltersPopupEvents() {

      var _this = this;

      // Open popup event
      $('.block-search-filters .block-search-content').on('click', '.more-filters-button', function(event) {
        // Get current selected values
        var selectedValues = [];
        $.each($(container + ' .filterButton.active'), function(i, el) {
          selectedValues.push($(el).text());
        });
        // Render popup with selected values
        _this.renderPopup(selectedValues);
        // Show popup
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeIn(400, function() {
          $('input[type="text"]').focus();
        });
      });

      // Close popup
      $('.block-search-filters .block-search-content .block-search-filters-popup').on('click', '.popup-background', function(event) {
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
      });

      // Discard popup
      $('.block-search-filters .block-search-content .block-search-filters-popup').on('click', '.discard', function(event) {
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
      });

      // Confirm popup
      $('.block-search-filters .block-search-content .block-search-filters-popup').on('click', '.confirm', function(event) {
        var selectedValues = [];
        var inputs = $('.block-search-filters .filters-list input[type="checkbox"]:checked');
        // Clear all facets refinements of Algolia's helper
        _this.helper.clearRefinements();
        // Get selected values and toggle them
        $.each(inputs, function(i, input) {
          selectedValues.push(input.value);
          _this.helper.toggleRefinement(attributeName, input.value);
        });

        // Render list with selected values
        _this.renderList(selectedValues);
        // Trigger search with new facet refinement
        _this.helper.search();

        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
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
      $('.block-search-filters .block-search-content .block-search-filters-popup').on('input', 'input[name="search-filters"]', function(event) {
        $('.filters-list label').hide();
        $('.filters-list label:contains('+$(this).val()+')').show();
      });
    },

    // Render facet list
    renderList(selectedValues) {

      var $container = $(container + ' #' + wrapperSelectorID);

      var content = '';
      // For each main facet create html button
      $.each(facets.slice(0, limit), function(i, facet) {
        var data = {
          text: facet,
          modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton']
        };
        // If selected set to active
        if ($.inArray(facet, selectedValues) >= 0) {
          data.modifiers.push('active'); 
        }
        content += Paris.templates['button']['button'](data);
      });

      // Test if we have a need for main and second facets display (so we need to show more facets in a popup)
      if (facets.length > limit) {

        var mainFacets = facets.slice(0, limit);
        // Check if some selected values are not main filters.
        $.each(selectedValues, function(i, value) {
          // If a selected value is not already a rendered main facets, append a new filter button
          if ($.inArray(value, mainFacets) < 0) {
            var data = {
              text: value,
              modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton', 'active']
            };
            content += Paris.templates['button']['button'](data); 
          }
        });

        // At the end append a more button
        var data = {
          text: moreButtonText,
          modifiers: ["secondary", "small", "more-filters-button"]
        };
        content += Paris.templates['button']['button'](data);

        // At the end append a apply button
        var data = {
          text: applyButtonText,
          modifiers: ["apply-filters-button"]
        };
        content += Paris.templates['button']['button'](data);
      }

      $container.html(content);
    },

    // Render popup
    renderPopup(selectedValues) {

      var content = '';
      content += '<div class="search-filters-container">';
      content += '<input type="text" name="search-filters" placeholder="Rechercher un filtre...">';
      content += '</div>';
      content += '<div class="filters-list">';
      // For each facets build html
      $.each(facets, function(i, facet) {
        var checked = ($.inArray(facet, selectedValues) >= 0) ? 'checked="checked"' : '';
        content += '<label><input type="checkbox" name="categories[]" value="' + facet + '" ' + checked + '><span>' + facet + '</span></label>';
      });
      content += '</div>';

      // Add popup buttons
      content += '<div class="buttons">';
      content += Paris.templates['button']['button']({
        text: 'Annuler',
        modifiers: ["discard", "action"]
      });
      content += Paris.templates['button']['button']({
        text: 'Valider',
        modifiers: ["confirm", "action"]
      });
      content += '</div>';

      $('.popup-content').html(content);
    }

  }
};
