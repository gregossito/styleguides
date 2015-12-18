// instantsearch.js custom widgets for Paris.fr

var Paris = window.Paris || {};

Paris.instantsearch = {widgets: {}};

// See more details in the documentation:
// https://community.algolia.com/instantsearch.js/documentation/#custom-widgets

Paris.instantsearch.widgets.refinementList = function(options) {
  return {
    getConfiguration: function(configuration) {
      var widgetConfiguration = {
        [options.operator === 'and' ? 'facets' : 'disjunctiveFacets']: [options.attributeName]
      };

      var currentMaxValuesPerFacet = configuration.maxValuesPerFacet || 0;
      widgetConfiguration.maxValuesPerFacet = Math.max(currentMaxValuesPerFacet, options.limit);

      return widgetConfiguration;
    },
    init: function(params) {
      var $container = $(options.container);
      this.helper = params.helper;
      $container.on('click', '.button', this.onClickButton.bind(this));
    },
    toggleRefinement: function(helper, facetValue){
      helper
        .toggleRefinement(options.attributeName, facetValue)
        .search();
    },
    onClickButton: function(e){
      e.preventDefault();
      var $this = $(e.target);
      $this.toggleClass('active');
      var value = $this.text();
      this.toggleRefinement(this.helper, value);
    },
    render: function(params) {
      var results = params.results;
      var $container = $(options.container);

      var facetValues = results.getFacetValues(options.attributeName, {sortBy: options.sortBy || ['count:desc']}).slice(0, options.limit);

      var content = '';

      $.each(facetValues, function(i, facet){
        var data = {
          text: facet.name,
          title: facet.count,
          modifiers: ['stateful', 'white', 'small', 'icon']
        };
        if (facet.isRefined) {data.modifiers.push('active');}
        content += Paris.templates["button"]["button"](data);
      });

      $container.html(content);
    }
  }
};
