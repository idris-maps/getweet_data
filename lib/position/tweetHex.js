var _ = require('underscore')
var intersect = require('turf-intersect')
exports.addHexAndPosToSquare = function(hexSquareRels, positionsSquareRels, hexCol, callback) {
	uniqSquare(hexSquareRels, function(uniq) {
		addHexes(hexSquareRels, hexCol.features, uniq, function(withHexFeatures) {
			addTweets(positionsSquareRels, withHexFeatures, function(withPosFeatures) {
				callback(withPosFeatures)
			})
		})
	})
}

exports.rels = function(squares, callback) {
	loopSquares(0, squares, [], function(r) {
		callback(r)
	})
}


function loopSquares(count, squares, rels, callback) {
	var index = count
	count = count + 1
	var total = squares.length
	if(count === total + 1) {
		callback(rels)
	} else {
		var sq = squares[index]
		var hexFeats = sq.hexFeatures
		var posFeats = sq.posFeatures
		getRels(hexFeats, posFeats, function(resp) {
			for(i=0;i<resp.length;i++) {
				rels.push(resp[i])
			}
			setTimeout(function() {
				console.log('found relations between tweets and hex in ' + count + ' of ' + total + ' squares')
				loopSquares(count, squares, rels, callback)
			},0)
		})
	}
}

function getRels(hexFeats, posFeats, callback) {
	posFeatLoop(0, posFeats, hexFeats, [], function(resp) {
		callback(resp)
	})
}

function posFeatLoop(count, posFeats, hexFeats, r, callback) {
	var index = count
	count = count + 1
	var total = posFeats.length
	if(count === total + 1) {
		callback(r)
	} else {
		var posFeat = posFeats[index]
		hexFeatLoop(0, posFeat, hexFeats, function(hexId) {
			setTimeout(function() {
				if(hexId !== null) {
					r.push({_id: posFeat.properties._id, hexId: hexId})
					posFeatLoop(count, posFeats, hexFeats, r, callback)
				} else {
					posFeatLoop(count, posFeats, hexFeats, r, callback)
				}
			},0)
		})
	}
}

function hexFeatLoop(count, posFeat, hexFeats, callback) {
	var index = count
	count = count + 1
	var total = hexFeats.length
	if(count === total) {
		callback(null)
	} else {
		var hexFeat = hexFeats[index]
		var int = intersect(posFeat, hexFeat)
		if(int !== undefined && int == null) {
			callback(hexFeat.properties.hexId)
		} else {
			hexFeatLoop(count, posFeat, hexFeats, callback)
		}
	}
}


function addTweets(rels, uniq, callback) {
	loopSwithT(0, rels, uniq, function(r) {
		callback(r)
	})
}

function addHexes(rels, hexFeats, uniq, callback) {
	loopSwithH(0, rels, hexFeats, uniq, function(r) {
		callback(r)
	})
}

function uniqSquare(rels, callback) {
	var arr = []
	for(i=0;i<rels.length;i++) {
		var r = rels[i]
		arr.push({name: r.y + r.x, x: r.x, y: r.y, hexFeatures: [], posFeatures: []})
	}
	var uniq = _.uniq(arr)
	callback(uniq)
}

function loopSwithT(count, rels, uniq, callback) {
	var index = count
	var total = rels.length
	count = count + 1
	if(count === total + 1) {
		callback(uniq)
	} else {
		var rel = rels[index]
		var feat = createPosFeatFromId(rel)
		addPosToUniqFeatures(rel, feat, uniq, function(u) {
			setTimeout(function() {
				if(count / 1000 === Math.floor(count/1000)) {
					console.log('added ' + count + ' of ' + total + ' tweets to squares')
				}
				loopSwithT(count, rels, u, callback)
			},0)
		})
	}
}

function addPosToUniqFeatures(rel, feat, uniq, callback) {
	var sqName = rel.y + rel.x
	for(i=0;i<uniq.length;i++) {
		if(uniq[i].name === sqName) {
			uniq[i].posFeatures.push(feat)
			break
		}
	}
	callback(uniq)
}

function createPosFeatFromId(rel) {
	var f = {
		type: 'Feature',
		properties: {_id: rel._id},
		geometry: {type: 'Point', coordinates: [rel.lng, rel.lat]}
	}
	return f
}

function loopSwithH(count, rels, hexFeats, uniq, callback) {
	var index = count
	var total = rels.length
	count = count + 1
	if(count === total + 1) {
		callback(uniq)
	} else {
		var rel = rels[index]
		var hexId = rel.hexId
		var feat = findHexFromId(hexId, hexFeats)
		addToUniqFeatures(rel, feat, uniq, function(u) {
			setTimeout(function() {
				if(count / 1000 === Math.floor(count/1000)) {
					console.log('added ' + count + ' of ' + total + ' hexes to square')
				}
				loopSwithH(count, rels, hexFeats, u, callback)
			},0)
		})
	}
}

function addToUniqFeatures(rel, feat, uniq, callback) {
	var sqName = rel.y + rel.x
	for(i=0;i<uniq.length;i++) {
		if(uniq[i].name === sqName) {
			uniq[i].hexFeatures.push(feat)
			break
		}
	}
	callback(uniq)
}

function findHexFromId(hexId, hexFeats) {
	var resp = null
	for(i=0;i<hexFeats.length;i++) {
		var f = hexFeats[i]
		var fHexId = f.properties.hexId
		if(fHexId === hexId) {
			resp = f
			break
		}
	}
	return resp
}
