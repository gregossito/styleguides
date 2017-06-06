'use strict';
require('velocity-animate');

var PubSub = require('pubsub-js');
var Cookies = require('js-cookie');

var Paris = window.Paris || {};

Paris.jumbotronSlider = (function(){

  function jumbotronSlider(selector, userOptions){
    var $el = $(selector);
    function init(){
      var imgSlider = $('.layout-jo .jumbotron-slider').attr('title'); // src image
      var tmpImg = new Image();
      tmpImg.src = imgSlider;
      tmpImg.onload = function() {
        $('.layout-jo').slideDown();
        setTimeout(function(){
          $('.layout-jo').addClass("done");
          var object = {value: "1", timestamp: new Date().getTime()};
          localStorage.setItem("paris-jo",JSON.stringify(object));
        }, 4000);
      }
    } 

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      jumbotronSlider(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  if($('.layout-jo').length>0) {
    var parisJo = localStorage.getItem("paris-jo");
    if(parisJo !== null) {
      parisJo = JSON.parse(parisJo);
      var now = new Date().getTime().toString();
      var expire = (now - parisJo.timestamp) / 60 / 1000;
      if(parisJo.value === '1' && expire < 1) {
        $('.layout-jo').remove();
      }
      else {
        Paris.jumbotronSlider('.jumbotron-slider');
      }
    }
    else {
      Paris.jumbotronSlider('.jumbotron-slider');
    }
  }
});
