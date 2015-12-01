'use strict';
require('velocity-animate');

var Cookies = require('js-cookie');

var Paris = window.Paris || {};

Paris.iconSwitch = (function(){

  var defaultOptions = {
    alertsApi: {
      isUserSubscribedUrl: '/alerts/isUserSubscribed',
      subscribeUserUrl: '/alerts/subscribeUser',
      unsubscribeUserUrl: '/alerts/unsubscribeUser'
    }
  };

  function iconSwitch(selector, userOptions){
    var $el     = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      $on, $off;

    function init(){
      initOptions();

      $on = $el.find('.icon-switch-on');
      $off = $el.find('.icon-switch-off');

      var actionOnClick;
      switch (options.action) {
        case 'alert':
          if (Cookies.get(Paris.config.cookies.parisconnect.name)) {
            setupAlertAjaxOperations();
          }
          actionOnClick = function(e){
            if (!Cookies.get(Paris.config.cookies.parisconnect.name)) {
              window.open($el.data('action-fallback-link'));
              return;
            }
            onClick(e);
          };
          break;

        case 'favorite':
          // TODO implement favorite action
          actionOnClick = function(e){
            onClick(e);
          };
          break;

        case 'pause':
          // TODO implement pause action
          actionOnClick = function(e){
            onClick(e);
          };
          break;
      }

      $el.on('click', actionOnClick);
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function onClick(e){
      e.preventDefault();
      e.stopPropagation();

      $el.toggleClass('active');

      if ($el.hasClass('active')) {
        $off.focus();
      } else {
        $on.focus();
      }
    }

    function setupAlertAjaxOperations() {
      // init for alert
      var $alertIconSwitch = $('.document-heading-icons .icon-switch[data-action="alert"]');
      var alertId = $alertIconSwitch.data('action-id');

      if (!alertId) {return;}

      // get alert current status
      var isSubscribed;
      $.ajax({
        type: 'get',
        url: options.alertsApi.isUserSubscribedUrl,
        data: {idalertes: alertId},
        success: function (subscribed) {
          switch (subscribed) {
            case false:
              isSubscribed = false;
              break;
            case true:
              isSubscribed = true;
              break;
            default:
              console.error('response to ' + options.alertsApi.isUserSubscribedUrl + '?idalertes=' + alertId + 'is not recognized: ' + subscribed);
              return;
          }
          setupAlertHandlers();
        }
      });

      function setupAlertHandlers() {
        $alertIconSwitch.toggleClass('active', isSubscribed);
        $alertIconSwitch.on('click', function onClick() {
          $.ajax({
            type: 'get',
            url: isSubscribed ? options.alertsApi.unsubscribeUserUrl : options.alertsApi.subscribeUserUrl,
            data: {idalertes: alertId},
            success: function () {
              isSubscribed = !isSubscribed;
              $alertIconSwitch.unbind('click');
              setupAlertHandlers();
            }
          });
        });
      }

    }


    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      iconSwitch(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.iconSwitch('.icon-switch');
});
