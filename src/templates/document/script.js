'use strict';

var Cookies = require('js-cookie');

var Paris = window.Paris;

Paris.document = (function(){

  var defaultOptions = {
    postitContentUrl: '/postit/${pageId}'
  };

  function document(selector, userOptions){
    var $el = $(selector),
      $anchors,
      options = $.extend({}, defaultOptions, userOptions),
      pageId;

    function init(){
      initOptions();

      $anchors = $('.layout-aside .anchors-list');
      pageId = $('body').data('pageid');

      if (Cookies.get(Paris.config.cookies.parisconnect.name)) {
        loadPostit();
      }
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function loadPostit() {
      $.ajax({
        url: options.postitContentUrl.replace('${pageId}', pageId),
        type: 'get',
        cache: false,
        success: renderPostit
      });
    }

    function renderPostit(data){
      data.title = data.title || Paris.i18n.t("postit/default_title");
      data.block = data.block || data.contenu;
      var postit = Paris.templates['postit']['postit'](data);
      $('.components').prepend(postit);
      $anchors.data('api').addItem({
        id: "postit",
        text: data.title,
        modifiers: "anchor-postit"
      });
    }


    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      document(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.document('body.document');
});
