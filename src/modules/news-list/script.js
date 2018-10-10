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

      $listMonths = ['Jan.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
      $date =  $('.news-list-agenda-nav-month'); 
      $arrondissements = $('.news-list-agenda-arrondissement');
      var current_month = new Date().getMonth();

      // List of months, start with current month
      for (var i = current_month; i < 12; i++) {
        var m = i+1;
        $date.append('<span data-month="' + m + '" data-year="' + new Date().getFullYear() + '">' + $listMonths[i]+ '</span>');
      }
      for (var i = 0; i < current_month; i++) {
        var m = i+1;
        var y = parseInt(new Date().getFullYear())+1;
        $date.append('<span data-month="' + m + '" data-year="' + y + '">' + $listMonths[i]+ '</span>');
      }

      // Filters action
      $('.news-list-agenda-filters select').change(function () {
        $( ".news-list-agenda-filters select option:selected" ).each(function() {
          if($(this).val() == 'arr'){
            $date.hide();
            $arrondissements.show();
          }
          else {
            $date.show();
            $arrondissements.hide();
          }
        });
        displayAllNews();
      })
      .change();

      $date.children('span').on('click', monthFilters);
      $arrondissements.children('span').on('click', arrFilters);
      initHaveActus()
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    // En surbrillance les arrondissements et les mois qui ont une actu 
    function initHaveActus() {
      $('.agenda .news-list-card-item').each(function(){
        var date = $(this).find('.news-card-date span').text();
        date = date.split('/');
        var arr = $(this).find('.news-card-arrondissement span').text();
        $('.news-list-agenda-arrondissement-change').eq(arr-1).addClass('have-actus');
        $(".news-list-agenda-nav-month span[data-month="+parseInt(date[1])+"][data-year="+parseInt(date[2])+"]").addClass('have-actus');
      });
    }


    // Click on arrondissement
    function arrFilters(arr) {
      var that = $(this);
      if (that.hasClass('active')) {
        displayAllNews();
      }
      else {
        $('.news-list-agenda-arrondissement-change').removeClass('active');
        that.addClass('active');
        var a = that.text();
        $('.agenda').hide();
        $('.agenda-clone').empty();
        $('.agenda .news-list-card-item').each(function(){
          var arr = $(this).find('.news-card-arrondissement span').text();
          if(parseInt(a) == parseInt(arr)) {
            $('.agenda-clone').append('<li class="news-list-card-item">' + $(this).html() + '</li>');
          }
        });
      }
    } 

    // Click on month
    function monthFilters(month) {
      var that = $(this);
      if (that.hasClass('active')) {
        displayAllNews();
      }
      else {
        $('.news-list-agenda-nav-month span').removeClass('active');
        that.addClass('active');
        var m = that.data('month');
        var y = that.data('year');
        $('.agenda').hide();
        $('.agenda-clone').empty();
        $('.agenda .news-list-card-item').each(function(){
          var date = $(this).find('.news-card-date span').text();
          date = date.split('/');
          if(m == parseInt(date[1]) && y == parseInt(date[2])) {
            $('.agenda-clone').append('<li class="news-list-card-item">' + $(this).html() + '</li>');
          }
        });
      }
    } 

    function displayAllNews() {
      $('.agenda-clone').empty();
      $('.agenda').fadeIn();
      $('.news-list-agenda-nav-month span').removeClass('active');
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
