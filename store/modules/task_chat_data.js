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
		task_chat_read: new Map(),
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
		getTaskChatUnReadNum: (state)=> (taskid)=> {
			let tc = state.task_chat_data.get(taskid)
			if (tc && tc.data.length > 0 && tc.data[0].cid == global_data.cid) {
				return 0
			}
			let cindex = tc?.index || 0
			let num = cindex - (state.task_chat_read.get(taskid) || 0)
			return Math.min(num,99)
		}
	},
	mutations: {
		onLoadTaskChatRead(state,vec) {
			for (let v of vec) {
				state.task_chat_read.set(v.taskid,v.index)
			}
		},
		sendTaskChat(state,data) {
			var chat = this.getters.getTaskChatById(data.id)
			if (data.trynum == null) {
				var list = chat.data
				list.splice(0,0,data.chat)
			}
			wsconn.sendJsonData(CmId.TASK_CHAT,{
				id:data.id,
				data:[data.chat]
			},(res)=>{
				if (!res) {					
					// 重试
					if ((data.trynum || 0) >= 1) {						
						apihandle.toast("发送失败,请检查网络")
						data.chat.sendfail = true
					}else{
						data.trynum = (data.trynum || 0) + 1
						setTimeout(()=>{
							this.commit("sendTaskChat",data)
						},5000)
					}
				}
			})
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
				// var sended = mySendChat.splice(0,1)
				// for (var i = 0; i < chat.data.length; i++) {
				// 	let c = chat.data[i]
				// 	if (c == sended) {
				// 		chat.data[i] = netchat
				// 		break
				// 	}
				// }
				this.commit("saveTaskChatIndex",data.id)
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
					chat.data = t.data || []
				}
			}
			// 断线重连清除数据重新加载
			uni.$emit("reloadTaskChatData")
		},
		saveTaskChatIndex(state,taskid) {
			let tc = this.getters.getTaskChatById(taskid)
			let index = tc.index
			if (index <= (state.task_chat_read.get(taskid) || 0) ) {
				return
			}
			state.task_chat_read.set(taskid,index)
			global_data.setTaskReadIndex(taskid,index)
			if (!global_data.task_chat_read_saveing) {
				// 延迟保存3s
				setTimeout(()=>{
					wsconn.saveTaskChatIndex(global_data.task_chat_read_save)
					global_data.task_chat_read_save.clear()
					global_data.task_chat_read_saveing = false
				},3000)
			}
		}
	},
	actions: { 
		async loadMoreChat(context,info) {
			let tid = info.id
			var chat = this.getters.getTaskChatById(tid)
			if (chat.state == EnumLoadState.Loading) {
				return
			}
			
			let lessnum = chat.data.length - info.length 	//剩余数量
			let downloadnum = 0 							//需要下载数量
			if (lessnum < taskChatNum) {
				downloadnum = taskChatNum - lessnum
			}
			// if (lessnum <= 0 && chat.state == EnumLoadState.noMore) {
			// 	return
			// }
			if (downloadnum > 0 && chat.state == EnumLoadState.More) {
				// 判断可下载数量
				let index = getLastChatIndex(chat)
				// if (downloadnum > 0) {
				// }
				chat.state = EnumLoadState.Loading
				let onlinenum = chat.count - (chat.index - index)
				if (onlinenum < taskChatNum) {
					downloadnum = onlinenum
				}else{
					downloadnum = taskChatNum
				}
				if (downloadnum == 0) {
					return
				}
				var res = await apihandle.apiLoadTaskChat(tid,index - taskChatNum - chat.index,downloadnum)
				
				if (chat.head.length > 0) {
					chat.data.splice(0,0,...chat.head)
					info.length += chat.head.length
					chat.head = []
				}
				if (res?.data) {
					if (chat.index != res.index) {
						context.commit("saveTaskChatIndex",chat.id)
					}
					
					chat.count = res.count
					chat.index = res.index
					
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
					if (reslen < taskChatNum) {
						chat.state = EnumLoadState.noMore
					}else{
						chat.state = EnumLoadState.More
					}
					chat.data.push(...res.data.reverse())
				}else{
					chat.state = EnumLoadState.noMore
				}
			}
			return chat.data.slice(info.length,info.length+taskChatNum)
		},
	}
}
