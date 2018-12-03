'use strict';

var Paris = window.Paris || {};

Paris.imageFull = (function(){

  var defaultOptions = {
  };

  function imageFull(selector, userOptions){
    var $el     = $(selector),
        options = $.extend({}, defaultOptions, userOptions),
        $modal, $next, $prev, $title, $position, $img, $nb, $close;

    function init(){
      initOptions();
      $modal = $(".treize-modal-wrapper");
      $next = $(".treize-modal-next");
      $prev = $(".treize-modal-prev");
      $title = $(".treize-modal-title");
      $position = $(".treize-modal-position");
      $img = $(".treize-modal-img");
      $close = $(".treize-modal-close");
      $nb = $el.find('a.image-full').length;
      $el.find('a.image-full').on('click', launchModal);
      $next.on('click', next);
      $prev.on('click', prev);
      $close.on('click', outModal);
      $img.on('click', outModal);
      $el.find('a.image-full img').css({opacity:1, visibility:'visible'});


      // key event 
      $("body.treize").keydown(function(e){
        if ((e.keyCode || e.which) == 37) {   
          prev();
        }

        if ((e.keyCode || e.which) == 39) {
         next();
        }   

        if ((e.keyCode || e.which) == 27) {
         outModal();
        }   
      });
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    
    function launchModal(event) {
      event.preventDefault();
      var that = $(this);
      loadModal(that, true);
    }

    // load modal
    function loadModal(that, animation) {
      var animClass = animation ? 'class="treize-modal-animation"' : '';
      var img = '<img ' + animClass + '  src="'+that.attr('href')+'"/>';
      var titre = that.find('.image-full-text').text();
      var i = $('a.image-full').index(that);   
      var current = parseInt(i)+parseInt(1);
      $position.empty().append(current + '/' + $nb); // n / 13 
      $position.attr('data-position',i);
      $title.empty().append(titre);
      $img.empty().append(img);
      $modal.show();
    }

    function next() {
      $modal.hide();
      var i = $position.attr('data-position') || 0;
      i++;
      if(i>=$nb){ i = 0; }
      loadModal($('a.image-full:eq('+i+')'), false);

    }

    function prev() {
      $modal.hide();
      var i = $position.attr('data-position') || 0;
      i--;
      if(i==0){ i = $nb-1; }
      loadModal($('a.image-full:eq('+i+')'), false);
    }

    function outModal(event) {
      event.preventDefault();
      $modal.fadeOut('fast');
    }

    init();
    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      imageFull(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.imageFull('.treize-masonry');
});
