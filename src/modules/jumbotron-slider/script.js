'use strict';
require('velocity-animate');

var PubSub = require('pubsub-js');

var Paris = window.Paris || {};

Paris.jslider = (function(){

  var defaultOptions = {
  };

  function jslider(selector, userOptions){
    var $el     = $(selector),
        options = $.extend({}, defaultOptions, userOptions);

    function init(){
      initOptions();
      
      // LocalStorage expire 7 jours jumbotron-slider
      var object = JSON.parse(localStorage.getItem("paris"));
      var now = new Date().getTime();
      var dateString = (object && object.expire) ? object.expire : 0;
      if(parseInt(now)>parseInt(dateString) || dateString == 0){
        $el.show();
        var object = {expire: new Date().getTime() + (7*24*60*60*1000)}
        localStorage.setItem("paris", JSON.stringify(object));
      }
      else {
        $el.hide();
      }
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function saveCloseForSession(){
      sessionStorage.setItem($el.attr('id'), 'closed');
    }

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      jslider(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.jslider('.jumbotron-slider');
});
