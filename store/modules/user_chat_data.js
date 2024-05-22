import apihandle from "../../common/api_handle"
import { EnumLoadState } from "../../common/define_const"
import global_data from "../../common/global_data"
import util_common from "../../common/util_common"
import wsconn, { CmId } from "../../common/wsconn"

var userChatNum = 20

function getLastChatIndex(chat) {
	if (chat.data.length <= 0) {
		return chat.indexid
	}
	return chat.data[chat.data.length-1].index
}

export default {
	state: {
		user_chat_data: new Map(),
		user_chat_list:[],
		user_chat_read: new Map(),
		state_list: EnumLoadState.More,
		
	},
	getters: {
		getUserChatByCid: (state) => (cid) => {
			var t = state.user_chat_data.get(cid)
			if (!t) {
				let mycid = global_data.cid
				t = {
					id:"",
					cidhei:Math.max(mycid,cid),
					cidlow:Math.min(mycid,cid),
					head:[],
					data:[],
					count:0,
					indexid:0,
					updateat:0,
					state:EnumLoadState.noMore,
				}
				state.user_chat_data.set(cid,t)
			}
			return t
		},
		getUserChatUnReadNum: (state) => (tocid)=>{
			let chat = state.user_chat_data.get(tocid)
			if (chat && chat.data.length > 0 && chat.data[0].cid == global_data.cid) {
				return 0
			}
			let chatindex = chat?.indexid || 0
			let num = chatindex - (state.user_chat_read.get(tocid) || 0)
			return Math.min(num,99)
		}
	},
	mutations: {
		sendUserChat(state,data) {
			var chat = this.getters.getUserChatByCid(data.cid)
			var list = chat.data
			let cmsg = data.chat
			cmsg.tocid = data.cid
			
			if (chat.data.length == 0) {
				state.user_chat_list.splice(0,0,data.cid)
				uni.$emit("user_chat_list",data.cid)
			}
			
			list.splice(0,0,data.chat)
			wsconn.sendJsonData(CmId.CHAT_USER,cmsg,(res)=>{
				if (!res) {					
					apihandle.toast("发送失败,请检查网络")
					data.chat.sendfail = true
				}
			})
			// mySendChat.push(data.chat)
		},
		onGetUserChat(state,data) {
			let kcid = data.cidhei == global_data.cid ? data.cidlow : data.cidhei
			var chat = this.getters.getUserChatByCid(kcid)
			var netchat = data.data[0]
			if (chat.id.length == 0) {
				chat.id = data.id
			}
			chat.indexid = data.indexid
			chat.count = data.count
			
			if (chat.data.length == 0) {
				state.user_chat_list.splice(0,0,kcid)
				uni.$emit("user_chat_list",kcid)
			}
			
			if (netchat.cid == global_data.cid) {
				// state.user_chat_read.set(kcid,)
				this.commit("saveUserChatIndex",kcid)
			}else{
				if (data.state == EnumLoadState.Loading) {
					chat.head.splice(0,0,netchat)
				} else{
					chat.data.splice(0,0,netchat)
				}
				uni.$emit("getUserChat",netchat)
			}
			// console.log("get data ",list)
		},
		onLoadUserChatRead(state,datavec) {
			for (let v of datavec) {
				state.user_chat_read.set(v.tocid,v.index)
			}
		},
		deleteUserChat(state,cid) {
			let chat = state.user_chat_data.get(cid)
			util_common.deleteArrayByVal(state.user_chat_list,cid)
			apihandle.apiDeleteUserChatData(chat.id)
			// state.user_chat_data.delete(cid)
		},
		reloadUserChatData(state) {
			// 断线重连清除数据重新加载
			state.user_chat_list = []
			state.user_chat_data = new Map()
			// console.log("conn reloadUserChatData")
			uni.$emit("reloadUserChatData")
		},
		saveUserChatIndex(state,tocid) {
			var chat = this.getters.getUserChatByCid(tocid)
			let index = chat.indexid
			if (index <= (state.user_chat_read.get(tocid)||0)) {
				return
			}
			state.user_chat_read.set(tocid,index)
			global_data.setUserReadIndex(tocid,index)
			if (!global_data.user_chat_read_saveing) {
				// 延迟保存5s
				global_data.user_chat_read_saveing = true
				setTimeout(()=>{
					wsconn.saveUserChatIndex(global_data.user_chat_read_save)
					global_data.user_chat_read_save.clear()
					global_data.user_chat_read_saveing = false
				},3000)
			}
		}
	},
	actions: {
		async loadUserChatList(context,{ref,usecash}) {
			if (!context.getters.isLogin) {
				return
			}
			if (ref) {
				context.state.state_list = EnumLoadState.More
				context.state.user_chat_list = []
			}
			if (usecash) {
				return context.state.user_chat_list
			}
			if (context.state.state_list != EnumLoadState.More) {
				return
			}
			let res = await apihandle.apiLoadUserChatList()
			if (!res) {
				return
			}
			let umap = context.state.user_chat_data
			let ulist = context.state.user_chat_list
			for (let c of res) {
				let keycid = c.cidhei == global_data.cid ? c.cidlow : c.cidhei
				c.state = getLastChatIndex(c) == (c.indexid - c.count) ? EnumLoadState.noMore : EnumLoadState.More
				c.head = []
				umap.set(keycid,c)
				ulist.push(keycid)
			}
			context.state.state_list = EnumLoadState.noMore
			return ulist
		},
		async loadMoreUserChat(context,info) {
			var chat = this.getters.getUserChatByCid(info.cid)
			let tid = chat.id
			if (chat.state == EnumLoadState.Loading) {
				return
			}
			
			// 加载聊天信息
			if (tid == "") {
				chat.state = EnumLoadState.Loading
				let cres = await apihandle.apiLoadOneUserChatData(info.cid)
				if (cres) {
					chat.id = cres.id
					chat.data.push(...cres.data.reverse())
					chat.count = cres.count
					chat.indexid = cres.indexid
					
					if (cres.data.length < userChatNum) {
						chat.state = EnumLoadState.noMore
					}else{
						chat.state = EnumLoadState.More
					}
				}else{
					chat.id = "0"
					chat.state = EnumLoadState.noMore
				}
			}
			
			let lessnum = chat.data.length - info.length 	//剩余数量
			let downloadnum = 0 							//需要下载数量
			if (lessnum < userChatNum) {
				downloadnum = userChatNum - lessnum
			}
			
			if (downloadnum > 0 && chat.state == EnumLoadState.More) {
				var index = getLastChatIndex(chat)
				chat.state = EnumLoadState.Loading
				let onlinenum = chat.count - (chat.indexid - index)
				if (onlinenum < userChatNum) {
					downloadnum = onlinenum
				}else{
					downloadnum = userChatNum
				}
				if (downloadnum == 0) {
					return
				}
				var res = await apihandle.apiLoadUserChatData(tid,index - userChatNum - chat.indexid,downloadnum)
				if (chat.head.length > 0) {
					chat.data.splice(0,0,...chat.head)
					info.length += chat.head.length
					chat.head = []
				}
				
				let reslen = res.data.length
				if (chat.data.length > 0) {
					for (var i = reslen-1; i >= 0; i--) {
						if (res.data[i].index >= index) {
							res.data.pop()
						} else{
							break
						}
					}
				}
				
				if (res && res.data != null) {
					if (reslen < userChatNum) {
						chat.state = EnumLoadState.noMore
					}else{
						chat.state = EnumLoadState.More
					}
					chat.data.push(...res.data.reverse())
				}else{
					chat.state = EnumLoadState.noMore
				}
			}
			return chat.data.slice(info.length,info.length+userChatNum)
			
			// let chatlen = chat.data.length
			// if (info.length < chatlen) {
			// 	if (info.length + userChatNum <= chatlen || chat.state == EnumLoadState.noMore) {
			// 		return chat.data.slice(info.length,info.length + userChatNum)
			// 	}
			// }else if (chat.state != EnumLoadState.More) {
			// 	return
			// }
			
			// chat.state = EnumLoadState.Loading
			// var index = getLastChatIndex(chat)
			// let getnum = chatlen + userChatNum > chat.count ? chat.count - chatlen : userChatNum
			// if (getnum <= 0) {
			// 	chat.state = EnumLoadState.noMore
			// 	return chat.data.slice(info.length,info.length+userChatNum)
			// }
			// var res = await apihandle.apiLoadUserChatData(tid,index - userChatNum - chat.indexid,getnum)
			
			// if (chat.head.length > 0) {
			// 	chat.data.splice(0,0,...chat.head)
			// 	info.length += chat.head.length
			// 	chat.head = []
			// }
			
			// if (res && res.data != null) {
			// 	// var list = this.getters.getTaskChatById(tid)
			// 	// console.log("loadMoreChat ",res,info.length)
			// 	if (res.data.length < userChatNum) {
			// 		chat.state = EnumLoadState.noMore
			// 	}else{
			// 		chat.state = EnumLoadState.More
			// 	}
			// 	chat.data.push(...res.data.reverse())
			// 	return chat.data.slice(info.length,info.length+userChatNum)
			// }else{
			// 	chat.state = EnumLoadState.noMore
			// }
		},
	}
}
