'use strict';
require('velocity-animate');

var Paris = window.Paris || {};

Paris.jumbotronSlider = (function(){

  function jumbotronSlider(selector, userOptions){
    var $el = $(selector);
    function init(){
      var imgSlider = $('.layout-jo .jumbotron-slider').attr('title'); // src image
      if($('.jumbotron-slider-text > a').length > 0){
        $('.jumbotron-slider').css('cursor','pointer');
        $('.jumbotron-slider').click(function(){
          document.location.href=$('.jumbotron-slider-text > a').attr('href');
        });
      }

      var tmpImg = new Image();
      tmpImg.src = imgSlider;
      tmpImg.onload = function() {
        if($(window).scrollTop() > 50) {
          $('.layout-jo').addClass("donenoeffect");
        }
        else {
          $('.layout-jo').show();
          setTimeout(function(){
            if($(window).scrollTop() > 50) {
              $('.layout-jo').addClass("donenoeffect");
            }
            else {
              $('.layout-jo').addClass("done");
            }
            //var object = {value: "1", timestamp: new Date().getTime()};
            //localStorage.setItem("paris-jo",JSON.stringify(object));
          }, 3000);
        }
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
    // var parisJo = localStorage.getItem("paris-jo");
    // if(parisJo !== null) {
    //   parisJo = JSON.parse(parisJo);
    //   var now = new Date().getTime().toString();
    //   var expire = (now - parisJo.timestamp) / 60 / 1000; // 1 hour
    //   if(parisJo.value === '1' && expire < 0) { // no expiration
    //     $('.layout-jo').remove();
    //   }
    //   else {
    //     Paris.jumbotronSlider('.jumbotron-slider');
    //   }
    // }
    // else {
    //   Paris.jumbotronSlider('.jumbotron-slider');
    // }
    Paris.jumbotronSlider('.jumbotron-slider');
  }
});
