var json = require('../file/json')
var getAll = require('../position/getAll')
var createHexgrid = require('../position/createHexgrid')
var squareGrid = require('../position/squareGrid')
var tweetHex = require('../position/tweetHex')

module.exports = function(callback) {
	hexPosRels(function() {
		callback()
	})
}

function hexPosRels(callback) {
	createHexAndSquareGrids(function() {
		tweetSquareRels(function() {
			createSquaresWithHexAndPos(function() {
				getRelationsBetweenHexAndPos(function() {
					callback()
				})
			})
		})
	})
}

function getRelationsBetweenHexAndPos(callback) {
	json.open('data/json/pos_squaresWithHexAndPos.json', function(squares) {
		tweetHex.rels(squares, function(rels) {
			json.save('data/json/pos_hexPosRels.json', rels, function() {
				callback()
			})
		})
	})
}

function createSquaresWithHexAndPos(callback) {
	json.open('data/json/pos_hexSquareRels.json', function(hexSquareRels) {
		json.open('data/json/pos_positionsSquareRels.json', function(positionsSquareRels) {
			json.open('data/json/pos_grid.json', function(hexCol) {
				tweetHex.addHexAndPosToSquare(hexSquareRels, positionsSquareRels, hexCol, function(squares) {
					json.save('data/json/pos_squaresWithHexAndPos.json', squares, function() {
						callback()
					})
				})
			})
		})
	})
}

function tweetSquareRels(callback) {
	getAll(function(positions) {
		json.save('data/json/pos_positions.json', positions, function() {
			squareGrid.pos(positions, function(rels) {
				json.save('data/json/pos_positionsSquareRels.json', rels, function() {
					callback()
				})
			})
		})
	})
}

function createHexAndSquareGrids(callback) {
	createHexgrid(function(hexCol) {
		json.save('data/json/pos_grid.json', hexCol, function() {
			squareGrid.create(function(squaresCol) {
				json.save('data/json/pos_squareGrid.json', squaresCol, function() {
					squareGrid.hex(hexCol, squaresCol, function(hexSquareRels) {
						json.save('data/json/pos_hexSquareRels.json', hexSquareRels, function() {
							callback()	
						})
					})
				})
			})
		})
	})
}
