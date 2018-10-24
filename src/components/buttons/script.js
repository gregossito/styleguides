'use strict';
require('velocity-animate');

var Paris = window.Paris || {};

Paris.buttons = (function(){

  var defaultOptions = {
    headerSelector: '.rheader',
    noticeTopSelector: '#notice_home_top',
    contentEl: '.layout-left-col',
    anchorTopBorder: 7, 
    scrollDuration: 1500
  };

  function buttons(selector, userOptions){
    var $el = $(selector),
    options = $.extend({}, defaultOptions, userOptions),
    headerHeight = 0;
    function init() {
      $el.on('click', '.button', onClickAnchorLink);
    }

    function onClickAnchorLink(e) {
      var $link = $(e.currentTarget);
      var anchor = $link.attr("href");
      if(/^#/.test(anchor)) {
        e.preventDefault();
        scrollToAnchor(anchor);
      }
    }

    function scrollToAnchor(anchor) {
      var $anchor = $(anchor);
      if ($anchor.length === 0) {return;}

      var anchorOffset = $(options.headerSelector).height();
      var $noticeTop = $(options.noticeTopSelector);
      if ($noticeTop.length > 0) {
        anchorOffset += $noticeTop.height();
      }
      anchorOffset += options.anchorTopBorder;

      $anchor
        .velocity("stop")
        .velocity("scroll", {
          duration: options.scrollDuration,
          offset: -1 * anchorOffset,
          complete: function(){
            if (Modernizr.history && window.location.hash !== anchor) {
              history.replaceState({}, $anchor.text(), anchor);
            }
          }
        });
    }

    init();
    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      buttons(this, userOptions);
    });
  };
})();
$(document).ready(function(){
  Paris.buttons('.buttons-items');
});
