'use strict';

var Flickity = require('flickity-imagesloaded');

var Paris = window.Paris || {};

Paris.gallery = (function(){

  function gallery(selector){
    var $el = $(selector),
      $wrapper;

    function init(){
      $wrapper = $el.find('.gallery-wrapper');

      new Flickity($wrapper.get(0), {
        imagesLoaded: true,
        lazyLoad: 1,
        pageDots: false
      });
    }

    init();

    return $el;
  }

  return function(selector){
    return $(selector).each(function(){
      gallery(this);
    });
  };

})();

$(document).ready(function(){
  Paris.gallery('.component-gallery');
});
