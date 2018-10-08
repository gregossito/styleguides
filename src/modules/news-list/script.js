'use strict';

var Paris = window.Paris || {};

Paris.newsList = (function(){

  var defaultOptions = {
  };

  function newsList(selector, userOptions){
    var $el     = $(selector),
        options = $.extend({}, defaultOptions, userOptions),
        $next, $prev, $listMonths, $date, $arrondissements, $button;

    function init(){
      initOptions();

      $listMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      $prev = $('.news-list-agenda-nav-prev');
      $next = $('.news-list-agenda-nav-next');
      $date =  $('.news-list-agenda-nav-month');
       
      var current_month = new Date().getMonth();
      $date.append($listMonths[current_month]);
      $date.data('year', new Date().getFullYear());
      $date.data('month', current_month);
      $arrondissements = $('.news-list-agenda-arrondissement-change');
      monthActusArr(new Date().getMonth(), new Date().getFullYear());

      $prev.on('click', onClickPrev);
      $next.on('click', onClickNext);
      $arrondissements.on('click', onClickArrondissement);
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    // met en surbrillance les arrondissements qui ont une actu en fonction du mois et de l'année
    function monthActusArr(m,y) {
      $('.news-list-agenda-arrondissement-change').removeClass('active');
      $('.news-list-agenda-arrondissement-change').removeClass('have-actus');
      $('.agenda .news-agenda-card-item').hide();
      $('.agenda .news-agenda-card-item').each(function(){
        var date = $(this).find('.news-card-date span').text();
        date = date.split('/');
        if(m == parseInt(date[1]-1) && y == parseInt(date[2])) {
          var arr = $(this).find('.news-card-arrondissement span').text();
          $('.news-list-agenda-arrondissement-change').eq(arr-1).addClass('have-actus');
          $(this).show();
        }
      });
    }

    function onClickPrev(e){
      var m = $date.data('month')-1;
      var y = $date.data('year');
      if(m<0){ m = 11; y=y--;}
      $date.html($listMonths[m]);
      $date.data('year', y);
      $date.data('month', m);
      monthActusArr(m,y);
    }

    function onClickNext(e){
      var m = $date.data('month')+1;
      var y = $date.data('year');
      if(m>11){ m = 0; y=y++;}
      monthActusArr(m,y)
      $date.html($listMonths[m]);
      $date.data('year', y);
      $date.data('month', m);
      monthActusArr(m,y);
    }

    function onClickArrondissement(e){
      var m = $date.data('month');
      var y = $date.data('year');
      var a = $(this).text();
      var that = $(this);
      $('.news-list-agenda-arrondissement-change').removeClass('active');
      if($(this).hasClass('have-actus')) {
        $('.agenda .news-agenda-card-item').hide();
        $('.agenda .news-agenda-card-item').each(function(){
          var date = $(this).find('.news-card-date span').text();
          var arr = $(this).find('.news-card-arrondissement span').text();
          date = date.split('/');
          if(m == parseInt(date[1]-1) && y == parseInt(date[2]) && parseInt(a) == parseInt(arr)) {
            that.addClass('active');
            $(this).show();
          }
        });
      }
    }

    function newsFilters(arrondissement,month) {

    }

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      newsList(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.newsList('.news-list-agenda');
});
