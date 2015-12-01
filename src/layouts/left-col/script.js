'use strict';

var PubSub = require('pubsub-js');

var Paris = window.Paris || {};

Paris.leftCol = (function(){

  function leftCol(selector){
    var $el = $(selector),
      $anchorsList;

    function init(){
      $anchorsList = $el.find('.anchors-list');

      // stop now if there is no anchors-list
      if (!$anchorsList.length) {return;}

      PubSub.subscribe('anchors.ready', setAffix);

      PubSub.subscribe('responsive.small.enable', setAffix);
      PubSub.subscribe('responsive.small.disable', unsetAffix);
    }

    function setAffix() {
      var rheaderHeight = $('.rheader').height();
      // no affix if there is not enough space to show all the anchors
      if ($anchorsList.height() > window.innerHeight - rheaderHeight - 100){
        return;
      }
      var $nextContent = $el.parents('.layout-content').next('.layout-content');
      if ($nextContent.length) {
        unsetAffix();
        $el.affix({
          offset: {
            top: $('.layout-left-col').offset().top - rheaderHeight,
            bottom: $('body').height() - $nextContent.offset().top + rheaderHeight
          }
        });
      }
    }

    function unsetAffix(){
      $el.removeData('bs.affix').removeClass('affix affix-top affix-bottom');
    }

    init();

    return $el;
  }

  return function(selector){
    return $(selector).each(function(){
      leftCol(this);
    });
  };

})();

$(document).ready(function(){
  Paris.leftCol('.layout-aside .aside-wrapper');
});
