'use strict';

var PubSub = require('pubsub-js');
var throttle = require('lodash.throttle');
var defer = require('lodash.defer');
var attachFastClick = require('fastclick');

var Paris = window.Paris || {};
Paris.responsive = Paris.responsive || {};

// Define media queries to watch
Paris.responsive.sizes = {
  "rheader-medium": {
    mediaQuery: "(max-width: 1160px)"
  },
  "small": {
    mediaQuery: "(max-width: 768px)"
  },
  "large": {
    mediaQuery: "(min-width: 1160px)"
  }
};

var onResize = function() {
  var sizes = Paris.responsive.sizes;
  PubSub.publish('responsive.resize');
  $.each(sizes, function(name, size){
    Paris.responsive.sizes[name].was = size.is;
    Paris.responsive.sizes[name].is = window.matchMedia(size.mediaQuery).matches;
    if (Paris.responsive.sizes[name].was === Paris.responsive.sizes[name].is) {return;}
    Paris.responsive.sizes[name].is ? enableSize(name) : disableSize(name);
  });
}

function enableSize(size) {
  PubSub.publish('responsive.' + size + '.enable');
}

function disableSize(size) {
  PubSub.publish('responsive.' + size + '.disable');
}

$(document).ready(function(){
  attachFastClick(document.body);
  defer(onResize);
  $(window).on('resize', throttle(onResize, 1000));
});
