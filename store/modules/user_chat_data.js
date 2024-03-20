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
			wsconn.sendJsonData(CmId.CHAT_USER,cmsg)
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
		deleteUserChat(state,cid) {
			let chat = state.user_chat_data.get(cid)
			util_common.deleteArrayByVal(state.user_chat_list,cid)
			apihandle.apiDeleteUserChatData(chat.id)
			// state.user_chat_data.delete(cid)
		}
	},
	actions: {
		async loadUserChatList(context,{ref,usecash}) {
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
			let chatlen = chat.data.length
			
			if (info.length < chatlen) {
				if (info.length + userChatNum <= chatlen || chat.state == EnumLoadState.noMore) {
					return chat.data.slice(info.length,info.length + userChatNum)
				}
			}else if (chat.state != EnumLoadState.More) {
				return
			}
			
			chat.state = EnumLoadState.Loading
			var index = getLastChatIndex(chat)
			let getnum = chatlen + userChatNum > chat.count ? chat.count - chatlen : userChatNum
			if (getnum <= 0) {
				chat.state = EnumLoadState.noMore
				return chat.data.slice(info.length,info.length+userChatNum)
			}
			var res = await apihandle.apiLoadUserChatData(tid,index - userChatNum - chat.indexid,getnum)
			
			if (chat.head.length > 0) {
				chat.data.splice(0,0,...chat.head)
				info.length += chat.head.length
				chat.head = []
			}
			
			if (res && res.data != null) {
				// var list = this.getters.getTaskChatById(tid)
				// console.log("loadMoreChat ",res,info.length)
				if (res.data.length < userChatNum) {
					chat.state = EnumLoadState.noMore
				}else{
					chat.state = EnumLoadState.More
				}
				chat.data.push(...res.data.reverse())
				return chat.data.slice(info.length,info.length+userChatNum)
			}else{
				chat.state = EnumLoadState.noMore
			}
		},
	}
}
