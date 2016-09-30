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

      //$placeholder = $el.find('.video-home-placeholder');
      // $embed = $el.find('.video-home-embed');

      // if ($embed.length === 0) {return;}

      // $placeholder.on('click', 'a[data-action="allow_cookies"]', onClickAllowCookies);

      // renderVideo();
      // PubSub.subscribe('cookies.updated', renderVideo);
      $el.find('a.video-home-item').on('click', function(event){
        event.preventDefault();
        var $embed = $(this).find('.video-home-embed').html();
        $('.video-home-modal .video-home-modal-body').empty().append($embed);
        $('.video-home-modal').show();
      });

      $('.video-home-close').on('click', function(){
        $('.video-home-modal').hide();
      });
    }

    function onClickAllowCookies(e){
      e.preventDefault();
      PubSub.publish('cookies.allow');
    }

    function renderVideo(){
      if ($embed === null || Cookies.get(Paris.config.cookies.cnil.name) !== Paris.config.cookies.cnil.value) {return;}
      var embed = $embed.text();
      $el.html(embed);
      $embed.remove();
      $embed = null;
    }

    function openModal(){

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
