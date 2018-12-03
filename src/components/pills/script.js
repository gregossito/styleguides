'use strict';

var PubSub = require('pubsub-js');

var Paris = window.Paris || {};

Paris.pills = (function() {

  function pills(selector) {
    var $el = $(selector);
    var $pillsItems = $el.find('.pills-item');
    var $pillsPanels = $el.find('.pills-panel');

    function selectItem($item) {
      // clear active
      $pillsItems
        .attr('aria-selected', 'false')
        .find('.button').removeClass('active');
      $pillsPanels
        .attr('aria-hidden', 'true')
        .removeClass('active');

      // set new active
      var $pillsItem = $item.parents('.pills-item');
      var districtId = $pillsItem.attr('aria-controls');
      $item.addClass('active');
      $pillsItem.attr('aria-selected', 'true');
      $(districtId).attr('aria-hidden', 'false').addClass('active');
      PubSub.publish('pills:change');
    }

    function init() {
      // focus => change district on tab
      // click => assure it triggers on touch
      $('.pills-items-wrapper').on('click focus', '.button', function(e) {
        var $item = $(this);
        // avoid double action
        if (e.type === 'click' && $item.hasClass('active')) return;

        selectItem($item);
      });
    }

    init();

    return $el;
  }

  return function(selector) {
    return $(selector).each(function() {
      pills(this);
    });
  };

})();

$(document).ready(function() {
  Paris.pills('.component-pills');
});
