var json = require('../file/json')
var getTimestamps = require('../time/getAll')
var formatTimestamps = require('../time/formatLoop')

module.exports = function(callback) {
	getTimestamps(function(ts) {
		json.save('data/json/time_timestamps.json', ts, function() {
			formatTimestamps(ts, function(hours, weekdays, weekNb) {
				json.save('data/json/time_hours.json', hours, function() {
					json.save('data/json/time_weekdays.json', weekdays, function() {
						json.save('data/json/time_weekNb.json', weekNb, function() {
							console.log('done with timestamps')
							callback()
						})
					})
				})
			})
		})
	})
}
