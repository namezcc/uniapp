import http from "./http_util.js"
import { ErrCode } from "./define_const.js"
import utime from "./util_time.js"

function toast(msg) {
	if (typeof(msg) != "string") {
		return
	}
	uni.showToast({
		title:msg,
		icon:"none"
	})
}

var optmap = new Map();
var authorHeader = {};

var apihandle = {
	toast:toast,
	once(opt,func) {
		var now = utime.getSecond()
		let v = optmap.get(opt)
		if (v && now < v ) {
			return
		}else{
			optmap.set(opt,now + 5)	//5s
			func(()=>{
				optmap.delete(opt)
			})
		}
	},
	setToken(token) {
		authorHeader["Authorization"] = token
	},
	checkData(data,res,tolog=false) {
		if (data == undefined) {
			if (tolog) {
				console.log(res.errMsg)
			}else{
				toast(res.errMsg)
			}
			return false
		}else if (data.code != ErrCode.SUCCESS) {
			if (tolog) {
				console.log(data.msg)
			}else{
				toast(data.msg)
			}
			return false
		}
		return true
	},
	checkHttpRes(res) {
		if (res?.statusCode != 200) {
			toast("http错误:"+res.statusCode + " "+res.errMsg)
			return false
		}
		return true
	},
	catchError(e,showtip=true) {
		if (showtip) {
			toast("网络不可用")
		}
		console.log(e)
	},
	// async apiGetPhoneCode(phone) {
	// 	try{
	// 		var res = await http.request("phoneCode","GET",{phoneNumber:phone})
	// 		if (this.checkData(res.data,res)) {
	// 			return res.data
	// 		}
	// 	}catch(e){
	// 		this.catchError(e)
	// 	}
	// },
	async apiUserLogin(phone,opencode) {
		try{
			var res = await http.request("userlogin","POST",{phone:phone,opencode})
			if (this.checkData(res.data,res)) {
				this.setToken(res.data.data.token)
				return res.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async userloginWxCode(code,opencode) {
		try{
			var res = await http.request("userloginWxCode","POST",{code,opencode})
			if (this.checkData(res.data,res)) {
				this.setToken(res.data.data.token)
				return res.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiUserRefreshToken(token){
		try{
			var header = {Authorization:token}
			var res = await http.request("userRefreshToken","GET",null,{header:header})
			if (this.checkData(res.data,res)) {
				this.setToken(res.data.data)
				return res.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiGetUserInfo(cid) {
		let url = cid ? "getUserInfo":"getSelfUserInfo"
		try{
			var res = await http.request(url,"GET",{cid:cid?cid:""},{header:authorHeader})
			if (this.checkData(res.data,res,true)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiGetTaskInfo(config) {
		try{
			var res = await http.request("apiGetTaskInfo","POST",config)
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiCreateTask(task) {
		try{
			var res = await http.request("apiCreateTask","POST",task,{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiUpdateTask(task) {
		try{
			var res = await http.request("apiUpdateTask","POST",task,{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiSearchTask(config) {
		try{
			var res = await http.request("apiSearchTask","POST",config,{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiJoinTask(id) {
		try{
			var res = await http.request("apiJoinTask","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiQuitTask(id) {
		try{
			var res = await http.request("apiQuitTask","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiKickTask(id,cid) {
		try{
			var res = await http.request("apiKickTask","GET",{taskid:id,kickcid:cid},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiLoadInterest() {
		try{
			var res = await http.request("apiLoadInterest","GET",null,{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiTaskPushInterest(id) {
		try{
			var res = await http.request("apiTaskPushInterest","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiTaskPullInterest(id) {
		try{
			var res = await http.request("apiTaskPullInterest","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiLoadMyJoinTaskInfo(skip) {
		try{
			var res = await http.request("apiLoadMyJoinTaskInfo","GET",{skip:skip},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiLoadMyTaskInfo(skip) {
		try{
			var res = await http.request("apiLoadMyTaskInfo","GET",{skip:skip},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiLoadOtherTaskInfo(cid,skip) {
		try{
			var res = await http.request("apiLoadOtherTaskInfo","GET",{cid,skip},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiLoadTaskChat(taskid,start,num) {
		try{
			var res = await http.request("apiLoadTaskChat","GET",{taskid:taskid,start:start,num:num},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiGetOneTaskInfo(taskid) {
		try{
			var res = await http.request("apiGetOneTaskInfo","GET",{taskid},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiLoadUserChatList() {
		try{
			var res = await http.request("apiLoadUserChatList","GET",{},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiLoadUserChatData(id,start,num) {
		try{
			var res = await http.request("apiLoadUserChatData","GET",{id,start,num},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiLoadOneUserChatData(cid) {
		try{
			var res = await http.request("apiLoadOneUserChatData","GET",{cid},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiDeleteUserChatData(id) {
		try{
			var res = await http.request("apiDeleteUserChatData","GET",{id},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiLoadInterestTask(skip) {
		try{
			var res = await http.request("apiLoadInterestTask","GET",{skip},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiReportTask(data) {
		try{
			var res = await http.request("apiReportTask","POST",data,{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiReportUser(data) {
		try{
			var res = await http.request("apiReportUser","POST",data,{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiUserSuggest(data) {
		try{
			var res = await http.request("apiUserSuggest","POST",data)
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiGetBlackList() {
		try{
			var res = await http.request("apiGetBlackList","GET",{},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiPushBlackList(cid) {
		try{
			var res = await http.request("apiPushBlackList","GET",{cid},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiPullBlackList(cid) {
		try{
			var res = await http.request("apiPullBlackList","GET",{cid},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiGetUserList(cidvec) {
		try{
			var res = await http.request("apiGetUserList","POST",{cids:cidvec},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiSetUserIcon(iconurl) {
		try{
			let header = {...authorHeader}
			header['content-type'] = 'application/x-www-form-urlencoded'
			var res = await http.request("apiSetUserIcon","POST",{icon:iconurl},{header})
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiEditName(name) {
		try{
			var res = await http.request("apiEditName","GET",{name},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiDeleteMyTaskInfo(id) {
		try{
			var res = await http.request("apiDeleteMyTaskInfo","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiSetFinishTask(id) {
		try{
			var res = await http.request("apiSetFinishTask","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiDeleteUserJoin(id) {
		try{
			var res = await http.request("apiDeleteUserJoin","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiGetCreditToUserType(cid) {
		try{
			var res = await http.request("apiGetCreditToUserType","GET",{cid},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
	},
	async apiSetCreditToUserType(cid,type) {
		try{
			var res = await http.request("apiSetCreditToUserType","GET",{cid,type},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e)
		}
	},
	async apiCheckIdCard(idcard,name) {
		try{
			var res = await http.request("apiCheckIdCard","GET",{idcard,name},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			this.catchError(e)
		}
		return false
	},
	async apiAppError(errinfo) {
		try{
			var res = await http.request("apiAppError","POST",{crash:errinfo},{header:authorHeader})
			// if (this.checkData(res.data,res)) {
			// 	return true
			// }
		}catch(e){
			this.catchError(e,false)
		}
		return false
	},
	async apiGetOssCredential() {
		try{
			var res = await http.request("apiGetOssCredential","GET",{},{header:authorHeader})
			return res.data
		}catch(e){
			this.catchError(e,false)
		}
		return null
	},
	async apiGetPostPolicy(ext) {
		try{
			var res = await http.request("apiGetPostPolicy","GET",{ext},{header:authorHeader})
			if (this.checkHttpRes(res)) {
				return res.data
			}
		}catch(e){
			this.catchError(e,false)
		}
		return null
	},
	async apiGetOpenTestInput() {
		try{
			var res = await http.request("apiGetOpenTestInput","GET",{})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
		return null
	},
	async apiGetOpenId(opencode) {
		try{
			var res = await http.request("apiGetOpenId","GET",{opencode},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			// this.catchError(e)
			console.log("apiGetOpenId",e)
		}
		return false
	},
	async apiVerifyTextContent(content,scene) {
		try{
			var res = await http.request("apiVerifyTextContent","POST",{content,scene},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			// this.catchError(e)
			console.log("apiVerifyTextContent",e)
		}
	},
	async apiRemoveTsak(taskid) {
		try{
			var res = await http.request("apiRemoveTsak","GET",{taskid,},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			this.catchError(e)
		}
		return false
	},
	async apiTaskCheckOne(id,open) {
		try{
			var res = await http.request("apiTaskCheckOne","GET",{id,open},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return true
			}
		}catch(e){
			this.catchError(e)
		}
		return false
	},
	async apiLoadCheckTask(skip) {
		try{
			var res = await http.request("apiLoadCheckTask","GET",{skip},{header:authorHeader})
			if (this.checkData(res.data,res)) {
				return res.data.data
			}
		}catch(e){
			this.catchError(e,false)
		}
		return null
	},
}

export default apihandle