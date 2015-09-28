var tweetDb = require('../mongodb/tweets')
var jf = require('jsonfile')

module.exports = function(callback) {
	var where = {}
	var select = {_id:1, timestamp_ms: 1}
	tweetDb.get(where, select, function(docs) {
		callback(docs)
	})
}

