// BS3 et Velocity attendent un `jQuery` global sur `window`
window.jQuery = window.$ = require('jquery');

// load externals
require('./externals/bootstrap');

// load our librairies
require('./lib/i18n');
require('./lib/scroll');

// load our components
require('../components/accordion/script');
require('../components/news-push/script');

// load our layouts
require('../layouts/left-col/script');

// load our modules
require('../modules/anchors-list/script');
require('../modules/document-heading/script');
require('../modules/gallery-ugc/script');
require('../modules/header/script');
require('../modules/jecoute/script');
require('../modules/notice/script');
require('../modules/quick-access/script');
require('../modules/sections-panel/script');
require('../modules/share/script');

// load our templates
require('../templates/search-results/script');
