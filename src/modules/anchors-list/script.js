'use strict';
require('velocity-animate');

var PubSub = require('pubsub-js');
var map = require('lodash.map');
var each = require('lodash.foreach');
var defer = require('lodash.defer');
var slugify = require("underscore.string/slugify");
var throttle = require('lodash.throttle');
var Cookies = require('js-cookie');

var Paris = window.Paris || {};

Paris.anchors = (function(){

  var defaultOptions = {
    anchorsSelector: '.anchor',
    anchorsProgressSelector: '.anchors-list-progress',
    headerSelector: '.rheader',
    contentEl: '.layout-left-col',
    anchorTopBorder: 7, // border-top of the .anchor elements, in pixels
    breakpoint: 'large',
    scrollDuration: 1500
  };

  function anchors(selector, userOptions){
    var $el = $(selector),
        api = {},
        options = $.extend({}, defaultOptions, userOptions),
        $layoutContainer,
        $itemsContainer,
        $anchors,
        items,
        headerHeight = 0;

    function init(){
      initOptions();

      $layoutContainer = $('.layout-left-col');
      $itemsContainer = $el.find('.anchors-list-items');
      $anchors = $layoutContainer.find(options.anchorsSelector);

      PubSub.subscribe('responsive.resize', onResize);
      PubSub.subscribe('responsive.' + options.breakpoint + '.enable', enableAnchors);
      PubSub.subscribe('responsive.' + options.breakpoint + '.disable', disableAnchors);

      // Fix bad offset by recalculating items dimensions, 1 second after rendering
      // This could probably be improved by tracking down the origin of the discrepancy
      setTimeout(function(){
        parseItems();
        scrollToAnchor(window.location.hash);
      }, 1000);

      $el.on('click', '.anchors-list-link', onClickAnchorLink);

      $el.data('api', api);
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
      var publicDataCookie = Cookies.getJSON(Paris.config.cookies.publicdata.name);
      options.scrollDuration = publicDataCookie && publicDataCookie.noscroll ? 0 : options.scrollDuration;
    }

    function onResize() {
      headerHeight = $(options.headerSelector).height();
    }

    function enableAnchors(){
      renderAnchors();
      PubSub.subscribe('scroll.document', onScroll);
      PubSub.subscribe('accordion:change', throttle(onContentHeightChange, 500));
      PubSub.subscribe('districts:change', testChange);
    }

    function disableAnchors(){
      PubSub.unsubscribe('scroll.document', onScroll);
      PubSub.unsubscribe('accordion:change');
      PubSub.unsubscribe('districts:change');
    }

    function parseItems() {
      items = map($anchors, function(anchor, index) {
        var $anchor = $(anchor);

        // Generate a slug-based id if it doesn't exist
        if (!$anchor.attr('id')) {
          $anchor.attr('id', slugify($anchor.text()));
        }

        // Check if the anchor is in a postit
        $anchor.data('in-postit', ($anchor.closest('.component-postit').length !== 0));

        var $contentEl = $(options.contentEl);

        return {
          text: $anchor.text(),
          href: '#' + $anchor.attr('id'),
          top: $anchor.data('in-postit') && index === 0 ?
            $layoutContainer.position().top : // when in-postit and first item
            Math.round(+$anchor.position().top)+ ( $contentEl.parent().position().top  - $contentEl.position().top),
          modifiers: $anchor.data('in-postit') ? ["anchor-postit"] : []
        };
      });

      each(items, function (item, index, list) {
        item.bottom = (list[index+1]) ? list[index+1].top : $layoutContainer.position().top + $layoutContainer.height();
      });

    }

    function renderAnchors() {
      parseItems();

      // Anchors are already rendered, just update the title
      var $documentTitle = $('.document-heading .document-heading-title');
      if ($documentTitle.length !== 0) {
        $el.find('.anchors-list-title span').text($documentTitle.text());
      }

      defer(function () {
        PubSub.publish('anchors.ready');
        fillBars();
      });
    }

    function onClickAnchorLink(e) {
      e.preventDefault();
      var $link = $(e.currentTarget);
      var anchor = $link.attr("href");
      scrollToAnchor(anchor);
    }

    function scrollToAnchor(anchor) {
      var $anchor = $(anchor);
      if ($anchor.length === 0) {return;}
      $anchor
        .velocity("stop")
        .velocity("scroll", {
          duration: options.scrollDuration,
          offset: $(options.headerSelector).height() * -1 + options.anchorTopBorder,
          complete: function(){
            if (Modernizr.history && window.location.hash !== anchor) {
              history.replaceState({}, $anchor.text(), anchor);
            }
          }
        });
    }

    function onScroll(e, data){
      fillBars(data.scrollTop);
    }

    function fillBars(scrollTop){
      if (typeof scrollTop === 'undefined') {
        var scrollTop = $(window).scrollTop();
      }
      each(items, function(item) {
        var $progress = $el.find('[href="'+item.href+'"]' + ' + ' + options.anchorsProgressSelector);

        if (scrollTop < item.top - headerHeight) {
          var progress = 0;
        }
        else if (scrollTop > item.bottom - headerHeight) {
          var progress = 100;
        }
        else {
          var progress = (scrollTop - item.top + headerHeight) / (item.bottom - item.top);
          progress = progress * 100;
          if (progress < 2)       {progress = 0;}
          else if (progress > 98) {progress = 100;}
        }

        $progress.css('width', ''+progress+'%');
      });
    }

    function onContentHeightChange(){
      parseItems();
      fillBars();
    }

    function testChange() {
      console.log('change');
    }


    // The API for external interaction

    api.addItem = function(data){
      $itemsContainer.prepend('<li class="anchors-list-item '+data.modifiers+'"><a href="#'+data.id+'" class="anchors-list-link">'+data.text+'</a><span class="anchors-list-progress" style="width: 0%;"></span></li>');
      renderAnchors();
    };

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      anchors(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.anchors('.layout-aside .anchors-list');
});
