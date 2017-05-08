'use strict';
require('velocity-animate');

var PubSub = require('pubsub-js');
var algoliasearch = require('algoliasearch');
var DOMPurify = require('dompurify');

var Paris = window.Paris || {};

Paris.quickAccess = (function(){

  var defaultOptions = {
    index: 'global', // the algolia index to use (should be defined in config.js)
    link: 'url', // the algolia field to use as a link
    title: 'titre', // the algolia field to use as a title
    sections: 'onglet', // the algolia field to use as a section
    hitsPerPage: 6 // the number of results to display
  };

  function quickAccess(selector, userOptions){
    var $el     = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      $parent,
      $searchField,
      $searchFieldInput,
      $buttons,
      $results,
      $around,
      $more,
      $pause,
      $close,
      algolia,
      index;

    function init(){
      initOptions();

      algolia = algoliasearch(Paris.config.algolia.id, Paris.config.algolia.api_key);
      index = algolia.initIndex(Paris.config.algolia.indexes[options.index]);

      $parent = $el.parent();

      $searchField = $el.find('.search-field');
      $searchFieldInput = $searchField.find('.search-field-input');
      $buttons = $el.find('.quick-access-buttons');
      $results = $el.find('.quick-access-results ul');
      $around = $el.find('.button.around');
      $more = $el.find('.quick-access-results-more');
      $pause = $el.find('.icon-switch-pause');
      $close = $el.find('.quick-access-close-search');

      $searchFieldInput
        .on('input', onInput)
        .on('focus', function(){
          if ($searchFieldInput.val() !== '') {
            startSearch();
          }
        });

      $more.on('click', onClickMore);
      $pause.on('click', onClickPause);
      $close.on('click', onClickClose);

      if ($el.hasClass('searching')) {
        startSearch();
      }

      PubSub.subscribe('rheader.search.click', toggleSearch);

      // Remove video on iOS
      var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (iOS) {
        $el.find('.quick-access-video').remove();
      }
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function toggleSearch(){
      isSearching() ? stopSearch() : startSearch();
    }

    function isSearching() {
      return $el.hasClass('searching');
    }

    function startSearch(){
      if (isSearching()) {return false;}
      $el.addClass('searching');
      $buttons.add($around).velocity({
        opacity: 0
      }, {
        display: "none",
        duration: 350,
        ease: "ease",
        complete: onInput
      });
      $searchFieldInput.trigger('focus');

      // Close on Esc
      $(document).keyup(onKeyUp);
    }

    function stopSearch(){
      if (!isSearching()) {return false;}
      $el.removeClass('searching');
      $buttons.velocity({
        opacity: 1
      }, {
        display: "block",
        duration: 350,
        ease: "ease"
      });
      $around.velocity({
        opacity: 1
      }, {
        display: "inline-block",
        duration: 350,
        ease: "ease"
      });
      $results.empty();
      PubSub.publish('rheader.search.close');
      $more.hide();
      $searchFieldInput.trigger('blur');
      $(document).unbind("keyup", onKeyUp);
    }

    function onInput() {
      if (!isSearching()) {
        startSearch();
      }
      var val = DOMPurify.sanitize($searchFieldInput.val());
      if (val !== "") {
        index.search(val, {
          // filters: "(NOT onglet:Professionnels)",
          hitsPerPage: options.hitsPerPage
        }, onSearchResults);
      } else {
        $results.empty();
        $more.hide();
      }
    }

    function onSearchResults(err, results) {
      if (err) {return;}

      if (results.query !== $searchFieldInput.val()) {
        // do not take out-dated answers into account
        return;
      }

      $results.empty();
      $.each(results.hits, function(index, hit){
        var result = '<li>' +
          '<a href="' + hit[options.link] + '">' +
            '<span class="title">' + hit._highlightResult[options.title].value + '</span>';
        if (hit[options.sections]) {
          result += '<span class="section">' + hit[options.sections] + '</span>';
        }
        result += '</a></li>';
        $results.append(result);
      });
      $more.show();
    }

    function onKeyUp(e){
      if (e.keyCode == 27) { // Esc
        onClickClose(e);
      }
    }

    function onClickMore(e){
      e.preventDefault();
      $searchField.submit();
    }

    function onClickPause(e){
      e.preventDefault();
      var video = $el.find('.quick-access-video').get(0);
      video.paused ? video.play() : video.pause();
    }

    function onClickClose(e){
      e.preventDefault();
      stopSearch();
    }


    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      quickAccess(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.quickAccess('.quick-access');
});
