var _ = require('underscore')
var format = require('./dateFormat')
module.exports = function(timestamps, callback) {
	loop(0, timestamps, [],[],[], function(hours, weekdays, weekNb) {
		countUniq(hours, function(hoursCount) {
			countUniq(weekdays, function(weekdaysCount) {
				countUniq(weekNb, function(weekNbCount) {
					callback(hoursCount, weekdaysCount, weekNbCount)
				})
			})
		})
	})
}

function countUniq(arr, callback) {
	var result = _.countBy(arr, function(obj) { return obj })
	callback(result)
}

function loop(count, timestamps, hours, weekdays, weekNb, callback) {
	var index = count
	count = count + 1
	if(count === timestamps.length + 1) {
		callback(hours, weekdays, weekNb)
	} else {
		var obj = timestamps[index]
		var ts = obj.timestamp_ms
		hours.push(format.getHour(ts))
		weekdays.push(format.getWeekday(ts))
		weekNb.push(format.getWeekNb(ts))
		setTimeout(function() {
			if(count / 1000 === Math.floor(count/1000)) { console.log(count) }
			loop(count, timestamps, hours, weekdays, weekNb, callback)
		}, 0)
	}
}
