'use strict';

var Paris = window.Paris || {};

Paris.form = (function(){

  var defaultOptions = {
    thanks: ""
  };

  function form(selector, userOptions){
    var $el = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      $form,
      $captcha,
      $currentField;

    function init(){
      initOptions();

      $form = $el.find('form');
      $captcha = $el.find('.form-item-captcha');

      $el.on('focus', '.form-field', onFieldFocus);
      $el.on('blur', '.form-field', onFieldBlur);
      $form.on('submit', onSubmit);

      renderCaptcha();

      // Check fields validity
      //$el.find('.form-field').each(function(){
      //  checkValidity($(this));
      //});
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function onFieldFocus(){
      $currentField = $(this);

      switch ($currentField.attr('type') || $currentField.prop('tagName').toLowerCase()){
        case 'checkbox':
        case 'radio':
        case 'select':
          var event = 'change';
          break;

        default:
          var event = 'input';
      }

      $currentField.on(event, onCurrentFieldInput);
    }

    function checkValidity($field){
      if ($field) {
        var valid = isFieldValid($field);
        var $formItem = $field.closest('.form-item, .matrix-item');
        $formItem.toggleClass('valid', valid).toggleClass('error', !valid);
      }
    }

    function disableButtons(){
      $el.find('.button[type="submit"]').attr('disabled', true);
    }
    function enableButtons(){
      $el.find('.button[type="submit"]').removeAttr('disabled');
    }

    function isFieldValid($field){
      if ($field) {
        var validity = false;

        if ($field.attr('type') === "checkbox") {
          var $formItem = $field.closest('.form-item');
          if (!$formItem.hasClass("required")) {return true;}
          var $matrixItem = $field.closest('.matrix-item');
          if ($matrixItem.length) {
            var $checkboxes = $matrixItem.find('input[type="checkbox"]');
          } else {
            var $checkboxes = $formItem.find('input[type="checkbox"]');
          }
          $checkboxes.each(function(){
            if ($(this).is(':checked')) {validity = true;}
          });
          return validity;
        } else {
          validity = $field.get(0).validity;
          return validity.valid;
        }

      }
    }

    function onCurrentFieldInput(){
      checkValidity($currentField);
    }

    function onFieldBlur(){
      onCurrentFieldInput();
      $currentField.off('keypress', onCurrentFieldInput);
      $currentField = null;
    }

    function onSubmit(e){
      e.preventDefault();

      if ($form.get(0).checkValidity()) {
        saveData();
      } else {
        // invalid
        console.log("form invalid");
      }
    }

    function saveData() {
      var data = $form.serializeArray();
      $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method') || 'POST',
        data: data,
        success: onDataSaved,
        error: onDataError
      });
    }

    function onDataSaved(data, status, xhr){
      if (data.status === 'error') {
        onDataError(xhr, 'error');
        return;
      }
      disableButtons();
      resetErrors();
      $el.append('<p class="form-message success">'+ options.thanks +'</p>');
    }

    function onDataError(xhr, status, error){
      enableButtons();
      try {
        var data = $.parseJSON(xhr.responseText);
      } catch (e) {
        if(e.constructor == SyntaxError) {
          console.log('error response should be JSON');
        }
        return;
      }

      resetErrors();

      // add error messages
      $el.append('<p class="form-message error">'+data.message+'</p>');
      $.each(data.errors, function(field, message){
        var $formField = $el.find('.form-field[name="'+field+'"]');
        var $formItem = $formField.closest('.form-item, .matrix-item');
        $formItem.removeClass('valid').addClass('error');
        $('<p class="form-item-help error">'+message+'</p>').insertAfter($formField);
      });
    }

    function resetErrors(){
      $el.find('.form-item, .matrix-item').removeClass('error');
      $el.find('.form-item-help.error, .form-message.error').remove();
    }

    function renderCaptcha(){
      if ($captcha.length) {
        $captcha.find('.g-recaptcha').attr('data-sitekey', Paris.config.captcha.key);
        $('body').append('<script src="https://www.google.com/recaptcha/api.js" async defer></script>');
      }
    }

    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      form(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.form('.component-form');
});
