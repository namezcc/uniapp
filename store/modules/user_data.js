import api from "@/common/api_handle.js"
import global_data from "../../common/global_data"
import util_common from "../../common/util_common"
import util_db from "../../common/util_db"

export default {
	state: {
		user:{
			cid:0,
		},
		location:null,
		interestTask: [],	//兴趣列表
		blackList:[],		//黑名单
		user_map: new Map(),
		user_credit_type: new Map(),		//评价类型
	},
	getters: {
		inInterestTask: state => (id) => {
			return state.interestTask.findIndex(v=>v==id) >= 0
		},
		maxInterestTask: state => {
			return state.interestTask.length >= 100
		},
		inBlackList: state => (cid) => {
			return state.blackList.findIndex(v=>v==cid) >= 0
		},
	},
	mutations: {
		setUser(state,user) {
			state.user = user
			global_data.setUser(user)
			state.user_map.set(user.cid,user)
		},
		logout(state) {
			console.log("logout user")
			state.user = {cid:0}
			global_data.setUser(null)
			this.commit("setLogoutToken")
		},
		setLocation(state,loc) {
			state.location = loc
			// console.log("setLocation ",loc)
		},
		setInterestTask(state,data) {
			state.interestTask = data
		},
		pushInterestTask(state,id) {
			state.interestTask.push(id)
		},
		pullInterestTask(state,id) {
			var i = state.interestTask.indexOf(id)
			if (i >= 0) {
				state.interestTask.splice(i,1)
			}
		},
		addBlackList(state,cid) {
			state.blackList.push(cid)
			api.apiPushBlackList(cid)
		},
		removeBlackList(state,cid) {
			util_common.deleteArrayByVal(state.blackList,cid)
			api.apiPullBlackList(cid)
		},
		setUserIcon(state,url) {
			state.user.icon = url
		},
		setUserName(state,name) {
			state.user.name = name
		},
		setUserSex(state,sex) {
			state.user.sex = sex
		},
		setOtherUserCredit(state,{cid,ctype}) {
			let u = state.user_map.get(cid)
			if (u) {
				let oldtype = state.user_credit_type.get(cid) || 0
				state.user_credit_type.set(cid,ctype)
				let score = ctype - oldtype
				u.credit_score += score
				api.apiSetCreditToUserType(cid,ctype)
			}
		}
	},
	actions: { 
		getUserData(context) {
			console.log("getUserData")
			api.apiGetUserInfo().then((res)=>{
				if (res) {
					// console.log(res)
					console.log("getUserData success",res)
					context.commit("setUser",res)
					setTimeout(()=>{						
						if (res.icon == "") {
							uni.$emit("onGetUserData",res)
						}
					},1000)
					// #ifdef MP-WEIXIN
					// #endif
				}else{
					// context.commit("login","")
				}
			})
			// 初始化都在这做
			
			
			// 请求兴趣列表
			api.apiLoadInterest().then((res)=>{
				if (res?.length) {
					// console.log("apiLoadInterest ",res)
					context.commit("setInterestTask",res)
				}
			})
			// 黑名单列表
			api.apiGetBlackList().then((res)=>{
				if (res?.length) {
					console.log("apiGetBlackList",res)
					context.state.blackList = res
				}
			})
			// 私聊列表
			context.dispatch("loadUserChatList",{ref:true})
		},
		async getOtherUser(context,cid) {
			let u = context.state.user_map.get(cid)
			if (u) {
				return u
			}
			u = await api.apiGetUserInfo(cid)
			if (u) {
				context.state.user_map.set(cid,u)
			}
			return u
		},
		async getOtherUserList(context,cidvec) {
			if (cidvec.length == 0) {
				return
			}
			let res = await api.apiGetUserList(cidvec)
			if (res) {
				for (let v of res) {
					context.state.user_map.set(v.cid,v)
				}
			}
			return res
		},
		async getOtherUserListOrCash(context,cidvec) {
			if (cidvec.length == 0) {
				return []
			}
			let vec = []
			let umap = context.state.user_map
			for (let cid of cidvec) {
				let u = umap.get(cid)
				if (u == null) {
					vec.push(cid)
				}
			}
			let resvec = []
			if (vec.length > 0) {
				let res = await api.apiGetUserList(vec)
				if (res) {
					for (let v of res) {
						umap.set(v.cid,v)
					}
				}
			}
			for (let cid of cidvec) {
				let u = umap.get(cid)
				resvec.push(u)
			}
			return resvec
		},
		async getBlackListUser(context) {
			return await this.dispatch("getOtherUserList",context.state.blackList)
		},
		async getUserCreditType(context,cid) {
			let ctype = context.state.user_credit_type.get(cid)
			if (ctype != null) {
				return ctype
			}
			
			let res = await api.apiGetCreditToUserType(cid)
			if (res) {
				ctype = res.ctype
				context.state.user_credit_type.set(cid,ctype)
			}else{
				ctype = 0
			}
			return ctype
		},
		async checkIdcard(context,{idcard,name}) {
			let res = await api.apiCheckIdCard(idcard,name)
			if (res) {
				context.state.user.age = util_common.getAgeFromID(idcard)
			}
			return res
		}
	}
}
