'use strict';
require('velocity-animate');
var has = require('lodash.has');
var values = require('lodash.values');
var map = require('lodash.map');
var PubSub = require('pubsub-js');

var Paris = window.Paris || {};

Paris.sectionsPanel = (function(){

  var defaultOptions = {
    breakpoint: "small",
    velocity: {
      duration: 350,
      ease: 'ease-in-out',
      queue: false
    }
  };

  function sectionsPanel(selector, userOptions){
    var $el     = $(selector),
      options = $.extend({}, defaultOptions, userOptions),
      api = {},
      $nav, $subnav, $content,
      $navItems, $navItemsLinks, $navMore,
      $subnavSections, $subnavSectionsLinks, $subnavDefault,
      $contentWrapper,
      $backButtons,
      root,
      currentLevel = "nav",
      heights = {};

    function init(){
      initOptions();

      $nav = $el.find('.sections-panel-nav');
      $navItems = $nav.find('.sections-panel-nav-items');
      $navItemsLinks = $navItems.find('a');
      $navMore = $nav.find('.sections-panel-nav-more');

      $subnav = $el.find('.sections-panel-subnav');
      $subnavDefault = $subnav.find('.sections-panel-subnav-default');
      $subnavSections = $subnav.find('.sections-panel-subnav-section');
      $subnavSectionsLinks = $subnavSections.find('a');

      $content = $el.find('.sections-panel-content');
      $contentWrapper = $content.find('.sections-panel-content-wrapper');

      $backButtons = $el.find('.sections-panel-back');

      PubSub.subscribe('responsive.resize', setHeight);
      PubSub.subscribe('responsive.' + options.breakpoint + '.enable', enableSmall);
      PubSub.subscribe('responsive.' + options.breakpoint + '.disable', disableSmall);

      if ($subnav.hasClass('has-current-item')) {currentLevel = "subnav";}
      if ($el.hasClass('has-content')) {currentLevel = "content";}

      PubSub.subscribe("hub:init", function(e, data){
        root = data;
      });

      // Keyboard navigation
      $(document).keydown(onKeyDown);
      $(document).keyup(onKeyUp);

      $el.data('api', api);
    }

    function initOptions() {
      $.each($el.data(), function(key, value){
        options[key] = value;
      });
    }

    function setHeight() {
      var newHeight = Paris.responsive.sizes[options.breakpoint].is ? 'auto' : calculateHeight();
      $el.css("height", newHeight);
    }

    function calculateHeight(){
      if (!has(heights, 'nav')) {
        var navHeight = $navItems.outerHeight(true) + $navMore.outerHeight();
        var navPadding = $nav.outerHeight() - $nav.height();
        heights.nav = navHeight + navPadding;
      }
      if (!has(heights, 'subNav')) {
        var subNavHeight = 0;
        var subNavPadding = $subnav.outerHeight() - $subnav.height();
        $subnavSections.add($subnavDefault).each(function () {
          subNavHeight = Math.max(subNavHeight, $(this).outerHeight());
        });
        heights.subNav = subNavHeight + subNavPadding;
      }
      var contentHeight = $contentWrapper.outerHeight();
      var contentPadding = $content.outerHeight() - $content.height();
      heights.content = contentHeight + contentPadding;
      return Math.max.apply(null, values(heights));
    }

    function enableSmall() {
      $navItemsLinks.off('click', onClickNavLink);
      $subnavSectionsLinks.off('click', onClickSubnavLink);
      $backButtons.off('click', onClickBack);
    }

    function disableSmall() {
      $navItemsLinks.on('click', onClickNavLink);
      $subnavSectionsLinks.on('click', onClickSubnavLink);
      $backButtons.on('click', onClickBack);
    }

    function onClickNavLink(e) {
      e.preventDefault();
      var $this = $(this);
      var subnavSection = $this.data('subnav-section');
      $nav.addClass('has-current-item');
      $navItemsLinks.removeClass("current").attr('aria-expanded', 'false');
      $this.addClass("current").attr('aria-expanded', 'true');
      if (currentLevel === "content") {closeContent();}
      openSubnavSection(subnavSection);
    }

    function openSubnavSection(section) {
      var $section = $subnavSections.filter('#subnav-' + section);
      $subnavDefault.hide();
      $subnavSections.hide();
      $section.velocity({
        opacity: 1
      }, $.extend({}, options.velocity, {
        complete: function(){
          $section.find('a').first().focus();
        },
        display: 'block'
      }));
      $subnav.addClass('has-current-item');
      currentLevel = "subnav";

      var $currentNavItemsLink = $navItemsLinks.filter('.current');
      PubSub.publish("sections-panel:change", {
        image: $currentNavItemsLink.data('background'),
        title: $currentNavItemsLink.text()
      });

      $backButtons.filter('.sections-panel-subnav-back').find('.accessibility_label').text(Paris.i18n.t("close_nav", [$currentNavItemsLink.text()]));

      $('title').text($currentNavItemsLink.data('pageTitle') + " - Paris.fr");

      if (Modernizr.history) {
        history.replaceState({}, $currentNavItemsLink.text(), $currentNavItemsLink.attr("href"));
      }
    }

    function closeSubnavSection() {
      $navItemsLinks.filter('.current').focus();
      $navItemsLinks.removeClass("current");
      if (currentLevel === "content") {closeContent();}
      $subnavDefault.show();
      $subnavSections.hide();
      $subnav.removeClass('has-current-item');
      currentLevel = "nav";

      PubSub.publish("sections-panel:change", {
        root: true,
        image: $subnavDefault.data('background'),
        title: root.title
      });

      if (Modernizr.history) {
        history.replaceState({}, root.title, root.href);
      }
    }

    function onClickSubnavLink(e) {
      e.preventDefault();
      var $this = $(this);
      var url = $this.data('json');
      $subnavSectionsLinks.removeClass("current").attr('aria-expanded', 'false');
      $this.addClass("current").attr('aria-expanded', 'true');
      openContent(url);
    }

    function openContent(url){
      $.ajax({
        url: url,
        type: "get",
        success: renderContent
      });

      if (currentLevel !== "content") {
        $nav.addClass("closed");
        $subnav.velocity({
          translateX: -200
        });
        $content.velocity({
          opacity: [1, 0],
          translateX: [0, 200]
        }, $.extend({}, options.velocity, {
          complete: function(){
            $el.addClass('has-content');
          },
          delay: 200,
          display: 'block'
        }));
      }
      currentLevel = "content";

      var $currentNavItemsLink = $navItemsLinks.filter('.current');
      var $currentSubnavSectionsLink = $subnavSectionsLinks.filter('.current');
      var currentTitle = $currentSubnavSectionsLink.find('.sections-panel-subnav-item-title').text();
      $backButtons.filter('.sections-panel-content-back').attr('href', $currentNavItemsLink.attr('href')).find('.accessibility_label').text(Paris.i18n.t("close_nav", [currentTitle]));
      PubSub.publish("sections-panel:change", {
        image: $currentSubnavSectionsLink.data('background'),
        title: currentTitle,
        parent: {
          id: $currentNavItemsLink.data("subnav-section"),
          href: $currentNavItemsLink.attr("href"),
          text: $currentNavItemsLink.text()
        }
      });

      $('title').text($currentSubnavSectionsLink.data('pageTitle') + " - Paris.fr");

      if (Modernizr.history) {
        history.replaceState({}, currentTitle, $currentSubnavSectionsLink.attr("href"));
      }
    }

    function closeContent(){
      $nav.removeClass("closed");
      $subnavSectionsLinks.filter('.current').focus();
      $subnavSectionsLinks.removeClass("current");
      $contentWrapper.empty();
      $subnav.velocity({
        translateX: 0
      }, $.extend({}, options.velocity, {
        delay: 200
      }));
      $content.velocity({
        opacity: [0, 1],
        translateX: [200, 0]
      }, $.extend({}, options.velocity, {
        complete: function(){
          $el.removeClass('has-content');
          setHeight();
        },
        display: 'none'
      }));
      currentLevel = "subnav";
    }

    function renderContent(data) {
      PubSub.publish("sections-panel:change", {
        news: data.news
      });

      var content = Paris.templates["sections-panel"]["sections-panel-content"](data.content);

      $contentWrapper.html(content).velocity({
        opacity: [1, 0]
      }, $.extend({}, options.velocity, {
        complete: function() {
          setHeight();
          $contentWrapper.find('a').first().focus();
        },
        display: 'block'
      }));
    }

    function onClickBack(e){
      e.preventDefault();
      if (currentLevel === 'subnav') {
        closeSubnavSection();
      } else if (currentLevel === 'content') {
        closeContent();
      }
    }

    function onKeyDown(e) {
      // only if the current element has the focus
      var hasFocus = $(':focus').closest($el).length === 1;
      if (!hasFocus) {return true;}

      switch (e.which) {
        case 27: // Esc
        case 37: // arrow left
        case 38: // arrow top
        case 39: // arrow right
        case 40: // arrow bottom
          e.preventDefault();
          e.stopPropagation();
          return false;
          break;
      }
    }

    function onKeyUp(e){
      // only if the current element has the focus
      var hasFocus = $(':focus').closest($el).length === 1;
      if (!hasFocus) {return true;}

      switch (e.which) {
        case 27: // Esc
        case 37: // arrow left
          if (currentLevel === "subnav") {closeSubnavSection();}
          else if (currentLevel === "content") {closeContent();}
          break;

        case 38: // arrow top
        case 40: // arrow bottom
          var $currentLink = $el.find('a:focus');
          var $currentLinkList;
          var direction = e.keyCode === 38 ? -1 : 1;
          if (currentLevel === "nav") {
            $currentLinkList = $nav.find('a');
          } else if (currentLevel === "subnav") {
            $currentLinkList = $subnav.find('.sections-panel-subnav-section:visible').find('a').add('.sections-panel-subnav-back');
          } else if (currentLevel === "content") {
            $currentLinkList = $currentLink.closest('.sections-panel-content').find('a');
          }
          var nextIndex = $currentLinkList.index($currentLink) + direction;
          if (nextIndex < 0 || nextIndex >= $currentLinkList.length) {break;}
          var $nextLink = $currentLinkList.get(nextIndex);
          if ($nextLink) {$nextLink.focus();}
          break;

        case 39: // arrow right
          $el.find('a:focus').click();
          break;
      }
    }


    // The API for external interaction

    api.openSection = function(id){
      var link = $navItemsLinks.filter("[data-subnav-section='" + id + "']");
      $(link).trigger('click');
    };

    api.closeSection = function(){
      closeSubnavSection();
    };

    api.currentSection = function(){
      var $currentNavItemsLink = $navItemsLinks.filter('.current');
      return $currentNavItemsLink.data("subnav-section")
    };


    init();

    return $el;
  }

  return function(selector, userOptions){
    return $(selector).each(function(){
      sectionsPanel(this, userOptions);
    });
  };

})();

$(document).ready(function(){
  Paris.sectionsPanel('.sections-panel');
});
