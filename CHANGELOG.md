# Changelog

## Versioning system

Let's take the `x.β.α` version number:
* `α` is for small fixes that don't involve any template update, mainly css evolution
* `β` is for versions that need template update for static (html) use of the styleguide and addition of new elements
* `x` is for major release involving a more careful integration of the styleguide

## 1.3.0 (2015-11-27)

* all components now accept `modifiers`
* component `card` added
* component `rush-hours` added
* module `block-aside-access` added
* module `block-aside-contact`: added minimap
* module `button`: add button `small`
* module `icon-switch` added
* module `notice`: improved text wrapping on small screens
* layout `left-col`: fix affix bug when there is no `anchors-list`
* template `single-equipment` added (based on `generic`)
* template `faq` is now based on `generic`
* template `generic`: `aside` data is now an array (same behavior as `components`)
* accessibility: improved modules `document-heading`, `rheader`, `sections-panel`
* DEPRECATED: removed favorite icon from `document-heading` (affects all templates based on `generic`)
* DEPRECATED: removed `share` from anchors (in component `text`)

## 1.2.2 (2015-11-24)

* component `form`: added `noscript` reCaptcha
* template `generic`: now accepts a `notice` above content
* upgraded harp to 0.20

## 1.2.1 (2015-11-19)

* do not cache ajax `post-it` request
* module `block-content-jecoute`: remove margin on `p` tag in answers

## 1.2.0 (2015-11-10)

* new UI for the styleguide documentation
* module `get-involved`: removed `title` from item
* component `video`: added `title`

## 1.1.6 (2015-11-06)

* accessibility improvements (mainly on `sections-panel` module)
* upgraded harp to 0.19

## 1.1.5 (2015-11-04)

* module `get-involved-list`: fixed collision with get-involved
* module `jumbotron`:
  * added `no-overlay` modifier to remove overlay
  * added conditional `block`

## 1.1.4 (2015-11-03)

* accessibility improvements
* component `jecoute` and module `poll`: use `button` module
* component `form` improved for release
* template `subhome-news`: bugs fixed in `news-list` and header
* improved Jade syntax in multiple files (always use `var`)

## 1.1.3 (2015-11-02)

* multiple accessibility improvements
* templates `document`, `single-news` and `single-person` have been merged into `generic`
* icon `.icon-file` renamed `.icon-dl` and added `.icon-file` `.icon-text`
* component `jecoute`: added `upload` and `policy` feature

## 1.1.2 (2015-10-02)

* same as 1.1.1, but with updated build

## 1.1.1 (2015-10-02)

* module `block-aside-checkboxes`: fix checkbox visibility on Chrome
* component `gallery`: add `clear: both`;

## 1.1.0 (2015-09-29)

* remove template jade from build
  * template js is still in the build
* component `form`: add missing .component class
* component `table`: style `a` tags as in text component
* template `list-person`:
  * fix js error on empty search
  * correct page number in url query

## 1.0.8 (2015-09-16)

* prod wrapper: allow `meta` and `link` tags injection
* update `templatizer` to 2.0.2
* component `form` added
* component `gallery` added
* component `postit`: added background color
* module `block-content-jecoute`: text can now contain links
* module `block-aside-checkboxes`: replace checkbox input by `a` tag for SEO
* template `list-persons`: improved search javascript

## 1.0.7 (2015-08-03)

* component `postit`: added `title` to data
* module `anchors-list`: add postit item dynamically
* module `gallery-ugc`: removed ajax loading
* fixed bug with `Cookies.getJSON` when the cookie is not set

## 1.0.6 (2015-07-27)

* component `jecoute`: fixed bug when after floating element
* component `news-push`: fixed link hover + optional link
* module `anchors-list` & `button-top`: a cookie can be used to disable scroll animation
* module `document-heading`: improved active & hover states for icons
* module `news-card`: fixed border-radius + overflow hidden Chrome bug
* template `document`: implemented alerts subscription
* template `document/postit`: DRY by reusing `document`
* better support when JS is disabled (using Modernizr `no-js` class)
* added `alerts` in `locales.js`
* added `publicdata` in `config.js`

## 1.0.5 (2015-07-23)

* component `html`: same behaviour as component `video` (do not load until cookies are accepted)
* module `video-cover`: change cookie legal text, added `button` to accept
* all templates: edited CNIL notice text
* template `home`: optional legal `notice`

## 1.0.4 (2015-07-23)

* module `notice`: allow use of `button` instead of close
* all templates: replace CNIL notice data
* template `home`: added legal `notice` before the `footer`
* template `list-persons`: fixed front-end rendered pagination

## 1.0.3 (2015-07-20)

* module `news-card`: added `min-height`
* module `pagination`:
  * prevent click on current page
  * added `base_url` that will be used as link to first page
* module `rheader`: added `rel="nofollow"` to menu button
* module `sections-panel`: refresh page `title` on navigation
* template `document`:
  * async loading of `postit`
  * added `data-pageid` to `bodyAttributes`
* template `list-persons`: added `base_url` to `pagination` data
* template `search`: added meta tag `robots`
* template `single-news`: added `jecoute` component
* template `subhome-news`: added `base_url` to `pagination` data
* added ability to add meta tags to wrapper_prod
* added `cookies.parisconnect` in `config.js`

## 1.0.2 (2015-06-25)

* composant `table`: improved CSS
* module `jumbotron`: fixed CSS bug in Firefox 24
* module `pagination`: fixed bug when current = 3 and total = 3
* module `rheader`:
  * fixed get-involved button in IE9 and Firefox 24
  * put variables in separate file to allow import
* module `share`: fixed bug when a tweet is embedded in the page
* template `generic`: added `jecoute` component
* template `list-persons`: added number to `secteur` facet

## 1.0.1 (2015-06-24)

* module `button-top`:
  * fix the `rheader` when scrolling to the top
  * reset the hash when scrolling to the top
* module `rheader`:
  * prevent click on buttons when folded
* module `search-field`:
  * enlarge input when the `around` button is hidden

## 1.0.0 (2015-06-23)

* module `button-top`: display it under `rheader`
* module `rheader`:
  * prevent scroll on iOS, when mobile nav is open
  * move nav button a top `notice` is present and visible
* module `anchors-list`:
  * fixed bug where affix breaks on viewport resize

## 0.14.0 (2015-06-23)

* component `jecoute`: improved CSS on small screens
* component `buttons`: improved CSS on very small screens
* modules `block-content-*`: behave as `three-col` on medium screens
* module `button-top`: added to small and medium screens
* module `cross-content`: fixed font size for medium screens
* module `news-card`: improved CSS on small screens
* module `quick-access`:
  * improved CSS on small screens
  * remove video on iOS devices
* module `rheader`:
  * disable scroll monitoring when nav is opened
  * fixed rendering with JS disabled on template `nav`
* module `sections-panel`: fixed rendering on iPad
* layout `right-col`: improved CSS on medium screens
* template `error`: fixed XSS fault
* template `subhome-get-involved`: added modifier `gray-background` to `links_group`
* templates using component `jecoute`: shortened email field placeholder
* all templates except `home`, `error` and `nav`: added `fixed` modifier to `rheader`

## 0.13.6 (2015-06-22)

* component `image`: new `max-height: 540px`
* module `get-involved-list`: remove hands background by default (added a `hand` modifier if needed)
* module `quick-access`: fixed video 1px bug on Firefox
* module `rheader`:
  * added `target` for `locales`
  * now follows search button link
* layout `left-col`: fixed JS bug
* template `search`:
  * show popular searches when search is empty
  * show `rheader` search button as always active (data changed to add `"current": true`)
  * improved on mobile
* `config.js`: added `algolia.url.api_popular_searches`

## 0.13.5 (2015-06-22)

* module `quick-access`: do not add `secondary` modifier if `primary` is already set
* module `rheader`: fixed current item
* module `search-results-list`: fixed title when no result
* module `sections-panel`:
  * fixed content animation
  * removed anchors from links in data
  * fixed content rendering to have optional `buttons` and `more_links`
* module `quick-access` and templates with search feature (`search`, `list-persons`):
  * do not take out-dated answers into account
* templates with links to hub (`document`, `error`, `home`, `hub`):
  * removed anchors from links in data
* template `document`: optional `poll`
* template `list-persons`: added pagination data to `locales.js`
* template `nav`: use layout wrapper
* template `search`:
  * update URL during search (added `bodyAttributes` to template data)
  * do no launch search in the browser if done on the server
* use JSON syntax in `locales.js`
* added stylesheet for IE >= 9, fixed IE conditional comments
* harmonized tests on items length

## 0.13.4 (2015-06-19)

* component `jecoute`: fixed input placeholder
* module `news-card`: fixed display without image
* module `rheader`: look for buttons with `data-action="open-search"`
* module `search-push`:
  * override modifiers
  * added `data-action`
  * added `aria-controls` to search button
  * improved CSS
* template `subhome-news`: modified `search_push.button` data

## 0.13.3 (2015-06-19)

* module `error-heading`: fixed responsive for logo, allow HTML in `trace`
* module `sections-panel`: fixed condition
* template `home`: `data.news` instead of `data.list` for the `news-list`

## 0.13.2 (2015-06-18)

* module `button-top`: fixed bug on Chrome
* module `document-heading`: fixed broken icons
* module `header`: deleted
* module `quick-access`:
  * can now be used inside `rheader`
  * fixed display of section in results
* module `rheader`:
  * integrated `quick-access`
  * fixed logo offset while extended on large screens
* module `table-of-contents`: optional parts, wrapped `items` in `list`
* template `error`:
  * added `data.trace`
  * optional parts
  * updated `table-of-contents` data
* template `home`:
  * set data `data.search.input.id` and  `data.results.button.href` (in `quick-access` block)
* all templates except `home` and `search`: added `quick-search` to `rheader` data
* added `autoprefixer` to build process
* added the meta `viewport` to wrapper_prod
* fixed bug and optimized `scroll.js`

## 0.13.1 (2015-06-17)

* colors: simplified the number of variables, improved documentation
* module `anchors-list`: automatically scroll to anchor in URL on page load
* module `document-heading`:
  * added default background-color
  * changed transparent black layer from 40% to 10%
* module `header`: DEPRECATED in favor of `rheader`
* module `hub-heading`:
  * added default background-color
  * changed transparent black layer from 40% to 10%
* module `notice`: improved closing animation
* layout `left-col`: now uses flexbox when available, fixed scroll bug
* template `hub`: display `news-list` only when it has content

## 0.13.0 (2015-06-17)

* component `video`:
  * improved cookie logic
  * added a `cookie: false` data to bypass the cookie verification
* module `block-aside`: fixed modifier `two-cols` (previously `two_cols`)
* module `breadcrumbs`: fixed padding
* module `button-top`: hide on small and medium screens
* module `document-heading`: added target to icons
* module `error-heading`: responsive
* module `links-group`: fixed centering of icon in button
* module `notice`: persist close state for the session, improved animation
* module `rheader`:
  * aligned the vertical bar in logo with the `heading` modules of the body
  * better spacing with following `layout-content`
  * re-added the fix / unfix for top `notice` support
  * added `extended` state for `home` template
* module `sections-panel`:
  * removed separator when there is no intro text
  * optional intro, buttons and links in content
* module `table-of-contents`: responsive
* module `video-cover`:
  * improved cookie logic
  * added a `cookie: false` data to bypass the cookie verification
* layout `left-col`: fixed bug affix
* template `home`:
  * removed modifiers from `stay-connected` block
  * added "closed" modifier to `notice`
  * added "extended" modifier to `rheader`
* template `single-news`: added `share` in left column
* fixed `share.mail` in `locales.js`
* improved cookie logic in `cnil.js`
* changed cookie lib (`cookies-js` to `js-cookie`) to prevent automatic cookie setting
* added `favicon.ico` to build
* added `egg.js` script ;)

## 0.12.6 (2015-06-16)

* fixed CSS path in wrapper_prod

## 0.12.5 (2015-06-15)

* fixed build (files were missing)
* added templates `error` and `nav` to list
* module `sections-list`: hide arrow when not on small screen

## 0.12.4 (2015-06-15)

* component `jecoute`: prefill email from cookie
* component `video`: load only if CNIL cookie is set
* module `anchors-list`: changed how anchors share links are rendered (now in `anchors-list` data)
* module `block-content-jecoute`: fixed button positioning
* module `document-heading`: added active state to icons
* module `error-heading` added
* module `notice`: improved rendering on small screens, added a way to render a hidden notice and open it using a JS event
* module `pagination`: fixed bug with negative numbers, simplify on small screens
* module `table-of-contents` added
* module `video-cover`: load only if CNIL cookie is set
* template `document-postit`: removed icons from postit tile
* template `error` added
* template `get-involved`: optional gallery
* template `home`: optional gallery
* template `nav` added (standalone header for mobile, when JS is disabled)
* template `subhome-get-involved`: renamed `news_list` to `news` in data, optional gallery
* template `subhome-news`: optional gallery
* all templates: hide `news-list` module when there are no news
* all templates: put CNIL `notice` as a fixed notice, put cookie logic in `cnil.js`
* reorganized CSS to allow theming (and ability to force a theme using template data)
* added variables for cookies in `config.js`
* various bug fixing after acceptance testing
* various parts of templates are now optional

## 0.12.3 (2015-06-08)

* module `anchors-list`: allow multiline text
* module `block-content-jecoute`: fixed height bug
* module `block-content-newsletter`: added a variation to have a button instead of the form
* module `document-heading`: fixed responsive bug
* module `news-card`: fix tiny CSS border bug
* module `news-list`: pass large item data directly to `news-card`, overriding the modifier
* template `faq`: changed to use arrays for content and aside
* template `hub`: refresh the `news-list` module when navigating in `sections-panel`

## 0.12.2 (2015-06-08)

Fix `package.json`

## 0.12.1 (2015-06-08)

Miscellaneous fixes:
* replaced templatizer url in `package.json` to use HTTPS
* component `faq`: add this component, which is a alias to `accordion`
* module `hub-heading`: optional image
* module `sections-panel`: fix undefined in client-side content rendering
* template `single-person`: set `permanence` and `contact` optional
* template `subhome-news`: switch between `hub-heading` and `jumbotron`, depending on data
* add suffix and default value "Paris.fr" to page title in wrapper_prod

## 0.12.0 (2015-06-02)

Responsive design (more detailed changelog soon)

## 0.11.1 (2015-06-01)

* component `jecoute`: save question implemented
* template `list-persons`: removed specific API, now only using Algolia
* template `list-persons/adjoints`: DRY by reusing `list-persons`
* template `single-person`: `data.aside.picture` now optional
* template `single-person/small-portrait`: DRY by reusing `single-person`
* now exposing the PubSub instance in `Paris.events`
* now exposing the living style guide version in `Paris.version`
* fixed build task to stop exposing absolute paths on Windows

## 0.11.0 (2015-05-19)

* component `jecoute`: replaced title
* module `block-content-social`: added `target` to data
* module `block-content-jecoute`: fix button positioning
* module `block-content-newsletter`: added form handling script
* module `footer`: added links' `target` to data
* module `header`: added links' `target` to data
* module `sections-panel`: `buttons` and `more_links` are now optional in `default` and `content` data
* module `video-cover`: added support for block (useful to add iframes)
* template `list-persons`: use specific API for consultation using pagination
* template `hub`: refresh `hub-heading` background image during navigation in `sections-panel`
* added `Paris.events` as a way to access PubSub
* upgraded Algolia to v3, switched to npm version
* removed `examples` folder from repository
* removed unused AvenirNext webfonts

## 0.10.3 (2015-05-18)

* added `list-persons/adjoints` template with default facet filtering
* added missing `html` component in `components.jade`
* component `table`: fixed documentation
* module `document-heading`: background image is now optional
* module `search-results-list`: renamed `anchors.label` to `anchors.text` for consistency
* module `share`: improved documentation

## 0.10.2 (2015-05-04)

* fix stylesheets paths in wrapper_prod

## 0.10.1 (2015-05-04)

* rename stylesheets build output not to break built templates
* fix browserify error on build with trailing underscore, replaced by lodash.values
* added module `rheader` (responsive header), that will progressively replace the `header` module in all templates

## 0.10.0 (2015-05-03)

* component `image`:
  * now uses responsive images (`srcset`)
  * improved documentation
* component `links`: added example for use without title
* component `place`: renamed (formerly `transportation`)
* component `table`:
  * improved style
  * prepared for responsive
  * improved accessibility by adding caption and summary
* module `anchors-list`:
  * fix bug when clicking a few times quickly
  * fix "rebound" bug when reaching the end of a document
  * fix bug when document height changes (because of `accordion` interaction)
  * replace hash in URL when clicking on an anchor
* module `block-content-jecoute`: improved animations
* module `que-faire`: added ability to set links targets
* module `quick-access`:
  * highlight search field on focus
  * added documentation for video background
  * press Esc to close
  * hide button "Autour de moi" when launching a search
  * `hidden-on-mobile` modifier to hide buttons on mobile
* module `sections-panel`:
  * fix URLs and replace them in address bar when navigating
* template `home`: module `notice` on top is now optional
* template `hub`: refresh modules `hub-heading` and `breadcrumbs` during navigation in `sections-panel`
* template `list-persons`: search with Algolia
* all templates:
  * added ability to set page title in data
  * added notice for deprecated browsers (IE &lt; 9)
* added `bower.json`
* added `CONTRIBUTE.md`
* added Modernizr
* added print stylesheet
* added IE &lt; 9 stylesheet
* optimized JS build
* added favicon, tileicon, touchicon
* updated jQuery to 2.1.4 and use CDN instead of building it in `paris.js`
* now cleans the `/build` directory before building
* changed Algolia key in `config.js`

## 0.9.3 (2015-04-24)

* Use last harpjs version (with up-to-date sass and jade)
* Updated changelog
* Move built `*.tpl.js` to `build/assets/javascript`

## 0.9.2 (2015-04-24)

* Fix `.header` CSS rule conflict with BO
* Fix build task

## 0.9.1 (2015-04-24)

* Fixed build task
* Removed old build files
* Use modified version of templatizer

## 0.9 (2015-04-24)

### New components, modules and templates

* component `postit`
* module `button-top`
* module `intro-text`
* template `document-postit`
* template `get-involved`
* template `hub/content-open`
* template `hub/subnav-open`
* template `municipality`
* template `subhome-news/page2`
* template `subhome-news/tag`

### Changes after feedback from SEO

* module `links-group`: added links to header, added `intro-text`
* module `sections-panel`: added intro texts
* template `subhome-get-involved`: added `intro-text`, data changed
* template `subhome-municipality`: data changed
* template `subhome-news`: data changed

### Changes after feedback from acceptance testing

* component `accordion`: added hover
* component `buttons`: improved margin-top, standardized class names
* component `jecoute`: focus style for forms, added JS behaviour
* component `links`: added external border
* component `news-push`: added link on image, namespaced CSS
* component `text`: fix bug when anchor is after a floating component
* module `anchors-list`: added modifier `anchor-postit`
* module `block-aside-links`: fix padding
* module `block-content-social`: added Dailymotion
* module `breadcrumbs`: improved hover style, added anchor `#breadcrumbs` (used for `sections-list` links)
* module `document-heading`: support for long titles
* module `get-involved`: added image title+credit and modifier, fixed header links and data
* module `get-involved-list`: include modules `intro-text` and `heading`, optimized SVG files
* module `header`: data changed (for all templates)
* module `hub-heading`: new modifier `small` (for `search` template)
* module `links-group`: fix vertical alignment of icon
* module `news-card`: fix margin-bottom
* module `news-card`: fix regression bug
* module `notice`: fix close button padding
* module `pagination`: refactoring
* module `person-block`: fix jade syntax
* module `person-block`: refactoring
* module `quick-access`: added example to documentation, fix border-bottom
* module `search-results-list`: added transition on links
* module `sections-list`: fix more button
* module `sections-panel`: multiple improvements (data changed)
* module `share`: fix condition
* template `document`: data changed
* template `home`: fixed spacings by adding modifiers to blocks
* template `municipality`: fix links color
* template `single-person-small-picture`: moved to `single-person/small-portrait`
* template `subhome-get-involved`: added current state in `header` (data changed)
* template `subhome-news/tag`: use `hub-heading` instead of `jumbotron`
* template `subhome-news`: changed wording
* all templates:
  * module `cross-content`: removed instagram icon
  * added `.components` class to parent element whenever we render components

### Miscellaneous

* Added real links between templates to allow navigation in styleguide
* Added a way to include additional scripts to `wrapper_prod`
* Removed normalize-opentype (unused)
* Added modernizr
* Misc IE11 fixes
* Conditional flexbox with modernizr + fixed flexbox in IE11

## 0.8 (2015-04-07)

### Improved search

* module `search-results-list`:
    * added support for "promoted" results
    * pagination support
* template `search/results` added
    * automatically launch search on page load if search field is not empty
* `config.js`: changed global Algolia index

### Miscellaneous

* module `poll`
    * multiple changes in `data`
    * added second state (after answer)
    * better performance for `canvas` animation, disable it when not in viewport
    * use `background-image` when particles do not work
    * fix `z-index` bug
    * various CSS fixes (title `max-width`, answers `inline-block`)
* module `block-aside-contact`: added rollovers on links and better spacing
* module `anchors-list`: fixed bug shifted progress on click on an anchor
* module `last-update`: new module
* component `jecoute`: changed data format (removed `modifiers`, renamed `text_button` to `button`)
* component `links`: better positioning for icons
* template `document`: added `last-update` module and `jecoute` component at the end
* added `lang` param to `html` tag in `wrapper_prod` layout

## 0.7.1 (2015-04-02)

* fixed compilation errors in some templates

## 0.7 (2015-03-26)

### Improved search modules and template

* module `quick-access`: added options for easier Algolia configuration
* module `search-field`: added documentation in `script.js`
* module `search-results-list`:
    * data: `result` is renamed `title`
* template `search`:
    * renamed (formerly `search-results`)
    * added options for easier Algolia configuration, translate facet names
* `locales.js`: added facet names translations
* `config.js`: better documentation, you can now define multiple Algolia indexes

### Modularized the `home` template with `blocks`

The data model of the `home` template is now based on an array of `blocks` that are Jade mixins defined in `src/templates/home/blocks/`

The template has been modified in order to loop on this array and call the mixins.

### Miscellaneous

* module `quick-access`: now supports video background
    * added an example in documentation
    * data: `background` is now a object with an `image` and/or `video` parameters
    * in examples, "around me" button now opens meslieux.paris.fr in a new window
* module `button`: now accepts a `target` option to specify link target
* module `news-card`: added examples with long values and `large` modifier, fixed hover bugs, improved social-counters animation
* module `document-heading`: background image is now centered vertically
* module `jumbotron`: works with a light background, added a test example to the documentation
* module `anchors-list`: added rollovers
* component `accordion`: now supports basic HTML content, better rendering, improved documentation with better examples
* component `buttons`: can be used for adding a single button (without a title)
* component `text`: removed inline .button from templates and documentation, use a buttons component instead
* component `html`: this new component can be used to insert unfiltered HTML content
* lib `i18n.js`: catch errors when a key does not exist
