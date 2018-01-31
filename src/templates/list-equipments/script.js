'use strict';
require('velocity-animate');

var algoliasearch = require('algoliasearch');
var instantsearch = require('instantsearch.js');
var Flickity = require('flickity-imagesloaded');
var autocomplete = require('autocomplete.js');
var places = require('places.js');
var placesAutocompleteDataset =  require('places.js/autocompleteDataset');

var Paris = window.Paris || {};

Paris.listEquipments = (function(){

  var defaultOptions = {
    // the Algolia index to use (should be defined in config.js)
    index: 'equipments',
    searchParams: {
      "attributesToRetrieve": "*"
    },
    mobileMediaQuery: window.matchMedia("(max-width: 767px)")
  };

  var flkyCarousel;
  var firstLoad = true;

  function listEquipments(selector, userOptions) {
    var $el = $(selector),
        options = $.extend({}, defaultOptions, userOptions),
        placeQuery = '',
        mainSearch,
        mapSearch;

    function init() {
      initOptions();

      // Init instantsearch
      mapSearch = instantsearch({
        appId: Paris.config.algolia.id,
        apiKey: Paris.config.algolia.api_key,
        indexName: Paris.config.algolia.indexes[options.index],
        // searchFunction: function(helper) {
        //   var mapState = mapSearch.helper.getState();
        //   if (mapState.insideBoundingBox) {
        //     console.log(mapState.insideBoundingBox);
        //     // mainSearch.helper.insideBoundingBox = mapState.insideBoundingBox;
        //     // mainSearch.helper.search();
        //   }
        //   helper.search();
        // },
        searchParameters: {
          hitsPerPage: 1000 // set it for the first search
        }
      });

      mainSearch = instantsearch({
        appId: Paris.config.algolia.id,
        apiKey: Paris.config.algolia.api_key,
        indexName: Paris.config.algolia.indexes[options.index],
        searchFunction: function(helper) {
          var mainState = mainSearch.helper.getState();
          mainState.hitsPerPage = 1000; // force display of 1k hits
          mainState.page = 0; // force displaying only first page
          mapSearch.helper.setState(mainState);
          mapSearch.helper.search();
          helper.search();
        },
        searchParameters: options.searchParams,
        numberLocale: "fr"
      });

      // Search box widget
      mainSearch.addWidget(
        instantsearch.widgets.searchBox({
          container: '.block-search-field .search-field-input',
          magnifier: false,
          searchOnEnterKeyPressOnly: true
        })
      );

      // Custom reset button widget
      mainSearch.addWidget(
        Paris.instantsearch.widgets.resetButton({
          container: '#js-resetbutton',
          attributeName: 'category_names',
          operator: 'or',
          defaultFacets: Paris.config.algolia.main_facets
        })
      );

      // Current refined values widget
      mainSearch.addWidget(
        instantsearch.widgets.currentRefinedValues({
          container: '#js-currentrefined',
          cssClasses: {
            root: "block-search-filters-items",
            item: "block-search-filters-item",
            link: "button closable white small icon"
          },
          clearAll: false,
          attributes: [
            {name: "category_names"}
          ],
          onlyListedAttributes: true,
          templates: {
            item: '{{#icon}}<i aria-hidden="true" class="icon icon-{{icon}}"></i>{{/icon}}{{name}}'
          },
          transformData: function(item){
            // Add the icon if found in config
            var icon = $.grep(Paris.config.algolia.main_facets_icon, function(facetIcon) {
              return (facetIcon.facet == item.name);
            });
            if (icon.length) {
              item.icon = icon[0].icon;
            };
            return item;
          }
        })
      );

      // Refinement list widget
      // We use this widget as an autocomplete for categories (hence the "weird" config).
      mainSearch.addWidget(
        instantsearch.widgets.refinementList({
          container: "#js-refinementlist",
          attributeName: 'category_names',
          operator: 'or',
          limit: 5,
          searchForFacetValues: {
            placeholder: "Saisir une catégorie...",
            isAlwaysActive: true,
            templates: {
              noResults: '<label class="block-search-filters-autocomplete-item is-disabled">Aucune catégorie trouvée.</label>'
            }
          },
          sortBy: ["refined:desc", "name:asc"],
          cssClasses: {
            label: "block-search-filters-autocomplete-item"
          },
          templates: {
            item: '<label class="{{cssClasses.label}}">{{{highlighted}}}</label>',
          },
          transformData: function(item){
            var isSearching = $(".sbx-sffv__input").val() != '';
            if (!isSearching || item.isRefined) return {};
            return item;
          }
        })
      );

      // Popup refinement list widget
      mainSearch.addWidget(
        instantsearch.widgets.refinementList({
          container: "#js-popup-refinementlist",
          attributeName: 'category_names',
          operator: 'or',
          limit: 200,
          searchForFacetValues: false,
          sortBy: ["name:asc"],
          templates: {
            item: '<label class="{{cssClasses.label}}"><input type="checkbox" class="{{cssClasses.checkbox}}" value="{{value}}" {{#isRefined}}checked{{/isRefined}} /><span class="label-bg"></span><span class="label-txt">{{{highlighted}}}</span></label>'
          }
        })
      );

      // Stats widget
      mainSearch.addWidget(
        instantsearch.widgets.stats({
          container: '#stats-container',
          templates: {
            body: "{{#hasNoResults}}Aucun résultat{{/hasNoResults}}{{#hasOneResult}}Un résultat{{/hasOneResult}}{{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} résultats{{/hasManyResults}}"
          }
        })
      );

      // Is open
      mainSearch.addWidget(
        instantsearch.widgets.toggle({
          attributeName: 'is_open',
          autoHideContainer: false,
          container: '#js-facet-open',
          label: 'Ouvert maintenant',
          values: {
            on: true,
          },
          templates: {
            header: 'Ouverture',
            item: '<label class="{{cssClasses.label}}"><input type="checkbox" class="{{cssClasses.checkbox}}" value="{{name}}" {{#isRefined}}checked{{/isRefined}} />{{name}}</label>'
          }
        })
      );

      // Accessibility
      mainSearch.addWidget(
        instantsearch.widgets.menuSelect({
          attributeName: 'accessibility',
          container: '#js-facet-accessibility',
          templates: {
            header: "Accessibilité",
            seeAllOption: "Sans handicap"
          }
        })
      );

      // Search results widget
      mainSearch.addWidget(
        instantsearch.widgets.infiniteHits({
          container: '#hits-container',
          templates: {
            empty: '<p>' + Paris.i18n.t('list_equipments/no_result') + '<br>' + Paris.templates['button']['button']({ text: 'Dézoomer', modifiers: ["secondary", "zoom-out-button"]}) + '</p>',
            item: '<a href="{{url}}" class="card is-open-{{is_open}} cat-{{icon}}" data-hitid="{{objectID}}" data-lat="{{_geoloc.lat}}" data-lng="{{_geoloc.lng}}"><div{{#smaller_header_image}} style="background-image: url({{smaller_header_image}})"{{/smaller_header_image}} class="card-image {{^smaller_header_image}}no-img {{/smaller_header_image}}"></div><div class="card-content"><h3 class="card-title">{{name}}</h3><div class="card-text"><span class="card-address">{{address_street}}</span><br><span class="card-zipcode">{{address_postcode}}</span> <span class="card-city">{{address_city}}</span></div>{{#open_details}}<div class="card-hours {{#is_open}} open {{/is_open}} {{^is_open}} close {{/is_open}}" data-open="{{is_open}}">{{open_details}}</div>{{/open_details}}</div></a>'
          },
          cssClasses: {
            root: 'carousel',
            item: 'carousel-cell'
          }
        })
      );

      // Leaflet widget
      var leafletWidget = Paris.instantsearch.widgets.leaflet({
        container: '#map',
        openedHit: function(hitID) {
          // // [desktop] Add inactive class
          // var addClassDelay = ($('#hits-container .card[data-hitid="'+hitID+'"]').length > 0) ? 0 : 100;
          // setTimeout(function() {
          //   $('#hits-container .card').addClass('inactive');
          //   $('#hits-container .card[data-hitid="'+hitID+'"]').removeClass('inactive');
          // }, addClassDelay);
          //
          // // [mobile] Go to slide
          // if (flkyCarousel && flkyCarousel != undefined) {
          //   var index = $('#hits-container .card[data-hitid="'+hitID+'"]').closest('.carousel-cell').prevAll().length;
          //   flkyCarousel.select(index);
          // }
        },
        popupHTMLForHit: function(hit) {
          return renderMapPopupContent(hit);
        }
      });

      mapSearch.addWidget(leafletWidget);

      // [mobile] On search input focus, add searching class
      $('form').on('focus', '.search-field-input', function(event) {
        $(this).closest('.layout-content-list').addClass('searching');
      });

      // On search submit
      $('form.search-field').submit(function(event) {

        // [mobile] On search submit, blur input
        $(this).find('input').blur();

        // Prevent form to conflict with instantsearch behavior
        event.preventDefault();

        // Close autocomplete when submitting search
        autocomplete('close');

      });

      // Form submit button will reload the page. Instantsearch has not yet make it fully compatible with forms. So manually handle the submit action by triggering search
      $('form.search-field').on('click', '.search-field-submit', function(event) {
        mainSearch.helper.search();
      });

      // Center map and open pin on list result click
      $('#hits-container').on('click', '.card', function(event) {
        event.preventDefault();
        var card = $(event.target).closest('.card');
        var hit = {
          objectID: card.data('hitid'),
          name: $(card).find('.card-title').html(),
          address_street: $(card).find('.card-address').html(),
          address_postcode: $(card).find('.card-zipcode').html(),
          address_city: $(card).find('.card-city').html(),
          open_details: $(card).find('.card-hours').html(),
          is_open: $(card).find('.card-hours').attr('data-open') == 'true'
        };
        var content = renderMapPopupContent(hit);
        leafletWidget.openHit(content, [card.data('lat'), card.data('lng')], card.data('hitid'));

        $('#hits-container').addClass('inactive');
        $(card).removeClass('inactive');
      });

      // Handle click on zoom out button
      $('#hits-container').on('click', 'button.zoom-out-button', function(event) {
        leafletWidget.zoomOut();
      });

      // Handle click on go back to search button
      $('.layout-content-list').scroll(function(event) {
        if ($(this).scrollTop() > $('.block-search-filters').outerHeight() + $('.block-search-field').outerHeight()) {
          $('.back-search-btn').addClass('visible');
        } else {
          $('.back-search-btn').removeClass('visible');
        }
      });

      // Handle click on go back to search button
      $('.back-search-btn').click(function(event) {
        $('.layout-content-list').animate({scrollTop: 0}, 200);
      });

      // Autocompletion is not an instantsearch feature. Must use algolia.js directly
      var algolia = algoliasearch(Paris.config.algolia.id, Paris.config.algolia.api_key);
      var index = algolia.initIndex(Paris.config.algolia.indexes[options.index]);

      var equipementDataset = {
        source: function(query, callback) {
          var category_names = [];
          if (mainSearch.helper.state.disjunctiveFacetsRefinements && mainSearch.helper.state.disjunctiveFacetsRefinements.category_names) {
            $.each(mainSearch.helper.state.disjunctiveFacetsRefinements.category_names, function(index, category) {
               category_names.push('category_names:' + category);
            });
          }
          index.search(query, {
            hitsPerPage: 8,
            facetFilters: ((category_names && category_names.length > 0) ? [category_names] : '*'),
            attributesToRetrieve: "*"
          }).then(function(answer) {
            callback(answer.hits);
          }, function() {
            callback([]);
          });
        },
        displayKey: 'name',
        templates: {
          header: '<div class="ad-example-header">'+Paris.i18n.t('list_equipments/equipements')+'</div>',
          suggestion: function(suggestion) {
            return '<span class="autocomplete-name">' + suggestion._highlightResult.name.value + '</span>';
          }
        }
      };

      var placesDataset = placesAutocompleteDataset({
        algoliasearch: algoliasearch,
        templates: {
          header: '<div class="ad-example-header">'+Paris.i18n.t('list_equipments/addresses')+'</div>',
          suggestion: function(suggestion) {
            return '<span class="autocomplete-name">' + suggestion.value + '</span>';
          },
          footer : ''
        },
        hitsPerPage: 2,
        aroundLatLng: Paris.config.search.paris_coordinates.lat + ',' + Paris.config.search.paris_coordinates.lng,
        aroundRadius: 22000,
        style: false
      });
      autocomplete('.layout-list-map .search-field-input', { hint: false }, [
        placesDataset, equipementDataset
      ]).on('autocomplete:selected', function(event, suggestion, dataset) {
        if (dataset == 'places') {
          placeQuery = suggestion.value;
          mainSearch.helper.setQuery(suggestion.value);
          setTimeout(function() {
            // Timeout fix a bug on android with keyboard toggle
            leafletWidget.flyTo([suggestion.latlng.lat, suggestion.latlng.lng]);
          }, 500);
          $('.layout-content-list').removeClass('searching');
        } else {
          placeQuery = '';
          mainSearch.helper.setQuery(suggestion.name);
          mainSearch.helper.search();
          var content = renderMapPopupContent(suggestion);
          leafletWidget.openHit(content, [suggestion._geoloc.lat, suggestion._geoloc.lng], suggestion.objectID);
        }
        $(this).blur();
      });

      mapSearch.start();
      mainSearch.start();

      // Use change event to detect facets reseting action
      mainSearch.helper.on('change', function(state, lastResults) {
        var query = state.query
        if (query && placeQuery.indexOf(query) >= 0) {
          state.query = '';
        }
      });

      // On search
      mainSearch.helper.on('search', function(state, lastResults) {
        // Remove inactive card
        $('#hits-container .card').removeClass('inactive');
        // Carousel doest not support dom changes so it conflicts with instantsearch. Destroy before hits gets refresh
        destroyCarousel();

        if (options.mobileMediaQuery.matches) {
          // [mobile] Destroy carousel
          $('.block-search-results').css('opacity', 0); // fix blinking bug
        }
      });

      // On search result
      mainSearch.helper.on('result', function(results, state) {
        if (firstLoad === false) {
          $('.layout-content-list').removeClass('searching');
        } else {
          // Trick to hide the searchForFacetValues items on first load
          $('#js-refinementlist .ais-refinement-list--item').remove();
        }

        firstLoad = false;

        if (options.mobileMediaQuery.matches) {
          // Carousel doest not support dom changes so it conflicts with instantsearch. Init once search is done
          initCarousel();
          $('.block-search-results').css('opacity', 1); // fix blinking bug
        }
      });

      // On resize
      $( window ).resize(function() {
        // Constantly check if carousel needs to be initialized depending on media query
        if (options.mobileMediaQuery.matches && !$('.layout-content-list').hasClass('searching')) {
          // [mobile] Init carousel
          initCarousel();
        } else {
          // [desktop] Destroy carousel
          destroyCarousel();
        }
      });
    }

    function initCarousel() {
      destroyCarousel();
      // Since init carousel can be called a lot of times, make sure initialization happens only when necessary
      if (flkyCarousel === undefined) {
        flkyCarousel = new Flickity('.carousel', {
          pageDots: false,
          adaptiveHeight: true
        });
        $('.block-search-results').show();
      }
    }

    function destroyCarousel() {
      // Destroy carousel when necessary
      if (flkyCarousel && flkyCarousel != undefined) {
        flkyCarousel.destroy();
        flkyCarousel = undefined;
      }
    }

    function renderMapPopupContent(hit) {
      var content = '';
      var is_open = hit.is_open ? 'open' : 'close';
      content += '<div class="card-content" data-hitid="'+hit.objectID+'">';
      content += '<h3 class="card-title">'+hit.name+'</h3>';
      content += '<div class="card-text"><span class="card-address">'+hit.address_street+'</span><br><span class="card-zipcode">'+hit.address_postcode+'</span> <span class="card-city">'+hit.address_city+'</span></div>';
      if (hit.is_open !== "unknown") {content += '<div class="card-hours '+ is_open +'">'+hit.open_details+'</div>';}
      content += '<div class="card-buttons">';
      content += Paris.templates['button']['button']({
        href: hit.url,
        text: Paris.i18n.t('list_equipments/button_view'),
        modifiers: ["secondary", "small"]
      });
      content += '</div>';
      content += '</div>';
      return content;
    }

    function initOptions() {
      $.each($el.data(), function(key, value) {
        options[key] = value;
      });
    }

    init();

    return $el;
  }

  return function(selector, userOptions) {
    return $(selector).each(function() {
      listEquipments(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.listEquipments('body.list-equipments');
});
