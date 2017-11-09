var Paris = window.Paris || {};

Paris.config = {
  "algolia": {
    // The Algolia application ID
    "id": "QGS0I5WCQR",

    // This API key should be created on Algolia, and have `search` permission on all the indexes below
    "api_key": "219f93ef781ffa09cdb6803f702cf6f1",

    // You can add any Algolia index here, to be able to use it in the quick-access module and search-results template
    "indexes": {
      "global": "recette_ParisFront",
      "persons": "recette_Elus"
    },

    "url": {
      "api_popular_searches": "http://r7.paris-fr-api.lestudio.mx/AlgoliaStats/getMostSearchedKeywords"
    }
  },
  "cookies": {
    "email": {
      "name": "email"
    },
    "cnil": {
      "name": "cookies",
      "value": "accepted",
      // `expires` can be a Number which will be interpreted as days from time of creation or a Date instance
      "expires": 395 // 13 months
    },
    "parisconnect": {
      "name": "pcuid"
    },
    "publicdata": {
      "name": "publicdata"
    },
    "le3975": {
      "host": "CTK_HOST-COOKIE",
      "wssoId": "CTK_AGENTID-COOKIE"
    }
  },
  "captcha": {
    "key": "6Lf2DQoTAAAAAKmk3wEFCZuK3FqG00SlQM3o6Yvp"
  },
  "mapbox": {
    "accessToken": "pk.eyJ1IjoicGFyaXNudW1lcmlxdWUiLCJhIjoiY2loZG1vMnYyMDAzNnY0a3FvNG1nNG55biJ9.MP1qcHkEecFGqSTs9gg7cw",
    "defaultCenter": {"lat": 48.856578, "lon": 2.351828},
    "defaultBounds": [[48.902157, 2.46976], [48.815575, 2.224122]],
    "styleLayer": "mapbox://styles/parisnumerique/cis1rkqoj000khinpthppoaqd"
  }
};
