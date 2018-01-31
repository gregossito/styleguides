'use strict';

var Paris = window.Paris || {};

Paris.searchModal = (function(){

  var defaultOptions = {
    openButton: '.js-open-search-modal',
    background: '.search-modal-background',
    confirmButton: '.js-confirm-search-modal',
    input: '.js-input-search-modal',
    content: '.search-modal-content',
    header: '.search-modal-header',
    list: '.search-modal-list',
    footer: '.search-modal-footer'
  };

  function searchModal(selector, userOptions){
    var $el   = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      $openButton,
      $closeButton,
      $input,
      $content,
      $header,
      $list,
      $footer;

    function init(){
      initOptions();

      $openButton = $(options.openButton);
      $closeButton = $el.find(options.background + ", " + options.confirmButton);
      $input = $el.find(options.input);
      $content = $el.find(options.content);
      $header = $el.find(options.header);
      $list = $el.find(options.list);
      $footer = $el.find(options.footer);

      $openButton.on('click', onClickOpenButton);
      $closeButton.on('click', onClickClose);
      $input.on('input', onInputSearch);
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function open() {
      resetSearch();
      $el.fadeIn(400, function() {
        $list.css('max-height', $content.height() - $header.innerHeight() - $footer.innerHeight());
        $input.focus();
      });
    }

    function close() {
      $el.fadeOut();
    }

    function resetSearch() {
      $input.val("");
      $list.find('label').show();
    }

    function onClickOpenButton(e) {
      e.preventDefault();
      open();
    }

    function onClickClose(e) {
      e.preventDefault();
      close();
    }

    function onInputSearch(e) {
      var val = $input.val();
      var $items = $list.find('label');
      $items.hide().filter(':contains(' + val + ')').show();
    }

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      searchModal(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.searchModal('.search-modal');
});

// Override jQuery contains function (case insensitive + accents)
jQuery.expr[':'].contains = function(a, i, m) {
  var rExps=[
    {re: /[\xC0-\xC6]/g, ch: "A"},
    {re: /[\xE0-\xE6]/g, ch: "a"},
    {re: /[\xC8-\xCB]/g, ch: "E"},
    {re: /[\xE8-\xEB]/g, ch: "e"},
    {re: /[\xCC-\xCF]/g, ch: "I"},
    {re: /[\xEC-\xEF]/g, ch: "i"},
    {re: /[\xD2-\xD6]/g, ch: "O"},
    {re: /[\xF2-\xF6]/g, ch: "o"},
    {re: /[\xD9-\xDC]/g, ch: "U"},
    {re: /[\xF9-\xFC]/g, ch: "u"},
    {re: /[\xC7-\xE7]/g, ch: "c"},
    {re: /[\xD1]/g, ch: "N"},
    {re: /[\xF1]/g, ch: "n"}
  ];

  var element = $(a).text();
  var search  = m[3];

  $.each(rExps, function() {
    element = element.replace(this.re, this.ch);
    search = search.replace(this.re, this.ch);
  });

  return element.toUpperCase().indexOf(search.toUpperCase()) >= 0;
};
