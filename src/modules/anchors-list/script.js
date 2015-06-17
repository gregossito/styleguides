'use strict';
require('velocity-animate');

var PubSub = require('pubsub-js');
var map = require('lodash.map');
var each = require('lodash.foreach');
var defer = require('lodash.defer');
var slugify = require("underscore.string/slugify");
var throttle = require('lodash.throttle');

var Paris = window.Paris || {};

Paris.anchors = (function(){

  var defaultOptions = {
    anchorsSelector: '.anchor',
    anchorsProgressSelector: '.anchors-list-progress',
    headerSelector: '.rheader',
    contentEl: '.layout-left-col',
    anchorsFavoritable: false,
    anchorsShareable: false,
    anchorTopBorder: 7, // border-top of the .anchor elements, in pixels
    breakpoint: 'large'
  };

  function anchors(selector, userOptions){
    var $el = $(selector),
        options = $.extend({}, defaultOptions, userOptions),
        $layoutContainer,
        $anchors,
        items,
        headerHeight = 0;

    function init(){
      initOptions();

      $layoutContainer = $('.layout-left-col');
      $anchors = $layoutContainer.find(options.anchorsSelector);

      PubSub.subscribe('responsive.resize', onResize);
      PubSub.subscribe('responsive.' + options.breakpoint + '.enable', enableAnchors);
      PubSub.subscribe('responsive.' + options.breakpoint + '.disable', disableAnchors);

      if (options.anchorsFavoritable) {renderFavorite();}
      if (options.anchorsShareable) {renderShare();}

      // Fix bad offset by recalculating items dimensions, 1 second after rendering
      // This could probably be improved by tracking down the origin of the discrepancy
      setTimeout(parseItems, 1000);

      $el.on('click', '.anchors-list-link', onClickAnchorLink);
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function onResize() {
      headerHeight = $(options.headerSelector).height();
    }

    function enableAnchors(){
      renderAnchors();
      PubSub.subscribe('scroll.document', fillBars);
      PubSub.subscribe('accordion:change', throttle(onContentHeightChange, 500));
    }

    function disableAnchors(){
      PubSub.unsubscribe(fillBars);
      PubSub.unsubscribe('accordion:change');
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
        PubSub.publish('anchors:ready');
        fillBars();
      });
    }

    function renderFavorite() {
      $anchors.each(function (i, anchor) {
        var $anchor = $(anchor);

        // Do not display favorite when in postit
        if ($anchor.data('in-postit')) {return;}

        var content = '<span class="icon icon-anchor icon-favorites">';
        $anchor.append(content);
      });
    }

    function renderShare() {
      $anchors.each(function (i, anchor) {
        var $anchor = $(anchor);
        var $anchorInList = $el.find('.anchors-list-link[href="#'+$anchor.attr('id')+'"]');

        // Do not display share when in postit
        if ($anchor.data('in-postit')) {return;}

        var items = map(['facebook', 'twitter', 'mail'], function(type) {
          return {
            "href": $anchorInList.data('share-' + type),
            "icon": type,
            "title": Paris.i18n.t("share/" + type)
          };
        });

        var content = Paris.templates.templatizer.share.share({
          items: items,
          modifiers: []
        });

        $anchor.append(content);
      });
    }

    function onClickAnchorLink(e) {
      e.preventDefault();
      var $link = $(e.currentTarget);
      var anchor = $link.attr("href");
      $(anchor)
        .velocity("stop")
        .velocity("scroll", {
          duration: 1500,
          offset: $(options.headerSelector).height() * -1 + options.anchorTopBorder,
          complete: function(){
            if (Modernizr.history) {
              history.replaceState({}, $link.text(), anchor);
            }
          }
      });
    }

    function fillBars(){
      each(items, function(item) {
        var $progress = $el.find('[href="'+item.href+'"]' + ' + ' + options.anchorsProgressSelector);

        if ($(document).scrollTop() < item.top - headerHeight) {
          var progress = 0;
        }
        else if ($(document).scrollTop() > item.bottom - headerHeight) {
          var progress = 100;
        }
        else {
          var progress = ($(document).scrollTop() - item.top + headerHeight) / (item.bottom - item.top);
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
