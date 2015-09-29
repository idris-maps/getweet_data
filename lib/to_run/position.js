var json = require('../file/json')
var getAll = require('../position/getAll')
var createHexgrid = require('../position/createHexgrid')
var hexPosRels = require('../position/hexPosRels')
var byHex = require('../position/byHex')
module.exports = function(callback) {
	//getHexPosRels(function() { callback('done') })
	countByHex(function() { callback('done') })
}

function getHexPosRels(callback) {
	getAll.geo(function(positions) {
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

function countByHex(callback) {
	json.open('data/json/pos_hexPosRels.json', function(rels) {
		json.open('data/json/pos_grid.json', function(grid) {
			byHex.countIds(grid, rels, function(gridCount) {
				json.save('data/json/pos_grid_countIds.json', gridCount, function() {
					callback()
				})
			})
		}) 
	})
}
