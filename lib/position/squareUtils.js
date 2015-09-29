var scale = require('d3-scale')
var ig = require('idris-geojson')
var bbox = require('../bbox')
var width = 50
var height = 50

module.exports = function(callback) {
	getScalesAndSquares(bbox, width, height, function(pointToSquare, hexToSquares, squares) {
		callback(pointToSquare, hexToSquares, squares)
	})
}

function getScalesAndSquares(bbox, width, height, callback) {
	createScales(bbox, width, height, function(scaleLngToX, scaleLatToY, scaleXtoLng, scaleYtoLat) {
		var squares = {type: 'FeatureCollection', features:[] }
		for(i=1;i<width + 1;i++) {
			for(j=1;j<height + 1;j++) {
				var bbx = getBbox(i,j)
				var bb = [[bbx[0],bbx[1]],[bbx[2],bbx[3]]]
				ig.featFromBbox(bb, function(f) {
					f.properties = {x: i, y: j, posFeatures: [], hexFeatures: []}
					squares.features.push(f)
				})
			}
		}

		function lngToX(lng) { return Math.floor(scaleLngToX(lng))}
		function latToY(lat) { return Math.floor(scaleLatToY(lat))}
		function pointToSquare(coords) {
			var lng = coords[0]
			var lat = coords[1]
			return {x: lngToX(lng), y: latToY(lat)}
		}
		function hexToSquares(hexcoords) {
			var multicoords = hexcoords[0]
			var squares = []
			for(i=0;i<multicoords.length;i++) {
				var coords = multicoords[i]
				squares.push(pointToSquare(coords))
			}
			var uniqSquares = getUniq(squares)
			return uniqSquares
		}
		function getBbox(x, y) {
			var x1 = scaleXtoLng(x)
			var x2 = scaleXtoLng(x + 1)
			var y1 = scaleYtoLat(y)
			var y2 = scaleYtoLat(y + 1)
			return [x1, y1, x2, y2]
		}

		callback(pointToSquare, hexToSquares, squares)
	})
}

function getUniq(arr) {
	var newArr = []
	for(i=0;i<arr.length;i++) {
		var exist = false
		for(j=0;j<newArr.length;j++) {
			if(arr[i].x === newArr[j].x && arr[i].y === newArr[j].y) {
				exist = true
				break
			}
		}
		if(exist === false) { newArr.push(arr[i]) }
	}
	return newArr
}

function createScales(bbox, width, height, callback) {
	var scaleLngToX = scale.linear()
		.domain([bbox[0], bbox[2]])
		.range([1, width + 1])
	var scaleLatToY = scale.linear()
		.domain([bbox[1], bbox[3]])
		.range([1, height + 1])
	var scaleXtoLng = scale.linear()
		.domain([1, width + 1])
		.range([bbox[0], bbox[2]])
	var scaleYtoLat = scale.linear()
		.domain([1, height + 1])
		.range([bbox[1], bbox[3]])

	callback(scaleLngToX, scaleLatToY, scaleXtoLng, scaleYtoLat)
}

