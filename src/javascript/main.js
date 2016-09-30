// load externals
require('./externals/bootstrap');

// load our librairies
require('./lib/events');
require('./lib/i18n');
require('./lib/requestanimationframe');
require('./lib/responsive');
require('./lib/scroll');
require('./lib/url');

// load our components
require('../components/accordion/script');
require('../components/districts/script');
require('../components/form/script');
require('../components/gallery/script');
require('../components/html/script');
require('../components/jecoute/script');
require('../components/news-push/script');
require('../components/video/script');

// load our layouts
require('../layouts/left-col/script');

// load our modules
require('../modules/anchors-list/script');
require('../modules/block-content-jecoute/script');
require('../modules/block-content-tweet/script');
require('../modules/block-content-newsletter/script');
require('../modules/button-top/script');
require('../modules/gallery-ugc/script');
require('../modules/icon-switch/script');
require('../modules/notice/script');
require('../modules/person-block/script');
require('../modules/poll/script');
require('../modules/quick-access/script');
require('../modules/rheader/script');
require('../modules/sections-panel/script');
require('../modules/share/script');
require('../modules/video-cover/script');
require('../modules/video-home/script');

// load our templates
require('../templates/document/script');
require('../templates/hub/script');
require('../templates/list-persons/script');
require('../templates/search/script');

// additional scripts
require('./lib/cnil');
require('./lib/egg');
require('./lib/3975');

var Paris = window.Paris || {};
Paris.version = "1.5.0";
Paris.templates = require('./client.tpl');
