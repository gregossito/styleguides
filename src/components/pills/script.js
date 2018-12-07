'use strict';

var PubSub = require('pubsub-js');

var Paris = window.Paris || {};

Paris.pills = (function() {

  function pills(selector) {
    var $el = $(selector);
    var $pillsItems = $el.find('.pills-item');
    var $pillsPanels = $el.find('.pills-panel');

    var $item;
    var $pillsItem;
    var itemId;

    function clearActive() {
      // clear active
      $pillsItems
        .attr('aria-selected', 'false')
        .find('.button').removeClass('active');
      $pillsPanels
        .attr('aria-hidden', 'true')
        .removeClass('active');
    }

    function publishEvent() {
      PubSub.publish('pills:change');
    }

    function loadItem() {
      clearActive();

      $item.addClass('active');
      $pillsItem.attr('aria-selected', 'true');
      $(itemId).attr('aria-hidden', 'false').addClass('active');
      publishEvent();
    }

    function init() {
      $('.pills-items-wrapper').on('click', '.button', function(e) {
        $item = $(this);
        var $activePanel = $el.find('.pills-panel.active');

        $pillsItem = $item.closest('.pills-item');
        itemId = $pillsItem.attr('aria-controls');

        if ($item.hasClass('active') && '#' + $activePanel.attr('id') === itemId) {
          clearActive();
          publishEvent();
          return;
        }

        loadItem();
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
