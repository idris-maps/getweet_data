var scale = require('d3-scale')
var ig = require('idris-geojson')
var intersect = require('turf-intersect')

var latScale = scale.linear()
	.domain([46.113,46.438])
	.range([1,11])
var lngScale = scale.linear()
	.domain([5.925,6.324])
	.range([1,11])
var yScale = scale.linear()
	.domain([1, 11])
	.range([46.113,46.438])
var xScale = scale.linear()
	.domain([1, 11])
	.range([5.925,6.324])

exports.pos = function(positions, callback) {
	loopPos(0, positions, [], function(f) {
		callback(f)
	})
}

exports.create = function(callback) {
	createSquareGrid(function(c) { callback(c)})
}

exports.hex = function(hexgrid, squaregrid, callback) {
	var hexgridFeatures = hexgrid.features
	var squareFeatures = squaregrid.features
	loopHex(0, hexgridFeatures, squareFeatures, [], function(r) {
		callback(r)
	})
}

function loopHex(count, feats, squares, r, callback) {
	var index = count
	count = count + 1
	var total = feats.length
	if(count === total + 1) {
		callback(r)
	} else {
		var f = feats[index]
		for(i=0;i<squares.length;i++) {
			var sq = squares[i]
			var int = intersect(sq,f)
			if(int !== undefined && int !== null) {
				r.push({hexId: f.properties.hexId, x: sq.properties.x, y: sq.properties.y})
			}
		}
		if(count / 100 === Math.round(count/100)) { 
			console.log('created ' + count + ' of ' + total + ' relations between squares and hex') 
		}
		loopHex(count, feats, squares, r, callback)
	}
}

function createSquareGrid(callback) {
	var xs = []
	var ys = []
	for(i=0;i<10;i++) {
		var i1 = i + 1
		var i2 = i + 2
		xs.push({id: i1, minLng: xScale(i1), maxLng: xScale(i2)})
		ys.push({id: letter(i1), minLat: yScale(i1), maxLat: yScale(i2)})
	}
	var squareFeatures = []
	for(i=0;i<xs.length;i++) {
		var x = xs[i]
		for(j=0;j<ys.length;j++) {
			var y = ys[j]
			var bbox = [[x.minLng, y.minLat],[x.maxLng, y.maxLat]]
			ig.featFromBbox(bbox, function(feat) {
				feat.properties = {}
				feat.properties.x = x.id
				feat.properties.y = y.id
				squareFeatures.push(feat)
			})
		}
	}
	var col = {type:'FeatureCollection', features: squareFeatures}
	callback(col)
}

function loopPos(count, positions, final, callback) {
	var  index = count
	var total = positions.length
	count = count + 1
	if(count === total + 1) {
		callback(final)
	} else {
		var d = positions[index]
		var id = d.id
		var c = d.geo.coordinates
		var lat = c[0]
		var lng = c[1]
		var x = getX(lng)
		var y = getY(lat)
		if(x !== undefined && y !== undefined) {
			final.push({_id: d._id, lat: lat, lng: lng, x: x, y: y})
		}
		setTimeout(function() {
			if(count / 1000 === Math.floor(count/1000)) {
				console.log('created ' + count + ' of ' + total + ' relations between tweet and squares')
			}
			loopPos(count, positions, final, callback)
		},0)
	}
}


function getX(lng) {
	var x = lngScale(lng)
	var xx = Math.floor(x)
	if(between1and10(xx) === true) { return xx }
	else { return undefined }
}

function getY(lat) {
	var y = latScale(lat)
	var yy = Math.floor(y)
	var yyy = letter(yy)
	return yyy
}

function letter(n) {
	if(n === 1) { return 'a' }
	else if(n === 2) { return 'b' }
	else if(n === 3) { return 'c' }
	else if(n === 4) { return 'd' }
	else if(n === 5) { return 'e' }
	else if(n === 6) { return 'f' }
	else if(n === 7) { return 'g' }
	else if(n === 8) { return 'h' }
	else if(n === 9) { return 'i' }
	else if(n === 10) { return 'j' }
	else { return undefined }
}

function between1and10(n) {
	if(n === 1) { return true }
	else if(n === 2) { return true }
	else if(n === 3) { return true }
	else if(n === 4) { return true }
	else if(n === 5) { return true }
	else if(n === 6) { return true }
	else if(n === 7) { return true }
	else if(n === 8) { return true }
	else if(n === 9) { return true }
	else if(n === 10) { return true }
	else { return false }
}
