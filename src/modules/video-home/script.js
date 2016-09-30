'use strict';
require('velocity-animate');

var PubSub = require('pubsub-js');
var Cookies = require('js-cookie');

var Paris = window.Paris || {};

Paris.videoHome = (function(){

  function videoHome(selector){
    var $el     = $(selector),
      $placeholder,
      $embed;

    function init(){
      $el.find('a.video-home-item').on('click', function(event){
        event.preventDefault();
        var $embed = $(this).find('.video-home-embed').html();

        $('.video-home-modal .video-home-modal-body').empty().append($embed);

        $('.video-home-modal').show();
      });

      $('.video-home-close').on('click', function(){
        $('.video-home-modal .video-home-modal-body').empty();
        $('.video-home-modal').hide();
      });
    }

    init();

    return $el;
  }

  return function(selector){
    return $(selector).each(function(){
      videoHome(this);
    });
  };

})();

$(document).ready(function(){
  Paris.videoHome('.video-home');
});
