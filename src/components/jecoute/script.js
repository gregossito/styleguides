'use strict';

var Cookies = require('js-cookie');

var Paris = window.Paris || {};

Paris.jecoute = (function(){

  var defaultOptions = {
    thanks: "Attention nous ne formulons pas de réponse dans cet espace."
  };

  function jecoute(selector, userOptions){
    var $el = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      $message, $form, $formElements, $upload, $output,
      files = [];

    function init() {
      initOptions();

      $message = $el.find('.jecoute-message');
      $form = $el.find('.jecoute-form');
      $formElements = $form.find('input, textarea, button');
      $upload = $formElements.filter('input[type="file"]');
      $output = $form.find('output');

      $form.on('submit', onSubmitForm);

      if (Cookies.get(Paris.config.cookies.email.name)) {
        $formElements.filter('input[name="email"]').attr('value', Cookies.get(Paris.config.cookies.email.name));
      }

      if ($upload.length) {
        if (window.File && window.FileReader && window.FileList) {
          $upload.on('change', onFileUpload);
        }
        else {
          console.log('The File APIs are not fully supported in this browser.');
        }
      }
    }

    function initOptions() {
      $.each($el.data(), function(key, value) {
        options[key] = value;
      });
    }

    function removeUploadedFile(e) {
      var $li = $(this).parent();
      var index = $li.index();

      files.splice(index, 1);
      $li.remove();

      isBiggerSize();
    }

    function onFileUpload(e) {

      var allowedExtension = ['jpg','jpeg','png','gif','bmp', 'doc','xls','ods',
      'odt','pdf','txt','csv','zip','rar','ppt','xpptx','pptx'];

      for (var i = 0, f; f = e.target.files[i]; i++) {
        var extension = f.name.split('.').pop();
        if (allowedExtension.indexOf(extension) === -1) {
          alert('Le type de fichier .' + extension + ' est interdit !');
        }
        else {
          var html = '';
          html += '<li class="output-item">';
          html += (f.name.length > 40) ? f.name.substr(0, 19) + ' ... ' + f.name.substr(f.name.length-18, f.name.length) : f.name;
          html += '<i>(' + humanSize(f.size) + ')</i>';
          html += '<span class="output-item-remove icon-close-rounded"></span>';
          html += '</li>';

          $output.find('.output-items').append(html);
          files.push(f);
        }
      }

      $output.find('.output-item-remove').on('click', removeUploadedFile);
      isBiggerSize();
    }

    function onSubmitForm(e) {
      e.preventDefault();

      var $policy = $formElements.filter('input[type="checkbox"]');
      if ($policy.length && !$policy.is(':checked')) {
        showError(Paris.i18n.t("jecoute/error/policy"));
        return;
      }

      if (isBiggerSize()) {
        showError(Paris.i18n.t("jecoute/error/file_size"));
        return;
      }

      var data;
      if (files.length) {
        data = new FormData();

        var $textarea = $formElements.filter('textarea');
        data.append($textarea.attr('name'), $textarea.val());

        var $email = $formElements.filter('input[type="email"]');
        data.append($email.attr('name'), $email.val());

        if ($policy.length) {
          data.append($policy.attr('name'), $policy.val());
        }

        data.append('url', window.location.href);

        // upload files at the end for Sails not to trunc data
        for (var i = 0, f; f = files[i]; i++) {
          data.append('files', f, f.name);
        }
      }
      else {
        data = $(this).serializeArray();

        data.push({
          name: 'url',
          value: window.location.href
        });
      }

      $formElements.attr('disabled', 'disabled');

      saveQuestion(data);
    }

    function saveQuestion(data) {
      var ajaxOptions = {
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: data,
        success: onQuestionSaved,
        error: onQuestionError
      };

      if (files.length) {
        ajaxOptions.contentType = false;
        ajaxOptions.processData = false;
      }

      $.ajax(ajaxOptions);
    }

    function onQuestionSaved(jqXHR, status) {
      $form.hide();
      $message.text(options.thanks).show();
    }

    function onQuestionError(jqXHR, status, err) {
      console.error(err);
      showError(options.error);
    }


    /////////////
    // HELPERS //
    /////////////

    function showError(msg) {
      $message.text(msg).addClass('text-error').show();
      window.setTimeout(function() {
        $formElements.attr('disabled', false);
        $message.show().removeClass('text-error').text('');
      }, 7000);
    }

    function isBiggerSize(maxSize) {
      var size = 0;
      var ms = maxSize || 10*1048576; // 10Mo

      for (var i = 0, f; f = files[i]; i++) {
        size += f.size;
      }

      var isBigger = size > ms;
      $form.find('.upload-size').toggleClass('text-error', isBigger);

      return isBigger;
    }

    function humanSize(bytes) {
      var sizes = ['octets', 'Ko', 'Mo', 'Go', 'To'];
      if (bytes === 0) return '0 octet';

      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    //////////
    // INIT //
    //////////

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      jecoute(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.jecoute('.component-jecoute');
});

