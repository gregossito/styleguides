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

      $('li.treize-list-card-item:lt(4)').css({opacity:1, visibility:'visible'});

      $nb_series = $('.treize-list-card-item').length;
      if($nb_series>=$NB_SPLIT) {
        $('li.treize-list-card-item:gt(3)').hide();
        $('ul.treize-list').after('<div id="treize-more" ><button class="button black"><span class="button-text">Plus de séries</span></button></div>');
        $('#treize-more > button').on('click', moreSeries);
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
      $('li.treize-list-card-item:gt(3)').css({opacity:1, visibility:'visible'});
      $('li.treize-list-card-item:gt(3)').show(100);
      $('#treize-more').hide();
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
