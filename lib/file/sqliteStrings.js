var sqlite = require('dblite')
var _ = require('underscore')

exports.createTable = function(tableName, columns) {
	var createString = 'DROP TABLE IF EXISTS "' + tableName + '"; CREATE TABLE ' + tableName + ' ('
	for(i=0;i<columns.length;i++) {
		createString = createString + columns[i].name + ' ' + columns[i].type
		if(i !== columns.length - 1) { 
			createString = createString + ', ' 
		}
	}
	createString = createString + ')'
	return createString
}

exports.insert = function(tableName, array, callback) {
	var keys = _.keys(array[0])
	var resp = []
	for(i=0;i<array.length;i++) {
		var insertString = 'INSERT INTO ' + tableName + ' VALUES ('
		var line = array[i]
		var values = []
		for(j=0;j<keys.length;j++) {
			values.push(line[keys[j]])
			insertString = insertString + '?'
			if(j !== keys.length - 1) {
				insertString = insertString + ', '
			}
		}
		insertString = insertString + ')'
		resp.push({string: insertString, values: values})
	}
	callback(resp)
}
