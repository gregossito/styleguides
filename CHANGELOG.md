# Changelog

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
* lib `i18n:js`: catch errors when a key does not exist