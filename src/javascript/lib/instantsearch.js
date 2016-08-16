// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

Paris.instantsearch = {widgets: {}};

// See more details in the documentation:
// https://community.algolia.com/instantsearch.js/documentation/#custom-widgets

// Extending the instantsearch.widgets namespace, like regular widgets
Paris.instantsearch.widgets.customSelectorWidget = function customSelectorWidget({
  container,
  attributeName,
  limit = 10,
  operator = 'or',
  maxValuesPerFacet = 10,
  sortBy = ['count:desc', 'name:asc'],
  numberOfFacets = 200,
  moreButtonText = 'Afficher la liste complète'
}) {
 
  var helper;
  var facets = [];
  var wrapperSelector = 'facet-list-wrapper';
  var popupHTML = '<div class="block-search-filters-popup"><div class="popup-background"></div><div class="popup-content"></div></div>';

  return {
    // Method called at startup, to configure the Algolia settings
    getConfiguration(configuration) {
      var widgetConfiguration = {
        [operator === 'and' ? 'facets' : 'disjunctiveFacets']: [attributeName]
      };

      var currentMaxValuesPerFacet = configuration.maxValuesPerFacet || 0;
      widgetConfiguration.maxValuesPerFacet = Math.max(currentMaxValuesPerFacet, limit);

      console.log(widgetConfiguration);
      return widgetConfiguration;
    },

    // Called on the first instantsearch search
    init({helper}) {

      this.helper = helper;

      $(container).on('click', '.filterButton', this.onClickButton.bind(this));

      // Changing the number of records returned per page to 1
      // This example uses the callback API
      that = this;
      helper.searchOnce({
        hitsPerPage: 1,
        // hierarchicalFacets: [{
        //   name: attributeName,
        //   attributes: [attributeName]
        // }],
        maxValuesPerFacet: numberOfFacets
      },
        function(error, content, state) {
          // Store all possible facets
          $.each(content.getFacetValues(attributeName, sortBy), function(i, facet) {
            facets.push(facet.name);
          });
          // Init filter view
          that.initView();
          that.initSearchFiltersPopupEvents();
        }
      );
    },

    // Called whenever we receive new results from Algolia. This widget does not render anything after each search
    render({results}) {
    },

    // Handle filter select action
    onClickButton(e) {
      e.preventDefault();
      var $this = $(e.target).closest('.button');
      $this.toggleClass('active');
      var value = $this.text();
      this.toggleRefinement(value);
    },

    // Toggling filter
    toggleRefinement(facetValue) {
      console.log(facetValue);
      this.helper
        .toggleRefinement(attributeName, facetValue)
        .search();
    },

    initView() {
      var $container = $(container);

      var content = '<div id="' + wrapperSelector + '"></div>';
      content += popupHTML;

      $container.html(content);

      this.renderList([]);
    },

    initSearchFiltersPopupEvents() {

      var that = this;

      // Open popup
      $('.block-search-filters .block-search-content').on('click', '.more-filters-button', function(event) {
        var selectedValues = [];
        $.each($(container + ' .filterButton.active'), function(i, el) {
          console.log($(el).text());
          selectedValues.push($(el).text());
        });
        console.log(selectedValues);
        that.renderPopup(selectedValues);
        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeIn();
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

        var inputs = $('.block-search-filters .filters-list input[type="checkbox"]:checked');
        console.log(inputs);
        var selectedValues = [];
        that.helper.clearRefinements();
        $.each(inputs, function(i, input) {
          console.log(input.value);
          selectedValues.push(input.value);
          that.helper.toggleRefinement(attributeName, input.value);
        });

        that.renderList(selectedValues);

        $('.block-search-filters .block-search-content .block-search-filters-popup').fadeOut();
        
        that.helper.search();
      });
    },

    renderList(selectedValues) {

      var $container = $(container + ' #' + wrapperSelector);

      var content = '';
      $.each(facets.slice(0, limit), function(i, facet) {
        var data = {
          text: facet,
          modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton']
        };

        if ($.inArray(facet, selectedValues) >= 0) {
          data.modifiers.push('active'); 
        }
        content += Paris.templates['button']['button'](data);
      });

      var mainFacets = facets.slice(0, limit);
      $.each(selectedValues, function(i, value) {
        console.log(value);
        if ($.inArray(value, mainFacets) < 0) {
          console.log('iidzizdiza');
          var data = {
            text: value,
            modifiers: ['stateful', 'white', 'small', 'icon', 'filterButton', 'active']
          };

          
          content += Paris.templates['button']['button'](data); 
        }
      });

      if (facets.length > limit) {
        var data = {
          text: moreButtonText,
          modifiers: ["secondary", "small", "more-filters-button"]
        };
        content += Paris.templates['button']['button'](data);
      }

      $container.html(content);
    },

    renderPopup(selectedValues) {

      var content = '';
      content += '<div class="filters-list">';
      $.each(facets, function(i, facet) {
        var checked = ($.inArray(facet, selectedValues) >= 0) ? 'checked="checked"' : '';
        content += '<label><input type="checkbox" name="categories[]" value="' + facet + '" ' + checked + '><span>' + facet + '</span></label>';
      });
      content += '</div>';

      if (facets.length > limit) {
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
      }

      $('.popup-content').html(content);
    }

  }
};
