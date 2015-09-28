var MongoClient = require('mongodb').MongoClient

exports.get = function(conditions, whatToGet, callback) {
	MongoClient.connect('mongodb://localhost:27017', function(err, db) {
		if(err) { console.log(err) }
		else {
			console.log('connected to db')
			var tweets = db.collection('tweets')
			tweets.find(conditions, whatToGet).toArray(function(err, docs) {
				console.log('db responded')
				db.close();
				if(err) { console.log(err) }
				else { callback(docs) }
			})
		}
	})
}
