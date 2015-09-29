var tweetDb = require('../mongodb/tweets')

exports.geo = function(callback) {
	var where = {geo: {$ne:null}}
	var select = {_id:1, geo: 1}
	tweetDb.get(where, select, function(docs) {
		callback(docs)
	})
}

exports.lang = function(callback) {
	var where = {geo: {$ne:null}}
	var select = {_id:1, lang: 1}
	tweetDb.get(where, select, function(docs) {
		callback(docs)
	})
}

