function getSystemInfo(success) {
	uni.getSystemInfo({
		success:success
	})
}

function getIconUrl(url) {
	return url || "/static/icon/head_0_h.png";
}

function deleteArrayByVal(arr,v) {
	let i = arr.indexOf(v)
	if (i !== -1) {
		arr.splice(i,1)
	}
}

export default {
	getSystemInfo,
	getIconUrl,
	deleteArrayByVal,
}