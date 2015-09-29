var json = require('../file/json')
var getAll = require('../position/getAll')
var createHexgrid = require('../position/createHexgrid')
var hexPosRels = require('../position/hexPosRels')

module.exports = function(callback) {
	getHexPosRels(function() { callback('done') })
}

function getHexPosRels(callback) {
	getAll(function(positions) {
		json.save('data/json/pos_positions.json', positions, function() {
			createHexgrid(function(grid) {
				json.save('data/json/pos_grid.json', grid, function() {
					hexPosRels(positions, grid, function(rels) {
						json.save('data/json/pos_hexPosRels.json', rels, function() {
							callback()
						})
					})
				})
			})
		})
	})
}
