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
        var $placeholder = $('.video-home-placeholder').html();
        var autoplay = "&autoplay=1";

        if(Cookies.get(Paris.config.cookies.cnil.name) !== Paris.config.cookies.cnil.value) {
          $('.video-home-modal .video-home-modal-body').empty().append($placeholder);
        }
        else {
          $('.video-home-modal .video-home-modal-body').empty().append($embed);
        }

        $('.video-home-modal a[data-action="allow_cookies"]').on('click', onClickAllowCookies);
        PubSub.subscribe('cookies.updated', function(){
          $('.video-home-modal .video-home-modal-body').empty().append($embed);
        });

        var url = $('.video-home-modal .video-home-modal-body .embed-container iframe').attr('src');
        url = url+autoplay;
        $('.video-home-modal .video-home-modal-body .embed-container iframe').attr('src', url);
        $('.video-home-modal').show();
      });

      $('.video-home-close, .video-home-modal').on('click', function(){
        $('.video-home-modal .video-home-modal-body').empty();
        $('.video-home-modal').hide();
      });

      function onClickAllowCookies(e){
        e.preventDefault();
        PubSub.publish('cookies.allow');
      }

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
