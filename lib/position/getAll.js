var tweetDb = require('../mongodb/tweets')

module.exports = function(callback) {
	var where = {geo: {$ne:null}}
	var select = {_id:1, geo: 1}
	tweetDb.get(where, select, function(docs) {
		callback(docs)
	})
}

