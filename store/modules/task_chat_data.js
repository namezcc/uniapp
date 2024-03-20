import apihandle from "../../common/api_handle"
import { EnumLoadState } from "../../common/define_const"
import global_data from "../../common/global_data"
import wsconn, { CmId } from "../../common/wsconn"

var taskChatNum = 20
var mySendChat = []

function getLastChatIndex(chat) {
	if (chat.data.length <= 0) {
		return chat.index
	}
	return chat.data[chat.data.length-1].index
}

export default {
	state: {
		task_chat_data: new Map(),
	},
	getters: {
		getTaskChatById: (state) => (id) => {
			var t = state.task_chat_data.get(id)
			if (!t) {
				t = {
					id:id,
					index:0,
					data:[],
					head:[],
					count:0,
					state:EnumLoadState.More,
				}
				state.task_chat_data.set(id,t)
			}
			return t
		},
	},
	mutations: {
		sendTaskChat(state,data) {
			var chat = this.getters.getTaskChatById(data.id)
			var list = chat.data
			list.splice(0,0,data.chat)
			wsconn.sendJsonData(CmId.TASK_CHAT,{
				id:data.id,
				data:[data.chat]
			})
			mySendChat.push(data.chat)
			// list.push(data.chat)
		},
		onGetTaskChat(state,data) {
			if (data.data.length <= 0) {
				return
			}
			var chat = this.getters.getTaskChatById(data.id)
			var netchat = data.data[0]
			chat.index = data.index
			chat.count = data.count
			if (netchat.cid == global_data.cid) {
				var sended = mySendChat.splice(0,1)
				for (var i = 0; i < chat.data.length; i++) {
					let c = chat.data[i]
					if (c == sended) {
						chat.data[i] = netchat
						break
					}
				}
			}else{				
				if (data.state == EnumLoadState.Loading) {
					chat.head.splice(0,0,...data.data)
				} else{
					chat.data.splice(0,0,...data.data)
				}
				uni.$emit("getTaskChat",data)
			}
			// console.log("get data ",list)
		},
		onGetTaskChatIndex(state,data) {
			for (let t of data) {
				if (t.index <= 0) {
					continue
				}
				var chat = this.getters.getTaskChatById(t.id)
				if (chat.index != t.index) {
					chat.index = t.index
					chat.state = EnumLoadState.More
					chat.count = t.count
					chat.data = []
				}
			}
		}
	},
	actions: { 
		async loadMoreChat(context,info) {
			let tid = info.id
			var chat = this.getters.getTaskChatById(tid)
			
			if (info.length < chat.data.length) {
				if (info.length + taskChatNum <= chat.data.length || chat.state == EnumLoadState.noMore) {
					return chat.data.slice(info.length,info.length + taskChatNum)
				}
			}else if (chat.state != EnumLoadState.More) {
				return
			}
			
			var index = getLastChatIndex(chat)
			let getnum = info.length + taskChatNum > chat.count ? chat.count - info.length : taskChatNum
			if (getnum <= 0) {
				chat.state = EnumLoadState.noMore
				return
			}
			chat.state = EnumLoadState.Loading
			var res = await apihandle.apiLoadTaskChat(tid,index - taskChatNum - chat.index,getnum)
			
			if (chat.head.length > 0) {
				chat.data.splice(0,0,...chat.head)
				info.length += chat.head.length
				chat.head = []
			}
			
			if (res?.data) {
				// console.log("loadMoreChat ",res,info.length)
				// var list = this.getters.getTaskChatById(tid)
				if (res.data.length < taskChatNum) {
					chat.state = EnumLoadState.noMore
				}else{
					chat.state = EnumLoadState.More
				}
				chat.data.push(...res.data.reverse())
				return chat.data.slice(info.length,info.length+taskChatNum)
			}else{
				chat.state = EnumLoadState.noMore
			}
		},
	}
}
