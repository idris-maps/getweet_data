var string = require('./sqliteStrings')

exports.save = function(db, tableName, columns, array, callback) {
	var createString = string.createTable(tableName, columns)
	db.query(createString)

	string.insert(tableName, array, function(r) {
		for(i=0;i<r.length;i++) {
			db.query(r[i].string, r[i].values)
		}
	})

	console.log('inserted values into TABLE ' + tableName)
	callback()
}

exports.read = function(db, tableName, callback) {
	db.query('.headers ON')
  db.query('SELECT * FROM ' + tableName, function(err, rows) {
		db.query('.headers OFF')
		callback(rows)
	})
}

exports.query = function(db, query, callback) {
	db.query(query, function(err) {
		console.log('ran QUERY ' + query)
		callback()
	})
}
