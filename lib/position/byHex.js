exports.countIds = function(grid, rels, callback) {
	countIdsByHex(rels, function(count) {
		getGeom(count, grid.features, function(col) {
			callback(col)
		})
	})
}

function getGeom(count, gridFeatures, callback) {
	var feats = []
	for(i=0;i<count.length;i++) {
		var hexId = count[i].hexId
		var nb = count[i].nb
		for(j=0;j<gridFeatures.length;j++) {
			var f = gridFeatures[j]
			if(f.properties.hexId === hexId) {
				f.properties.nb = nb
				feats.push(f)
				break
			}
		}
	}
	callback({type:'FeatureCollection', features: feats})
}

function countIdsByHex(rels, callback) {
	var uniqHex = []
	for(i=0;i<rels.length;i++) {
		var r = rels[i]
		var exist = false
		for(j=0;j<uniqHex.length;j++) {
			var h = uniqHex[j]
			if(h.hexId === r.hexId) {
				h.nb = h.nb + 1
				exist = true
				break
			}
		}
		if(exist === false) {
			uniqHex.push({hexId: r.hexId, nb: 1})
		}
	}
	callback(uniqHex)
}
