'use strict';

var instantsearch = require('instantsearch.js');
var mapboxgl = require('mapbox-gl'),
	$ = require('jquery');

/**
 * Instantsearch Mapbox widget
 */

var map,
	settings,
	geoJSON = {
		"type": "FeatureCollection",
		"features": []
	};

/**
 * Widget options
 * @param {Object} mapbox Mapbox API options. See Mapbox documentation for more details.
 * @param {Object} cluster Cluster options.
 * @param {Bool} cluster.cluster Enable cluster.
 * @param {Int} cluster.clusterMaxZoom The maximum zoom level to cluster points in.
 * @param {Int} cluster.clusterRadius The radius of each cluster when clustering points, measured in pixels.
 * @param {Color} cluster.circleColor The color of the circle.
 * @param {Int} cluster.circleRadius Circle radius.
 */
var defaults = {
	mapBoxAccessToken: "YOUR-ACCESS-TOKEN",
	mapbox: {},
	cluster: {
		cluster: true,
		clusterMaxZoom: 14,
		clusterRadius: 50, 
		circleColor: "#ffd8c7",
		circleRadius: 15
	}
};


// instantsearch.js custom widget with plain JavaScript
// First, we add ourselves to the instantsearch.widgets namespace
instantsearch.widgets.mapbox = function mapbox(options) {
	
	return {
		init: function(params) {
			initOptions(options);
			initMap(options.container);
		},
		render: function(params) {

			geoJSON = hitsToGeoJSON(params.results.hits);

			if (map.getSource("searchHits")) {
				map.getSource("searchHits").setData(geoJSON);
			}
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
		throw "You need to pass your Mapbox access token";
	}
	mapboxgl.accessToken = accessToken;
	settings.mapbox.container = document.querySelector(container).getAttribute('id');

	map = new mapboxgl.Map(settings.mapbox);

	//Add map navigation and geolocate controls
	map.addControl(new mapboxgl.Navigation());
	map.addControl(new mapboxgl.Geolocate());

	map.on('load', function () {
		renderMap(geoJSON, "searchHits");
	});
}


/**
 * Display pin on the map based on given geoJSON
 * @param  {geoJSON Object} Data of points to display on the map
 * @param  {String} Source id for mapbox
 */
function renderMap(geoJSON, sourceID) {

	var clusterID = "cluster-"+sourceID;
	var clusterCountID = "cluster-count-"+sourceID;

	// Create markers
	map.addSource(sourceID, {
		type: "geojson",
		data: geoJSON,
		cluster: settings.cluster.cluster,
		clusterMaxZoom: settings.cluster.clusterMaxZoom,
		clusterRadius: settings.cluster.clusterRadius
	});

	// Add layer for unclestered points
	map.addLayer({
		id: sourceID,
		type: "symbol",
		source: sourceID,
		layout: {
			"icon-image": "marker-15"
		}
	});

	// Add a layer for the clusters circles
	map.addLayer({
		id: clusterID,
		type: "circle",
		source: sourceID,
		paint: {
			"circle-color": settings.cluster.circleColor,
			"circle-radius": settings.cluster.circleRadius
		},
		filter: [">", "point_count", 1]
	});

	// Add a layer for the clusters' count labels
	map.addLayer({
		id: clusterCountID,
		type: "symbol",
		source: sourceID,
		paint: {
			"text-color": "#fff"
		},
		layout: {
			"text-field": "{point_count}",
			"text-font": [
				"DIN Offc Pro Medium",
				"Arial Unicode MS Bold"
			],
			"text-size": 12
		},
		filter: [">", "point_count", 1]
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
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [hit._geoloc.lng, hit._geoloc.lat]
			},
			properties: {
				title: hit.name,
				address: hit.address
			}
		}
		features.push(feature);
	});

	geoJSON.features = features;

	return geoJSON;
}