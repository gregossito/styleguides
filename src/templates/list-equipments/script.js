'use strict';
require('velocity-animate');

var algoliasearch = require('algoliasearch');
var instantsearch = require('instantsearch.js');
var Flickity = require('flickity-imagesloaded');
var autocomplete = require('autocomplete.js');
var places =  require('places.js');
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
  var resizing = false;
  var firstLoad = true;

  function listEquipments(selector, userOptions) {
    var $el = $(selector),
        options = $.extend({}, defaultOptions, userOptions),
        placeQuery = '',
        api = {},
        search;

    function init() {
      initOptions();

      // Init instantsearch
      var search = instantsearch({
        appId: Paris.config.algolia.id,
        apiKey: Paris.config.algolia.api_key,
        indexName: Paris.config.algolia.indexes[options.index],
        searchParameters: options.searchParams
      });

      // Search box widget
      search.addWidget(
        instantsearch.widgets.searchBox({
          container: '.block-search-field .search-field-input',
          searchOnEnterKeyPressOnly: true
        })
      );

      var refinementWidget = Paris.instantsearch.widgets.newrefinementList({
        container: '.block-search-filters .block-search-content',
        selectedFiltersContainer: '.block-search-filters-mobile',
        filtersPopupContainer: '.layout-content-filters-popup',
        attributeName: 'categories',
        operator: 'or',
        sortBy: ['name:asc', 'count:desc'],
        numberOfFacets: 200,
        mainFacets: Paris.config.algolia.main_facets
      });
      // Search refinement list widget
      search.addWidget(refinementWidget);
      
      // Search reset widget
      search.addWidget(
        instantsearch.widgets.clearAll({
          container: '.block-search-filters .block-search-top-link',
          autoHideContainer: false,
          templates: {
            link: Paris.i18n.t('list_equipments/reset_filters')
          }
        })
      );

      // Search results widget
      search.addWidget(
        instantsearch.widgets.hits({
          container: '#hits-container',
          templates: {
            empty: '<p>' + Paris.i18n.t('list_equipments/no_result') + '<br>' + Paris.templates['button']['button']({ text: 'Dézoomer', modifiers: ["secondary", "zoom-out-button"]}) + '</p>',
            item: '<a href="#" class="card open cat-{{idcategories}}" hitid="{{idequipements}}" lat="{{_geoloc.lat}}" lng="{{_geoloc.lng}}"><div style="background-image: url()" class="card-image {{^img}} no-img {{/img}}"></div><div class="card-content"><h3 class="card-title">{{name}}</h3><div class="card-text"><span class="card-address">{{address}}</span><br><span class="card-zipcode">{{zipCode}}</span> <span class="card-city">{{city}}</span></div><div class="card-hours open">Ouvert jusqu’à 21h</div><span class="ico-btn favorite-btn"><i class="icon-favorites"></i></span></div></a>'
          },
          cssClasses: {
            root: 'carousel',
            item: 'carousel-cell'
          }
        })
      );

      // Mapbox widget
      var mapboxWidget = Paris.instantsearch.widgets.mapbox({
        container: '#map',
        mapBoxAccessToken: Paris.config.mapbox.access_token,
        mapbox: {
          style: 'mapbox://styles/parisnumerique/cis1rkqoj000khinpthppoaqd',
          zoom: 11,
          minZoom: 10,
          center: [Paris.config.search.paris_coordinates.lng, Paris.config.search.paris_coordinates.lat],
          maxBounds:
          [
            [2.021942, 48.731991], // SW coordinates
            [2.698162, 48.985029]  // NE coordinates
          ]
        },
        cluster: {
          circleColor: '#f89cd3',
          circleRadius: 15
        },
        openedHit: function(hitID) {
          // [desktop] Add inactive class
          var addClassDelay = ($('#hits-container .card[hitid="'+hitID+'"]').length > 0) ? 0 : 100;
          setTimeout(function() {
            $('#hits-container .card').addClass('inactive');
            $('#hits-container .card[hitid="'+hitID+'"]').removeClass('inactive');
          }, addClassDelay);

          // [mobile] Go to slide
          if (flkyCarousel && flkyCarousel != undefined) {
            var index = $('#hits-container .card[hitid="'+hitID+'"]').closest('.carousel-cell').prevAll().length;
            flkyCarousel.select(index);
          }
        },
        popupHTMLForHit: function(hit) {
          return renderMapPopupContent(hit);
        }
      });

      // Search map widget
      search.addWidget(mapboxWidget);

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
        search.helper.search();
      });

      // Center map and open pin on list result click
      $('#hits-container').on('click', '.card', function(event) {
        var card = $(event.target).closest('.card');
        if ($(event.target).closest('.favorite-btn').length > 0) {
          toggleFavorite(card.attr('hitid'));
        } else {
          var hit = {
            idequipements: card.attr('hitid'),
            name: $(card).find('.card-title').html(),
            address: $(card).find('.card-address').html(),
            zipCode: $(card).find('.card-zipcode').html(),
            city: $(card).find('.card-city').html()
          };
          var content = renderMapPopupContent(hit);
          mapboxWidget.openHit(content, [card.attr('lng'), card.attr('lat')], card.attr('hitid'));

          $('#hits-container').addClass('inactive');
          $(card).removeClass('inactive');
        }
      });

      // Handle click on map close popup button
      $('#map').on('click', '.close-popup-btn', function(event) {
        mapboxWidget.removePopup();
      });

      $('.search-results-container').on('click', '.around-me-button', function(event) {
        mapboxWidget.geolocate();
      });

      // Handle click on map favorite button (popup)
      $('#map').on('click', '.favorite-btn', function(event) {
        var hitID = $(event.target).closest('.card-content').attr('hitid');
        toggleFavorite(hitID);
      });

      // Handle click on zoom out button
      $('#hits-container').on('click', 'button.zoom-out-button', function(event) {
        mapboxWidget.zoomOut();
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
          var categories = [];
          if (search.helper.state.disjunctiveFacetsRefinements && search.helper.state.disjunctiveFacetsRefinements.categories) {
            $.each(search.helper.state.disjunctiveFacetsRefinements.categories, function(index, category) {
               categories.push('categories:' + category);
            });
          }
          index.search(query, { 
            hitsPerPage: 8,
            facetFilters: ((categories && categories.length > 0) ? [categories] : '*'),
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
          search.helper.setQuery(suggestion.value);
          mapboxWidget.flyTo([suggestion.latlng.lng, suggestion.latlng.lat]);
          $('.layout-content-list').removeClass('searching');
        } else {
          placeQuery = '';
          search.helper.setQuery(suggestion.name);
          search.helper.search();
          var content = renderMapPopupContent(suggestion);
          mapboxWidget.openHit(content, [suggestion._geoloc.lng, suggestion._geoloc.lat], suggestion.idequipements);
        }
        $(this).blur();
      });

      search.start();

      // Use change event to detect facets reseting action
      search.helper.on('change', function(state, lastResults) {
        var query = state.query
        if (query && placeQuery.indexOf(query) >= 0) {
          state.query = '';
        }
      });

      // On search
      search.helper.on('search', function(state, lastResults) {
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
      search.helper.on('result', function(results, state) {

        if ($('.layout-content-list').hasClass('searching')) {
          refinementWidget.getAndRenderSelectedFacets();
        }
        if (firstLoad === false) {
          $('.layout-content-list').removeClass('searching');
        }

        firstLoad = false;

        if (options.mobileMediaQuery.matches) {
          // Carousel doest not support dom changes so it conflicts with instantsearch. Init once search is done
          initCarousel(); 
          $('.block-search-results').css('opacity', 1); // fix blinking bug
        }
      });

      // Open favorites
      $('.block-search-field .block-search-bottom-links a').click(function(event) {
        openFavorites();
      });

      // Close favorites
      $('.block-favorites .block-search-top-link a, .block-search-field h3.block-search-title').click(function(event) {
        closeFavorites();
      });

      // On resize
      $( window ).resize(function() {
        // Constantly check if carousel needs to be initialized depending on media query
        if (options.mobileMediaQuery.matches) {
          // [mobile] Init carousel
          initCarousel();
        } else {
          // [desktop] Destroy carousel
          destroyCarousel();
        }

        $el.data('api', api);
      });
    }

    function openFavorites() {
      $('.layout-list-map').addClass('favorites');
      console.log('TODO: get favorites');
      var favorites = [];
      if (favorites && favorites.length > 0) {
        // Render favorites
        console.log('TODO: render favorites');
      } else {
        $('.block-favorites .block-search-content').html('<p class="no-favorites">' + Paris.i18n.t('list_equipments/no_favorite') + '</p>');
      }
    }

    function closeFavorites() {
      $('.layout-list-map').removeClass('favorites');
    }

    function toggleFavorite(hitID) {
      $('#hits-container .card[hitid="'+hitID+'"]').find('.favorite-btn').toggleClass('selected');
      $('#map .card-content[hitid="'+hitID+'"]').find('.favorite-btn').toggleClass('selected');
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
      content += '<div class="card-content" hitid="'+hit.idequipements+'">';
      content += '<h3 class="card-title">'+hit.name+'</h3>';
      content += '<div class="card-text"><span class="card-address">'+hit.address+'</span><br><span class="card-zipcode">'+hit.zipCode+'</span> <span class="card-city">'+hit.city+'</span><span class="ico-btn favorite-btn"><i class="icon-favorites"></i></span></div>';
      content += '<div class="card-hours open">Ouvert jusqu’à 21h</div>';
      content += '<div class="buttons">';
      content += Paris.templates['button']['button']({
        text: Paris.i18n.t('list_equipments/button_view'),
        modifiers: ["secondary", "small"]
      });
      content += '</div>';
      var classes = ($('#hits-container .card[hitid="'+hit.idequipements+'"] .favorite-btn.selected').length > 0 ? 'selected' : '');
      content += '<span class="ico-btn favorite-btn '+classes+'"><i class="icon-favorites"></i></span>';
      content += '<span class="ico-btn close-popup-btn"><i class="icon-close-big"></i></span>';
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
