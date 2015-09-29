var squares = require('./squareUtils')
var hexPosRel = require('./hexPosRelsUtils')

module.exports = function(posAll, grid, callback) {
	var gridFeatures = grid.features
	removeOut(posAll, function(posFeatures) {
		squares(function(pointToSquare, hexToSquares, squares) {
			addPos(0, posFeatures, squares, pointToSquare, function(sqWithPos) {
				addHex(0, gridFeatures, sqWithPos, hexToSquares, function(sq) {
					hexPosRel(sq, function(rels) {
						callback(rels)
					})
				})
			})
		})
	})
}

function addHex(count, gridFeatures, squares, hexToSquare, callback) {
	var index = count
	var total = gridFeatures.length
	count = count + 1
	if(count === total + 1) {
		callback(squares)
	} else {
		var f = gridFeatures[index]
		var c = f.geometry.coordinates
		var sqs = hexToSquare(c)
		for(j=0;j<sqs.length;j++) {
			var sq = sqs[j]
			for(i=0;i<squares.features.length;i++) {
				var s = squares.features[i].properties
				if(s.x === sq.x && s.y === sq.y) {
					s.hexFeatures.push(f)
					break
				}
			}
		}
		if(count/1000 === Math.floor(count/1000)) {
			console.log('added ' + count + ' of ' + total + ' hexes to squares')
			setTimeout(function() {
				addHex(count, gridFeatures, squares, hexToSquare, callback)
			},0)
		} else {
			addHex(count, gridFeatures, squares, hexToSquare, callback)
		}
	}
}

function addPos(count, posFeatures, squares, pointToSquare, callback) {
	var index = count
	var total = posFeatures.length
	count = count + 1
	if(count === total + 1) {
		callback(squares)
	} else {
		var f = posFeatures[index]
		var c = f.geometry.coordinates
		var sq = pointToSquare(c)
		for(i=0;i<squares.features.length;i++) {
			var s = squares.features[i].properties
			if(s.x === sq.x && s.y === sq.y) {
				s.posFeatures.push(f)
				break
			}
		}
		if(count/1000 === Math.floor(count/1000)) {
			console.log('added ' + count + ' of ' + total + ' positions to squares')
			setTimeout(function() {
				addPos(count, posFeatures, squares, pointToSquare, callback)
			},0)
		} else {
			addPos(count, posFeatures, squares, pointToSquare, callback)
		}
	}
}

function removeOut(posAll, callback) {
	loop(0, posAll, [], function(posFeatures) {
		callback(posFeatures)
	})
	function loop(count, posAll, posFeatures, callback) {
		var index = count
		var total = posAll.length
		count = count + 1
		if(count === total + 1) {
			callback(posFeatures)
		} else {
			var p = posAll[index]
			var c = p.geo.coordinates
			if(c[1] > 5.925 && c[1] < 6.324 && c[0] > 46.113 && c[0] < 46.438) {
				posFeatures.push({
					type: 'Feature', 
					properties: {_id: p._id}, 
					geometry: { type: 'Point', coordinates:[c[1],c[0]]}
				})
			}
			if(count / 1000 === Math.floor(count/1000)) { 
				setTimeout(function() {
					loop(count, posAll, posFeatures, callback)
				},0)
			} else {
				loop(count, posAll, posFeatures, callback)
			}
		}
	}
}







