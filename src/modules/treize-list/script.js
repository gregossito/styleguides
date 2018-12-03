'use strict';

var Paris = window.Paris || {};

Paris.treizeList = (function(){

  var defaultOptions = {
  };

  function treizeList(selector, userOptions){
    var $el     = $(selector),
        options = $.extend({}, defaultOptions, userOptions),
        $more, $nb_series, $NB_SPLIT = 4;

    function init(){
      initOptions();

      $el.find('li.treize-list-card-item:lt(4)').css({opacity:1, visibility:'visible'});

      $nb_series = $el.find('.treize-list-card-item').length;
      if($nb_series>$NB_SPLIT) {
        $el.find('li.treize-list-card-item:gt(3)').hide();
        $el.children('ul').after('<div id="treize-more" ><button class="button black"><span class="button-text">Plus de séries</span></button></div>');
        $el.find('#treize-more > button').on('click', moreSeries);
      }
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    // Click plus de séries
    function moreSeries() {
      var that = $(this);
      $el.find('li.treize-list-card-item:gt(3)').slideDown('slow');
      $el.find('li.treize-list-card-item:gt(3)').css({opacity:1, visibility:'visible'});
      $el.find('#treize-more').hide();
    } 

    init();
    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      treizeList(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.treizeList('.treize-list');
});
