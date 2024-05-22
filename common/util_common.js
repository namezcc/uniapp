function getSystemInfo(success) {
	uni.getSystemInfo({
		success:success
	})
}
//|| "/static/icon/head_0_h.png"
function getIconUrl(url) {
	return url;
}

function deleteArrayByVal(arr,v) {
	let i = arr.indexOf(v)
	if (i !== -1) {
		arr.splice(i,1)
	}
}

function deleteArrayByFunc(arr,func) {
	let vec = []
	for (var i = 0; i < arr.length; i++) {
		if (func(arr[i])) {
			arr.splice(i,1)
			break
		}
	}
}

function getCreditShowScore(score) {
	return 100 + (score||0)
}

function getAgeFromID(id) {
    var birthday = id.substring(6, 14); // 从身份证号码中截取出生日期部分
    var year = birthday.substring(0, 4);
    var month = birthday.substring(4, 6);
    var day = birthday.substring(6, 8);
    
    var today = new Date();
    var birthDate = new Date(year, month - 1, day); // 减去1是因为月份从0开始计数
    
    var age = today.getFullYear() - birthDate.getFullYear();
    
    // 如果生日大于当前日期的生日，则年龄减1
    if (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export default {
	getSystemInfo,
	getIconUrl,
	deleteArrayByVal,
	deleteArrayByFunc,
	getCreditShowScore,
	getAgeFromID,
}