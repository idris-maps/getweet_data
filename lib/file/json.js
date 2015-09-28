var jf = require('jsonfile')

exports.save = function(filename, json, callback) {
	jf.writeFile(filename, json, function() {
		console.log('wrote ' + filename)
		callback()
	})
}

exports.open = function(filename, callback) {
	jf.readFile(filename, function(err, json) {
		if(err) { console.log(err) }
		else {
			console.log('opened ' + filename)
			callback(json)
		}
	})
} 
