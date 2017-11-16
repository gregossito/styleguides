'use strict';
require('velocity-animate');

var PubSub = require('pubsub-js');
var Cookies = require('js-cookie');

var Paris = window.Paris || {};

Paris.videoHomeNews = (function() {

  function videoHomeNews(selector) {
    var $el = $(selector);
    var $items;
    var $modal;
    var $iframe;
    var $placeholder;
    var url;

    function init() {

      $items = $el.find('a.video-card');
      $modal = $el.find('.video-modal');
      $iframe = $modal.find('.video-modal-wrapper iframe');
      $placeholder = $modal.find('.video-modal-placeholder')

      $items.on('click', function(e) {
        e.preventDefault();

        if ($modal.hasClass('is-open')) {
          return;
        }

        url = $(this).data('url');
        url = url.replace(/^http:/, 'https:');
        url += '?autoplay=1&ui-logo=0';

        e.stopPropagation();
        openModal();
      });

      $modal.on('click', closeModal);

      $placeholder.on('click', 'a[data-action="allow_cookies"]', onClickAllowCookies);
    }

    function openModal() {
      if ($modal.hasClass('is-open')) {
        return;
      }

      $modal.addClass('is-open');

      if (Cookies.get(Paris.config.cookies.cnil.name) !== Paris.config.cookies.cnil.value) {
        $placeholder.show();
        return;
      }

      renderEmbed();
    }

    function closeModal() {
      $modal.removeClass('is-open');
      $iframe.attr('src', '');
      url = undefined;
    }

    function renderEmbed() {
      $placeholder.hide();
      $iframe.attr('src', url);
    }

    function onClickAllowCookies(e) {
      e.preventDefault();
      e.stopPropagation();

      PubSub.publish('cookies.allow');
      renderEmbed();
    }

    init();

    return $el;
  }

  return function(selector){
    return $(selector).each(function(){
      videoHomeNews(this);
    });
  };

})();

$(document).ready(function(){
  Paris.videoHomeNews('.video-home-news');
});
