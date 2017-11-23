'use strict';

var PubSub = require('pubsub-js');

var Paris = window.Paris || {};

Paris.accordion = (function(){

  function accordion(selector){
    var $el = $(selector),
        api = {};

    function init(){
      // fix equipement accordion ckeditor
      if ($el.find('icon-arrow-top').length === 0) {
        $el.find('.collapsible-item-title-link').append('<span class="icon icon-arrow-top"></span>');
        $el.find('.panel-default.collapsible-item').addClass('accordion-item');
        $el.find('.collapsible-item-title-link').addClass('accordion-item-title');
        $el.find('.panel-collapse').addClass('accordion-item-content');
      }

      $el.find('.accordion-item-content')
        .addClass('collapse')
        .data('toggle', false);
      $el.find('.accordion-item-title')
        .addClass('collapsed')
        .attr('data-toggle', 'collapse')
        .collapse();
      $el.on('shown.bs.collapse hidden.bs.collapse', function(){
        PubSub.publish('accordion:change');
      });

      $el.data('api', api);
    }


    // The API for external interaction

    api.openItem = function openItem(sel) {
      $el.find(sel).collapse('show');
    };

    api.closeAll = function closeAll() {
      var els = $el.find('.accordion-item-content');
      els.collapse('hide');
    };

    init();

    return $el;
  }

  return function(selector){
    return $(selector).each(function(){
      accordion(this);
    });
  };

})();

$(document).ready(function(){
  Paris.accordion('.component-accordion');
});

