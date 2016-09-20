var Paris = window.Paris || {};

Paris.config = {
  "algolia": {
    // The Algolia application ID
    "id": "QGS0I5WCQR",

    // This API key should be created on Algolia, and have `search` permission on all the indexes below
    "api_key": "219f93ef781ffa09cdb6803f702cf6f1",
    // TODO Remove after debug ?
    "dev_mes_lieux_api_key": "850ba3330a69483fb4d56287a9e5eb06",

    // You can add any Algolia index here, to be able to use it in the quick-access module and search-results template
    "indexes": {
      "global": "recette_ParisFront",
      "persons": "recette_Elus",
      "equipments": "Eqpt",
      "dev_mes_lieux": "dev_MesLieux"
    },
    "main_facets": ["Piscines", "Bibliothèques", "Parcs et jardins", "Marchés", "Ateliers Beaux-Arts", "Centres d’animation", "Conservatoires", "Mairies", "Maisons des assos", "Maisons entreprises et emploi", "Musées municipaux", "Tennis"],
    "secondary_filters": [
      {
        "title": "Ouverture",
        "type": "checkbox",
        "id": "is_open",
        "label": "Ouvert maintenant"
      },
      {
        "title": "Accessibilité",
        "type": "select",
        "id": "accessibility",
        "values": [
          {
            "id": "all",
            "label": "Sans préférence"
          },
          {
            "id": "accessible aux personnes à mobilité réduite",
            "label": "Handicap moteur"
          },
          {
            "id": "accessible aux non-voyants et malvoyants",
            "label": "Handicap visuel"
          },
          {
            "id": "accessible aux sourds et malentendants",
            "label": "Handicap auditif"
          }
        ]
      },
      {
        "title": "Taille du bassin",
        "type": "select",
        "id": "pool_length",
        "linked_filter": "Piscines",
        "values": [
          {
            "id": "all",
            "label": "Sans préférence"
          },
          {
            "id": "25m",
            "label": "25 m"
          },
          {
            "id": "33m",
            "label": "33 m"
          },
          {
            "id": "50m",
            "label": "50 m"
          }
        ]
      },
      {
        "title": "Section",
        "type": "select",
        "id": "sections",
        "linked_filter": "Bibliothèques universitaires",
        "values": [
          {
            "id": "all",
            "label": "Tous"
          },
          {
            "id": "adulte",
            "label": "Adulte"
          },
          {
            "id": "bibliothèque spécialisée",
            "label": "Bibliothèques spécialisées"
          },
          {
            "id": "discothèque",
            "label": "Discothèques"
          },
          {
            "id": "jeunesse",
            "label": "Jeunesse"
          },
          {
            "id": "vidéothèque",
            "label": "Vidéothèques"
          }
        ]
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
  "mapbox": {
    "access_token": "pk.eyJ1IjoicGFyaXNudW1lcmlxdWUiLCJhIjoiY2loZG1vMnYyMDAzNnY0a3FvNG1nNG55biJ9.MP1qcHkEecFGqSTs9gg7cw"
  },
  "search": {
    "paris_coordinates" : {
      "lat": 48.856579,
      "lng": 2.349272
    }
  }
};
