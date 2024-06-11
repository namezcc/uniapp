import { promise } from "../uni_modules/uv-ui-tools/libs/function/test.js";
import apihandle from "./api_handle.js";
import util_string from "./util_string.js";

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

var cos = null
function getCos() {
	if (cos == null) {
		con = new COS({
			getAuthorization:function(opt,callback){
				apihandle.apiGetOssCredential().then((res)=>{
					callback({
						TmpSecretId: res?.credentials?.tmpSecretId,
						TmpSecretKey: res?.credentials?.tmpSecretKey,
						XCosSecurityToken: res?.credentials?.sessionToken,
						ExpiredTime: res?.expiredTime,
					})
				})
			}
		})
	}
	return cos
}

function camSafeUrlEncode(str) {
	return encodeURIComponent(str).replace(/!/g, '%21')
                    .replace(/'/g, '%27')
                    .replace(/\(/g, '%28')
                    .replace(/\)/g, '%29')
                    .replace(/\*/g, '%2A');
}

function getUploadInfo(extName,callback) {
	apihandle.apiGetPostPolicy(extName).then((res)=>{
		callback(res)
	})
}

function uploadOssFile(opt,callback) {
	var formData = {
	   key: opt.cosKey,
	   policy: opt.policy, // 这个传 policy 的 base64 字符串
	   success_action_status: 200,
	   'q-sign-algorithm': opt.qSignAlgorithm,
	   'q-ak': opt.qAk,
	   'q-key-time': opt.qKeyTime,
	   'q-signature': opt.qSignature,
	};
	// 如果服务端用了临时密钥计算，需要传 x-cos-security-token
	if (opt.securityToken) formData['x-cos-security-token'] = opt.securityToken;
	uni.uploadFile({
	   url: 'https://' + opt.cosHost, //仅为示例，非真实的接口地址
	   filePath: opt.filePath,
	   name: 'file',
	   formData: formData,
	   success: (res) => {
		  if (![200, 204].includes(res.statusCode)) return callback(res);
		  var fileUrl = 'https://' + opt.cosHost + '/' + camSafeUrlEncode(opt.cosKey).replace(/%2F/g, '/');
		  callback && callback(null, fileUrl);
	   },
	   error(err) {
		  callback && callback(err);
	   },
	});
}

function uploadFile(path,fname,callback) {
	let ext = util_string.getExtName(fname)
	getUploadInfo(ext,function(info){
		if (info) {
			info.filePath = path
			uploadOssFile(info,(err,url)=>{
				if (err) {
					console.log("uploadoss err:",err)
				}else{
					console.log("uploadoss url:",url)
				}
				callback(url)
			})
		}else{
			callback(null)
		}
	})
}

function uploadFileList(vec) {
	let res = vec.map(_ => "")
	return new Promise((resolve,reject)=>{
		let num = 0
		for (var i = 0; i < vec.length; i++) {
			let v = vec[i]
			let index = i
			uploadFile(v.path,v.name,(url)=>{
				res[index] = url || ""
				num++
				if (num >= vec.length) {
					resolve(res)
				}
			})
		}
	})
}

function getTempFileList(e) {
	let res = []
	for (var i = 0; i < e.tempFilePaths.length; i++) {
		let img = e.tempFilePaths[i]
		var fileName = e.tempFiles[i].name;
		res.push({path:img,name:fileName})
	}
	return res
}
// 是否朋友圈分享打开
function isFromPYQ() {
	let options = uni.getLaunchOptionsSync();
	console.log("scene:",options.scene)
	return options.scene == 1154
}

export default {
	getSystemInfo,
	getIconUrl,
	deleteArrayByVal,
	deleteArrayByFunc,
	getCreditShowScore,
	getAgeFromID,
	uploadFile,
	uploadFileList,
	getTempFileList,
	isFromPYQ,
}