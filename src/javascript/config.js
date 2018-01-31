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
      "persons": "recette_Elus",
      "equipments": "Service_recette",
    },
    "main_facets": ["Bibliothèques", "Mairies d'arrondissement", "Principaux parcs, jardins et squares", "Piscines", "Tennis"],
    "main_facets_icon": [
      {
        facet: "Piscines",
        icon: "swimming-pool"
      },
      {
        facet: "Bibliothèques",
        icon: "library"
      },
      {
        facet: "Médiathèques et ludothèques",
        icon: "library"
      },
      {
        facet: "Principaux parcs, jardins et squares",
        icon: "park"
      },
      {
        facet: "Jardins, mails, promenades",
        icon: "park"
      },
      {
        facet: "Squares",
        icon: "park"
      },
      {
        facet: "Marchés alimentaires et spécialisés",
        icon: "market"
      },
      {
        facet: "Marchés spécialisés",
        icon: "market"
      },
      {
        facet: "Ateliers Beaux-Arts",
        icon: "art-workshop"
      },
      {
        facet: "Centres Paris Anim",
        icon: "animation"
      },
      {
        facet: "Conservatoires municipaux",
        icon: "conservatoire"
      },
      {
        facet: "Mairies d'arrondissement",
        icon: "city-hall"
      },
      {
        facet: "Hôtel de Ville",
        icon: "city-hall"
      },
      {
        facet: "Maisons des associations",
        icon: "associations"
      },
      {
        facet: "Point Paris Emploi",
        icon: "jobs"
      },
      {
        facet: "Musées municipaux",
        icon: "museum"
      },
      {
        facet: "Tennis",
        icon: "tennis"
      },
      {
        facet: "Théàtres de la Ville et établissements soutenus",
        icon: "culture"
      },
      {
        facet: "Théàtres pour enfants",
        icon: "culture"
      }
    ],
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
  "leaflet": {
    "accessToken": "pk.eyJ1IjoicGFyaXNudW1lcmlxdWUiLCJhIjoiY2loZG1vMnYyMDAzNnY0a3FvNG1nNG55biJ9.MP1qcHkEecFGqSTs9gg7cw",
    "defaultCenter": {"lat": 48.856578, "lon": 2.351828},
    "minZoom": 11,
    "maxBounds": [[48.9328056,2.4806104], [48.7645268,2.1119488]],
    "tileLayer": "http://filer.paris.fr/leaflet/paris2/{z}/{x}/{y}.png",
    "tileLayerAttribution": "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
  },
  "search": {
    "paris_coordinates" : {
      "lat": 48.856579,
      "lng": 2.349272
    }
  }
};
