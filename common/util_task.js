import {
	EnumSex,
	HostBase,
	TaskMoneyType
} from "./define_const.js"

function getJoinNum(t) {
	var res = [0, 0];
	if (!t.join) {
		return res;
	}
	
	for (let e of t.join.data) {
		res[e.sex]++;
	}
	return res;
}

function getNumString(task) {
	let str = "";
	let num = getJoinNum(task);
	let mann = num[EnumSex.MAN];
	let woman = num[EnumSex.WOMAN];
	if (task.man_num < 0) {
		// 不分性别
		str = `报名 ${mann+woman}/${task.people_num}`;
	} else {
		if (task.man_num == 0) {
			str = `限女生 $woman/${task.people_num}`;
		} else if (task.man_num == task.people_num) {
			str = `限男生 $mann/${task.people_num}`;
		} else {
			var wn = task.people_num - task.man_num;
			str = `男 $mann/${task.man_num} 女 $woman/$wn`;
		}
	}
	return str;
}

function getImageUrls(task) {
	var urls = [];
	var images = task.images;
	if (images != undefined) {
		for (var i = 0; i < images.length; i++) {
			if (images[i].includes("http")) {
				return images
			}
			urls.push(`${HostBase}/static/${images[i]}`);
		}
	}
	return urls;
}

function getImageUrlName(url) {
	return `${HostBase}/static/${url}`;
}

function getMoneyString(task) {
	if (task.money_type == TaskMoneyType.Reward) {
		return `赏金 ￥${task.money}`;
	} else {
		return `费用 男￥${task.money} 女￥${task.womanMoney}`;
	}
}

function getDistance(lat1, lng1, lat2, lng2) {
	let radLat1 = lat1 * Math.PI / 180.0; // 纬度转化成弧度
	let radLat2 = lat2 * Math.PI / 180.0;
	let a = radLat1 - radLat2;
	let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0; // 经度差
	let distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math
		.pow(Math.sin(b / 2), 2))) * 6378.137; // 地球的半径为6378.137km
	return parseInt(distance * 1000); // 返回米数
}

function getDistanceString(ad1, ad2) {
	// console.log("getdistance ",ad1,ad2)
	var dis = getDistance(ad1.latitude, ad1.longitude, ad2.latitude, ad2.longitude)
	if (dis >= 1000) {
		return (dis / 1000).toFixed(1) + 'km'
	}
	return `${dis}m`
}

function newTaskConfig() {
	return {
		globelLimit: 0,
		longitude: 0,
		latitude: 0,
		minDistance: 0,
		locLimit: 0,
		globelMax: 0,
		locMax: 0,
		search: ""
	}
}

function getEndTime(task) {
	var endtime = task.end_time;
	if (endtime <= 0) {
		return "无";
	} else {
		var diff = endtime - Math.floor(Date.now() / 1000);
		if (diff <= 0) {
			return "已结束报名";
		} else {
			var day = Math.floor(diff / 86400);
			if (day > 0) {
				return `还有${day}天`;
			}
			var hour = Math.floor((diff % 86400) / 3600);
			if (hour > 0) {
				return `还有${hour}时`;
			}
			var min = Math.floor((diff % 3600) / 60);
			return `还有${min}分`;
		}
	}
}

function getJoinByCid(cid, task) {
	if (task.join) {
		for (let s of task.join.data) {
			if (s.cid == cid) {
				return s
			}
		}
	}
}

function canJoin(t,sex) {
	if (t.man_num < 0) {
		var num = t.join ? t.join.data.length : 0;
		return (t.people_num - num) > 0;
	} else {
		var num = getJoinNum(t)[sex];
		if (sex ==  EnumSex.WOMAN) {
			return (t.people_num - t.man_num - num) > 0;
		} else {
			return (t.man_num - num) > 0;
		}
	}
}

export default {
	getJoinNum,
	getNumString,
	getImageUrls,
	getMoneyString,
	getImageUrlName,
	getDistanceString,
	newTaskConfig,
	getEndTime,
	getJoinByCid,
	canJoin,
}