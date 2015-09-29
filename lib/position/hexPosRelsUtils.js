var inside = require('turf-inside')

module.exports = function(sq, callback) {
	loopSq(0, sq.features, [], function(rels) {
		callback(rels)
	})
}

function loopSq(count, sqFeats, rels, callback) {
	var index = count
	var total = sqFeats.length
	count = count + 1
	if(count === total + 1) {
		callback(rels)
	} else {
		var sq = sqFeats[index].properties
		var hexFeats = sq.hexFeatures
		var posFeats = sq.posFeatures
		if(count/10 === Math.floor(count/10)) { 
			console.log('calculated relations between hex and pos in ' + count + ' of ' + total + ' squares') 
		}
		if(posFeats.length !== 0) {
			loopPos(0, posFeats, hexFeats, [], function(sqRels) {
				for(i=0;i<sqRels.length;i++) {
					rels.push(sqRels[i])
				}
				loopSq(count, sqFeats, rels, callback)
			})
		} else {
			loopSq(count, sqFeats, rels, callback)
		}
	}
}

function loopPos(count, posFeats, hexFeats, rels, callback) {
	var index = count
	var total = posFeats.length
	count = count + 1
	if(count === total + 1) {
		callback(rels)
	} else {
		var f = posFeats[index]
		loopHex(0, hexFeats, f, function(rel) {
			if(rel !== null) { rels.push(rel) }
			loopPos(count, posFeats, hexFeats, rels, callback)
		})
	}
} 

function loopHex(count, hexFeats, f, callback) {
	var index = count
	var total = hexFeats.length
	count = count + 1
	if(count === total + 1) {
		callback(null)
	} else {
		var hex = hexFeats[index]
		var isInside = inside(f,hex)
		if(isInside === true) {
			callback({_id: f.properties._id, hexId: hex.properties.hexId})
		} else {
			setTimeout(function() {
				loopHex(count, hexFeats, f, callback)
			},0)
		}
	}
}
