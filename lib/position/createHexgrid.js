var hexgrid = require('turf-hex-grid')
var bbox = require('../bbox')

module.exports = function(callback) {
	var cellWidth = 0.5
	var units = 'kilometers'
	var grid = hexgrid(bbox, cellWidth, units)
	addHexId(grid, function(c) {
		callback(c)
	})
}

function addHexId(col, callback) {
	var fs = col.features
	for(i=0;i<fs.length;i++) {
		fs[i].properties = {}
		fs[i].properties.hexId = i
	}
	var c = {type:'FeatureCollection', features: fs}
	callback(c)
}
