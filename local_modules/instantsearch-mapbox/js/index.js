'use strict';

var instantsearch = require('instantsearch.js');
var mapboxgl = require('mapbox-gl'),
	$ = require('jquery');

/**
 * Instantsearch Mapbox widget
 */

var map,
	settings,
	helper,
	layersID = [],
	geoJSON = {
		'type': 'FeatureCollection',
		'features': []
	};

/**
 * Widget options
 * @param {Object} mapbox Mapbox API options. See Mapbox documentation for more details.
 * @param {Object} cluster Cluster options.
 * @param {Bool} cluster.cluster Enable cluster.
 * @param {Int} cluster.clusterMaxZoom The maximum zoom level to cluster points in.
 * @param {Int} cluster.clusterRadius The radius of each cluster when clustering points, measured in pixels.
 * @param {String} tempaltes.markerIconImage The marker string of the mapbox style.
 * @param {Color} templates.cluster.circleColor The color of the circle.
 * @param {Int} templates.cluster.circleRadiusStops Stops of circle radius.
 * @param {Int} templates.cluster.circleRadiusBase Base for stops.
 * @param {[String]} templates.cluster.textFont Array of font for cluster text
 * @param {String} templates.cluster.textColor Color of text for cluster
 * @param {Int} templates.cluster.textSize Size of text for cluster
 */
var defaults = {
	mapBoxAccessToken: 'YOUR-ACCESS-TOKEN',
	mapbox: {},
	cluster: {
		cluster: true,
		clusterMaxZoom: 14,
		clusterRadius: 50
	},
	templates: {
		markerIconImage: 'marker',
		cluster: {
			textFont: [
				'DIN Offc Pro Medium',
				'Arial Unicode MS Bold'
			],
			textColor: '#fff',
			textSize: 12,
			circleColor: '#000',
			circleRadiusStops: [
				[1, 15],
				[100, 35],
			],
			circleRadiusBase: 0.95
		}
	}
};


// instantsearch.js custom widget with plain JavaScript
// First, we add ourselves to the instantsearch.widgets namespace
instantsearch.widgets.mapbox = function mapbox(options) {
	
	return {
		// getConfiguration: function(configuration) {
		// 	return {
		// 		hitsPerPage : 100
		// 	}
		// },
		init: function(params) {
			helper = params.helper;
			initOptions(options);
			initMap(options.container);
		},
		render: function(params) {

			geoJSON = hitsToGeoJSON(params.results.hits);

			renderMap(geoJSON, 'searchHits');
		}
	}
}


/**
 * @param  {Object} Options passed by user
 */
function initOptions(options) {
	settings = $.extend(true, {}, defaults, options );
}


/**
 * Init Mapbox into container
 * @param  {String | DOM Element}
 */
function initMap(container) {

	// Get Mapbox user access token
	var accessToken = settings.mapBoxAccessToken;
	if (accessToken == defaults.mapBoxAccessToken) {
		throw 'You need to pass your Mapbox access token';
	}
	mapboxgl.accessToken = accessToken;
	settings.mapbox.container = document.querySelector(container).getAttribute('id');

	map = new mapboxgl.Map(settings.mapbox);

	//Add map navigation and geolocate controls
	map.addControl(new mapboxgl.Navigation());
	map.addControl(new mapboxgl.Geolocate());

	map.on('load', function () {
		renderMap(geoJSON, 'searchHits');
	});

	// When a click event occurs near a place, open a popup at the location of
	// the feature, with description HTML from its properties.
	map.on('click', function (e) {

		var features = map.queryRenderedFeatures(e.point, { layers: layersID });

		if (!features.length) {
			return;
		}

		var feature = features[0];
		// Populate the popup and set its coordinates
		// based on the feature found.
		var popup = new mapboxgl.Popup()
			.setLngLat(feature.geometry.coordinates)
			// TODO Evolution - Dynamically set html content from widget 
			.setHTML('<div class="card-content"><h3 class="card-title">'+feature.properties.title+'</h3><div class="card-text">'+feature.properties.address+'</div><div class="card-hours open">Ouvert jusqu’à 21h</div></div>')
			.addTo(map);
	});

	// Trigger search based on map bounds when user moves
	map.on('moveend', function (e) {
		var bounds = map.getBounds();
		helper
			.setQueryParameter('insideBoundingBox', bounds._sw.lat+','+bounds._sw.lng+','+bounds._ne.lat+','+bounds._ne.lng)
			.search()
			// Clear geoloc param right after launching request
			.setQueryParameter('insideBoundingBox', undefined);
	});
}


/**
 * Display pin on the map based on given geoJSON
 * @param  {geoJSON Object} Data of points to display on the map
 * @param  {String} Source id for mapbox
 */
function renderMap(geoJSON, sourceID) {

	var clusterCountID = 'cluster-count-'+sourceID;

	var mapSource = map.getSource(sourceID);
	if (!mapSource) {

		// Add source
		map.addSource(sourceID, {
			type: 'geojson',
			data: geoJSON,
			cluster: settings.cluster.cluster,
			clusterMaxZoom: settings.cluster.clusterMaxZoom,
			clusterRadius: settings.cluster.clusterRadius
		});

		// Circle for clustering with dynamic radius
		map.addLayer({
			id: 'cluster-circle',
			type: 'circle',
			source: sourceID,
			paint: {
				'circle-color': settings.templates.cluster.circleColor,
				'circle-radius': {
					property: 'point_count',
					base: settings.templates.cluster.circleRadiusBase,
					stops: settings.templates.cluster.circleRadiusStops
				}
			},
			filter: ['>', 'point_count', 1]
		});

		// Add a layer for the clusters' count labels
		map.addLayer({
			id: clusterCountID,
			type: 'symbol',
			source: sourceID,
			paint: {
				'text-color': settings.templates.cluster.textColor
			},
			layout: {
				'text-field': '{point_count}',
				'text-font': settings.templates.cluster.textFont,
				'text-size': settings.templates.cluster.textSize
			},
			filter: ['>', 'point_count', 1]
		});
	} else {
		mapSource.setData(geoJSON);
	}


	geoJSON.features.forEach(function(feature) {
		var symbol = feature.properties.icon;
		var layerID = 'marker-' + symbol;

		// Add a layer for this symbol type if it hasn't been added already.
		if (!map.getLayer(layerID)) {
			// Add layer for unclestered points
			map.addLayer({
				id: layerID,
				type: 'symbol',
				source: sourceID,
				layout: {
					'icon-image': 'marker-'+symbol
				},
				filter: ["==", "icon", symbol]
			});
			layersID.push(layerID);
		}
	});
}

/**
 * Helper method to create a geoJSON format object based on instantsearch hits
 * @param  {Object} Instantsearch hits
 * @return {[geoJSON]} geoJSON formated object
 */
function hitsToGeoJSON(hits) {

	// Abort when no hits
	if (!hits || (hits && hits.length == 0)) {
		return geoJSON;
	}

	var features = [];
	// For each hits return by instantsearch create its geoJson object
	hits.forEach(function(hit) {
		var feature = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [hit._geoloc.lng, hit._geoloc.lat]
			},
			properties: {
				title: hit.name,
				address: hit.address,
				// TODO Activate dynamic icons
				// icon: hit.idcategories[0]
				icon: 15
			}
		}
		features.push(feature);
	});

	geoJSON.features = features;

	return geoJSON;
}