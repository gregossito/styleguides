'use strict';

var Cookies = require('js-cookie');

var Paris = window.Paris;

Paris.document = (function(){

  var defaultOptions = {
    postitContentUrl: '/postit/${pageId}',
    isUserSubscribedUrl: '/alerts/isUserSubscribed',
    subscribeUserUrl: '/alerts/subscribeUser',
    unsubscribeUserUrl: '/alerts/unsubscribeUser'
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
        setupAlertAjaxOperations();
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

    function setupAlertAjaxOperations() {
      // init for alert
      var $alertIcon = $('.document-heading-icons .icon-bell');
      var alertId = $alertIcon.attr('href') && $alertIcon.attr('href').split('/').pop();

      if (!alertId) {return;}

      // get alert current status
      var isSubscribed;
      $.ajax({
        type: 'get',
        url: options.isUserSubscribedUrl,
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
              console.error('response to ' + options.isUserSubscribedUrl + '?idalertes=' + alertId + 'is not recognized: ' + subscribed);
              return;
          }
          $alertIcon.attr('href', 'javascript:void(0)');
          setupAlertHandlers();
        }
      });

      function setupAlertHandlers() {
        $alertIcon.attr('title', isSubscribed ? Paris.i18n.t("alerts/unsubscribe") : Paris.i18n.t("alerts/subscribe"));
        $alertIcon.toggleClass('active', isSubscribed);
        $alertIcon.on('click', function onClick() {
          $.ajax({
            type: 'get',
            url: isSubscribed ? options.unsubscribeUserUrl :  options.subscribeUserUrl,
            data: {idalertes: alertId},
            success: function () {
              isSubscribed = !isSubscribed;
              $alertIcon.unbind('click');
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
      document(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.document('body.document');
});
