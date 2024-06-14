import { HostBase } from "./define_const.js"

async function request(url,method,data,config) {
	let opt = {
		url:HostBase +"/"+url,
		method:method,
		// timeout:5000, 5s
		data:data,
		header: config?.header || {},
		sslVerify:false,
	}
	return await uni.request(opt)
}

function uploadImage(filepath,success) {
	// uni.uploadFile({
	// 	url: HostBase+"/apiUploadOssImage",
	// 	filePath: filepath,
	// 	name: 'file',
	// 	// 成功函数
	// 	success: success,
	// 	// 失败提示用户重新上传
	// 	fail: error => {
	// 		console.log('上传失败', error);
	// 	}
	// })
}

export default {
	request,
	uploadImage
}