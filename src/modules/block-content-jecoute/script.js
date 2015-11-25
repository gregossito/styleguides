'use strict';
require('velocity-animate');

var Paris = window.Paris || {};

Paris.blockContentJecoute = (function(){

  var defaultOptions = {
    timing: 4000
  };

  function blockContentJecoute(selector, userOptions){
    var $el     = $(selector),
        options = $.extend({}, defaultOptions, userOptions),
        $items;

    function init(){
      initOptions();

      $items = $el.find('.block-content-item');

      if ($items.length === 0) {return;}

      setInterval(changeVisibleItem, options.timing*2);
      changeVisibleItem();
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function changeVisibleItem() {
      var $current = $items.filter('.visible') || $items.first();
      var $next = $current.next('.block-content-item');

      $items.removeClass('answered');
      $current.removeClass('visible');

      if ($next.length) {
        $next.addClass('visible');
      } else {
        $next = $items.filter(':first-child').addClass('visible');
      }

      $next.find('.progress').velocity({
        width: "100%"
      }, {
        duration: options.timing,
        easing: 'linear',
        complete: function() {
          $next.addClass('answered');
          setTimeout(function () {
            $next.find('.progress').velocity({width: 0}, {duration: 0});
            $items.parent().append($next);
          }, options.timing);
        }
      });
    }

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      blockContentJecoute(this, userOptions);
    });
  };

})();

$(document).ready(function() {
  Paris.blockContentJecoute('.block-content-jecoute');
});
