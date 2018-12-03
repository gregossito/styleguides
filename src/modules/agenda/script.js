'use strict';

var Paris = window.Paris || {};

Paris.agenda = (function(){

  var defaultOptions = {
  };

  function agenda(selector, userOptions){
    var $el     = $(selector),
        options = $.extend({}, defaultOptions, userOptions),
        $next, $prev, $listMonths, $date, $arrondissements, $button;

    function init(){
      initOptions();

      $listMonths = ['Jan.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
      $date =  $('.agenda-agenda-nav-month'); 
      $arrondissements = $('.agenda-agenda-arrondissement');
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
      $('.agenda-agenda-filters select').change(function () {
        $( ".agenda-agenda-filters select option:selected" ).each(function() {
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

      sortNewsAndFilter();
      $date.children('span').on('click', monthFilters);
      $arrondissements.children('span').on('click', arrFilters);
      initHaveActus();
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    // En surbrillance les arrondissements et les mois qui ont une actu 
    function initHaveActus() {
      $('.agenda-block .agenda-card-item').each(function(){
        var date = $(this).find('.news-card-date span').text();
        date = date.split('/');
        var arr = $(this).find('.news-card-arrondissement span').text();
        $('.agenda-agenda-arrondissement-change').eq(arr-1).addClass('have-actus');
        $(".agenda-agenda-nav-month span[data-month="+parseInt(date[1])+"][data-year="+parseInt(date[2])+"]").addClass('have-actus');
      });
    }

    // Click on arrondissement
    function arrFilters(arr) {
      var that = $(this);
      if(that.hasClass('have-actus')) {
        if (that.hasClass('active')) {
          displayAllNews();
        }
        else {
          $('.agenda-agenda-arrondissement-change').removeClass('active');
          that.addClass('active');
          var a = that.text();
          $('.agenda-block').hide();
          $('.agenda-block.agenda-clone').show();
          $('.agenda-clone').empty();
          $('.agenda-block .agenda-card-item').each(function(){
            var arr = $(this).find('.news-card-arrondissement span').text();
            if(parseInt(a) == parseInt(arr)) {
              $('.agenda-clone').append('<li class="agenda-card-item">' + $(this).html() + '</li>');
            }
          });
        }
      }
    } 

    // Click on month
    function monthFilters(month) {
      var that = $(this);
      if(that.hasClass('have-actus')) {
        if (that.hasClass('active')) {
          displayAllNews();
        }
        else {
          $('.agenda-agenda-nav-month span').removeClass('active');
          that.addClass('active');
          var m = that.data('month');
          var y = that.data('year');
          $('.agenda-block').hide();
          $('.agenda-block.agenda-clone').show();
          $('.agenda-clone').empty();
          $('.agenda-block .agenda-card-item').each(function(){
            var date = $(this).find('.news-card-date span').text();
            date = date.split('/');
            if(m == parseInt(date[1]) && y == parseInt(date[2])) {
              $('.agenda-clone').append('<li class="agenda-card-item">' + $(this).html() + '</li>');
            }
          });
        }
      }
    } 

    function displayAllNews() {
      $('.agenda-clone').empty();
      $('.agenda-block').fadeIn();
      $('.agenda-agenda-nav-month span').removeClass('active');
    }

    function sortNewsAndFilter() {
      var m = new Date().getMonth()+1;
      if(m.length<2) { m = "0"+m; }
      var y = new Date().getFullYear();
      var d = new Date().getDate();
      var today =String(y)+String(m)+String(d);
      today = parseInt(today)
      $('.agenda-block .agenda-card-item').each(function(){
        var date = $(this).find('.news-card-date span').text();
        date = date.split('/');
        $(this).attr('data-date', date[2] + date[1] + date[0]);
        var currDate = String(date[2])+String(date[1])+String(date[0]);
        currDate = parseInt(currDate);
        // remove old news
        if(today>currDate) {
          $(this).remove();
        }
      })
      $('.agenda-block').each(function(){
        $(this).html($(this).children('li').sort(function(a, b){
          return ($(b).data('date')) < ($(a).data('date')) ? 1 : -1;
        }));
      });
    }

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      agenda(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.agenda('.agenda-agenda');
});
