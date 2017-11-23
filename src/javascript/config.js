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
      "equipments": "Service_production",
      "dev_mes_lieux": "dev_MesLieux",
    },
    "main_facets": ["Bibliothèques municipales de prêt et spécialisées", "Mairies d'arrondissement", "Principaux parcs, jardins et squares", "Piscines municipales", "Tennis"],
    "main_facets_icon": [
      {
        facet: "Piscines municipales",
        icon: "swimming-pool"
      },
      {
        facet: "Piscines concédées",
        icon: "swimming-pool"
      },
      {
        facet: "Bibliothèques municipales de prêt et spécialisées",
        icon: "library"
      },
      {
        facet: "Bibliothèques municipales spécialisées",
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
        "linked_filter": "Bibliothèques",
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
    "accessToken": "pk.eyJ1IjoicGFyaXNudW1lcmlxdWUiLCJhIjoiY2loZG1vMnYyMDAzNnY0a3FvNG1nNG55biJ9.MP1qcHkEecFGqSTs9gg7cw",
    "defaultCenter": {"lat": 48.856578, "lon": 2.351828},
    "defaultBounds": [[48.902157, 2.46976], [48.815575, 2.224122]],
    "styleLayer": "mapbox://styles/parisnumerique/cis1rkqoj000khinpthppoaqd"
  },
  "search": {
    "paris_coordinates" : {
      "lat": 48.856579,
      "lng": 2.349272
    }
  }
};
