exports.getWeekNb = function(ts) {
	var d = new Date(ts)
	d.setHours(0,0,0)
	d.setDate(d.getDate() + 4 - (d.getDay()||7))
	var yearStart = new Date(d.getFullYear(),0,1)
	var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
	return weekNo
}

exports.getHour = function(ts) {
	var d = new Date(ts)
	return d.getHours()	
}

exports.getWeekday = function(ts) {
	var d = new Date(ts)
	return d.getDay()
}
