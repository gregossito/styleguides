'use strict';

var Paris = window.Paris || {};

Paris.districts = (function() {

  function districts(selector) {
    var $el = $(selector);
    var $districtsItems = $el.find('.districts-item');
    var $districtsPanels = $el.find('.districts-panel');

    function selectItem($item) {
      // clear active
      $districtsItems
        .attr('aria-selected', 'false')
        .find('.button').removeClass('active');
      $districtsPanels
        .attr('aria-hidden', 'true')
        .removeClass('active');

      // set new active
      var $districtsItem = $item.parents('.districts-item');
      var districtId = $districtsItem.attr('aria-controls');
      $item.addClass('active');
      $districtsItem.attr('aria-selected', 'true');
      $(districtId).attr('aria-hidden', 'false').addClass('active');
    }

    function init() {
      // focus => change district on tab
      // click => assure it triggers on touch
      $('.districts-items-wrapper').on('click focus', '.button', function(e) {
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
      districts(this);
    });
  };

})();

$(document).ready(function() {
  Paris.districts('.component-districts');
});
