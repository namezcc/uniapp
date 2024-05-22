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
	checkData(data) {
		if (data == undefined) {
			toast(res.errMsg)
			return false
		}else if (data.code != ErrCode.SUCCESS) {
			toast(data.msg)
			return false
		}
		return true
	},
	async apiGetPhoneCode(phone) {
		try{
			var res = await http.request("phoneCode","GET",{phoneNumber:phone})
			if (this.checkData(res.data)) {
				return res.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiUserLogin(phone) {
		try{
			var res = await http.request("userlogin","POST",{phone:phone})
			if (this.checkData(res.data)) {
				this.setToken(res.data.token)
				return res.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async userloginWxCode(code) {
		try{
			var res = await http.request("userloginWxCode","POST",{code:code})
			if (this.checkData(res.data)) {
				this.setToken(res.data.data.token)
				return res.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiUserRefreshToken(token){
		try{
			var header = {Authorization:token}
			var res = await http.request("userRefreshToken","GET",null,{header:header})
			if (this.checkData(res.data)) {
				this.setToken(res.data.data)
				return res.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiGetUserInfo(cid) {
		let url = cid ? "getUserInfo":"getSelfUserInfo"
		try{
			var res = await http.request(url,"GET",{cid:cid?cid:""},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiGetTaskInfo(config) {
		try{
			var res = await http.request("apiGetTaskInfo","POST",config)
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
			console.log(e)
		}
	},
	async apiCreateTask(task) {
		try{
			var res = await http.request("apiCreateTask","POST",task,{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiUpdateTask(task) {
		try{
			var res = await http.request("apiUpdateTask","POST",task,{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiSearchTask(config) {
		try{
			var res = await http.request("apiSearchTask","POST",config)
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiJoinTask(id) {
		try{
			var res = await http.request("apiJoinTask","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiQuitTask(id) {
		try{
			var res = await http.request("apiQuitTask","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiKickTask(id,cid) {
		try{
			var res = await http.request("apiKickTask","GET",{taskid:id,kickcid:cid},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiLoadInterest() {
		try{
			var res = await http.request("apiLoadInterest","GET",null,{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiTaskPushInterest(id) {
		try{
			var res = await http.request("apiTaskPushInterest","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiTaskPullInterest(id) {
		try{
			var res = await http.request("apiTaskPullInterest","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiLoadMyJoinTaskInfo(skip) {
		try{
			var res = await http.request("apiLoadMyJoinTaskInfo","GET",{skip:skip},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiLoadMyTaskInfo(skip) {
		try{
			var res = await http.request("apiLoadMyTaskInfo","GET",{skip:skip},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiLoadOtherTaskInfo(cid,skip) {
		try{
			var res = await http.request("apiLoadOtherTaskInfo","GET",{cid,skip},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiLoadTaskChat(taskid,start,num) {
		try{
			var res = await http.request("apiLoadTaskChat","GET",{taskid:taskid,start:start,num:num},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiGetOneTaskInfo(taskid) {
		try{
			var res = await http.request("apiGetOneTaskInfo","GET",{taskid},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiLoadUserChatList() {
		try{
			var res = await http.request("apiLoadUserChatList","GET",{},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiLoadUserChatData(id,start,num) {
		try{
			var res = await http.request("apiLoadUserChatData","GET",{id,start,num},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiLoadOneUserChatData(cid) {
		try{
			var res = await http.request("apiLoadOneUserChatData","GET",{cid},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiDeleteUserChatData(id) {
		try{
			var res = await http.request("apiDeleteUserChatData","GET",{id},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiLoadInterestTask(skip) {
		try{
			var res = await http.request("apiLoadInterestTask","GET",{skip},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiReportTask(data) {
		try{
			var res = await http.request("apiReportTask","POST",data,{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiReportUser(data) {
		try{
			var res = await http.request("apiReportUser","POST",data,{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiUserSuggest(data) {
		try{
			var res = await http.request("apiUserSuggest","POST",data)
			if (this.checkData(res.data)) {
				return true
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiGetBlackList() {
		try{
			var res = await http.request("apiGetBlackList","GET",{},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiPushBlackList(cid) {
		try{
			var res = await http.request("apiPushBlackList","GET",{cid},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiPullBlackList(cid) {
		try{
			var res = await http.request("apiPullBlackList","GET",{cid},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiGetUserList(cidvec) {
		try{
			var res = await http.request("apiGetUserList","POST",{cids:cidvec},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiSetUserIcon(iconurl) {
		try{
			let header = {...authorHeader}
			header['content-type'] = 'application/x-www-form-urlencoded'
			var res = await http.request("apiSetUserIcon","POST",{icon:iconurl},{header})
			if (this.checkData(res.data)) {
				return true
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiEditName(name) {
		try{
			var res = await http.request("apiEditName","GET",{name},{header:authorHeader})
			if (this.checkData(res.data)) {
				return true
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiDeleteMyTaskInfo(id) {
		try{
			var res = await http.request("apiDeleteMyTaskInfo","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data)) {
				return true
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiDeleteUserJoin(id) {
		try{
			var res = await http.request("apiDeleteUserJoin","GET",{taskid:id},{header:authorHeader})
			if (this.checkData(res.data)) {
				return true
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiGetCreditToUserType(cid) {
		try{
			var res = await http.request("apiGetCreditToUserType","GET",{cid},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiSetCreditToUserType(cid,type) {
		try{
			var res = await http.request("apiSetCreditToUserType","GET",{cid,type},{header:authorHeader})
			if (this.checkData(res.data)) {
				return res.data.data
			}
		}catch(e){
			toast("网络错误")
		}
	},
	async apiCheckIdCard(idcard,name) {
		try{
			var res = await http.request("apiCheckIdCard","GET",{idcard,name},{header:authorHeader})
			if (this.checkData(res.data)) {
				return true
			}
		}catch(e){
			toast("网络错误")
		}
		return false
	},
	async apiAppError(errinfo) {
		try{
			var res = await http.request("apiAppError","POST",{crash:errinfo},{header:authorHeader})
			// if (this.checkData(res.data)) {
			// 	return true
			// }
		}catch(e){
			toast("网络错误")
		}
		return false
	},
}

export default apihandle