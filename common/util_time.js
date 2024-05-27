function getSecond(timestr = null) {
	let stamp = timestr != null ? Date.parse(timestr) : Date.now()
	return Math.floor(stamp/1000)
}

// stamp 为秒级
function formatTime(stamp) {
	stamp *= 1000
	const date = new Date(stamp);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');
	
	const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	return formattedDate;
}

function diffString(stamp) {
	var tdate = new Date(stamp*1000)
	var ndate = new Date()
	
	const year = tdate.getFullYear();
	const month = (tdate.getMonth() + 1).toString().padStart(2, '0');
	const day = tdate.getDate().toString().padStart(2, '0');
	const hours = tdate.getHours().toString().padStart(2, '0');
	const minutes = tdate.getMinutes().toString().padStart(2, '0');
	
	if (tdate.getFullYear() == ndate.getFullYear()) {
		if (tdate.getMonth() == ndate.getMonth() && tdate.getDate() == ndate.getDate()) {
			return `${hours}:${minutes}`
		} else{
			return `${month}月${day}日 ${hours}:${minutes}`
		}
	}else{
		return `${year}年${month}月${day}日 ${hours}:${minutes}`;
	}
}

const weekString = ["日","一","二","三","四","五","六"]

function formatTaskWeekTime(stamp,conf) {
	stamp *= 1000
	const date = new Date(stamp);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString() //.padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');
	const week = weekString[date.getDay()]
	
	let weekstr = conf?.week ? `周${week} ` : ""
	let daystr = conf?.day ? `${month}月${day}日 ` : ""
	let hm = conf?.nohm ? "" : `${hours}:${minutes}`
	const formattedDate = `${weekstr}${daystr}${hm}`;
	return formattedDate;
}

function isSameDay(timestamp1, timestamp2) {
    // 将时间戳转换为日期对象
    const date1 = new Date(timestamp1 * 1000); // 注意：JavaScript的时间戳是毫秒级的，所以需要乘以1000
    const date2 = new Date(timestamp2 * 1000);
    
    // 比较年、月、日是否相同
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

export default {
	getSecond,
	formatTime,
	diffString,
	formatTaskWeekTime,
	weekString,
	isSameDay,
}