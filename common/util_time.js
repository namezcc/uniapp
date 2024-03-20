function getSecond() {
	return Math.floor(Date.now()/1000)
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

export default {
	getSecond,
	formatTime,
	diffString,
}