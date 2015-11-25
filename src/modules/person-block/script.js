'use strict';

var Paris = window.Paris || {};

Paris.personBlock = (function(){

  var defaultOptions = {
  };

  function personBlock(selector, userOptions){
    var $el     = $(selector),
        options = $.extend({}, defaultOptions, userOptions),
        $portrait, $button;

    function init(){
      initOptions();

      $portrait = $el.find('.person-block-portrait span');
      $button = $el.find('.person-block-button .button');

      $portrait.on('click', onClickPortrait);
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function onClickPortrait(e){
      e.preventDefault();
      window.location.href = $button.attr('href');
    }

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      personBlock(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.personBlock('.person-block');
});
