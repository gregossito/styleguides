// load externals
require('./externals/bootstrap');

// load our librairies
require('./lib/events');
require('./lib/i18n');
// require('./lib/instantsearchmapbox');
require('./lib/instantsearchleaflet');
// require('./lib/instantsearchrefinementlist');
require('./lib/instantsearchresetbutton');
require('./lib/requestanimationframe');
require('./lib/responsive');
require('./lib/scroll');
require('./lib/url');

// load our components
require('../components/accordion/script');
require('../components/buttons/script');
require('../components/districts/script');
require('../components/expandable/script');
require('../components/form/script');
require('../components/gallery/script');
require('../components/html/script');
require('../components/jecoute/script');
require('../components/map/script');
require('../components/news-push/script');
require('../components/pills/script');
require('../components/video/script');

// load our layouts
require('../layouts/left-col/script');

// load our modules
require('../modules/agenda/script');
require('../modules/anchors-list/script');
require('../modules/block-content-jecoute/script');
require('../modules/block-content-tweet/script');
require('../modules/block-content-newsletter/script');
require('../modules/button-top/script');
require('../modules/gallery-ugc/script');
require('../modules/icon-switch/script');
require('../modules/image-full/script');
require('../modules/jumbotron-slider/script');
// require('../modules/news-list/script');
require('../modules/notice/script');
require('../modules/person-block/script');
require('../modules/poll/script');
require('../modules/quick-access/script');
require('../modules/rheader/script');
require('../modules/search-modal/script');
require('../modules/sections-panel/script');
require('../modules/share/script');
require('../modules/treize-list/script');
require('../modules/video-cover/script');
require('../modules/video-home/script');
require('../modules/video-home-news/script');

// load our templates
require('../templates/document/script');
require('../templates/hub/script');
require('../templates/list-equipments/script');
require('../templates/list-persons/script');
require('../templates/search/script');

// additional scripts
require('./lib/cnil');
require('./lib/egg');
require('./lib/3975');

var Paris = window.Paris || {};
Paris.version = "1.15.9";
Paris.templates = require('./client.tpl');
