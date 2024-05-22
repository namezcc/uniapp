import apihandle from "../../common/api_handle"
import { EnumLoadState, ServerConfig, UpdateEventType } from "../../common/define_const"
import global_data from "../../common/global_data"
import util_common from "../../common/util_common"

async function loadTask(context,{skip,ref,usecash},listkey,statekey,loadfunc) {
	let state = context.state
	if (!context.getters.isLogin) {
		return
	}
	let list = state[listkey]
	if (state[statekey] == EnumLoadState.Loading) {
		return
	}
	let restask = []
	let getfunc = context.getters.getTaskById
	if (!ref || usecash) {
		let vec = list.slice(skip,ServerConfig.LoadTaskNum)
		if (vec.length > 0) {
			for (let id of vec) {
				restask.push(getfunc(id))
			}
			if (vec.length >= ServerConfig.LoadTaskNum) {
				return restask
			}
			skip += vec.length
			if (usecash) {
				return restask
			}
		}else if(state[statekey] == EnumLoadState.noMore){
			return []
		}
	}
	state[statekey] = EnumLoadState.Loading
	let loadnum = ServerConfig.LoadTaskNum - restask.length
	var res = await loadfunc(skip)
	if (res?.result != null) {
		// console.log(res)
		let taskvec = res.result
		for (let t of taskvec) {
			t.join = res.task_join.find((join)=>{
				return join.id == t.id
			})
		}
		context.commit("updateTaskData",taskvec)
		let idlist = res.tasklist.reverse()
		if (ref) {
			list = []
			state[listkey] = list
		}
		if (taskvec.length < loadnum) {
			state[statekey] = EnumLoadState.noMore
		}else{
			state[statekey] = EnumLoadState.More
		}
		if (listkey == "list_interest") {
			for (let id of idlist) {
				list.push(id)
				restask.push(getfunc(id))
			}			
		}else{
			for (let t of idlist) {
				list.push(t.id)
				restask.push(getfunc(t.id))
			}			
		}
	}else{
		state[statekey] = EnumLoadState.noMore
	}
	return restask
}

export default {
	state: {
		task_data: new Map(),
		list_home: [],
		list_join: [],
		list_my:[],
		list_interest:[],
		state_join: EnumLoadState.More,
		state_my: EnumLoadState.More,
		state_interest: EnumLoadState.More,
	},
	getters: {
		getTaskById: (state) => (id) => {
			var t = state.task_data.get(id)
			return t
		},
	},
	mutations: {
		updateTaskData(state,data) {
			for (let t of data) {
				state.task_data.set(t.id,t)
			}
		},
		updateTaskOne(state,t) {
			// state.task_data.set(t.id,{...t})
			state.task_data.set(t.id,t)
			// console.log("updateTaskOne ",t.id)
			// uni.$emit(UpdateEventType.Task,t.id)
		},
		deleteInterestTask(state,id) {
			util_common.deleteArrayByVal(state.list_interest,id)
		},
		onKickOutTask(state,d) {
			uni.$emit("onKickOutTask",d.id)
			let task = state.task_data.get(d.id)
			if (task && task.join) {
				util_common.deleteArrayByFunc(task.join.data,(j)=>{
					if (j.cid == global_data.cid) {
						return true
					}
					return false
				})
				// state.task_data.delete(d.id)
			}
		},
		deleteJoinTask(state,id) {
			util_common.deleteArrayByVal(state.list_join,id)
			uni.$emit("onDeleteTaskJoin")
			apihandle.apiDeleteUserJoin(id)
		},
		deleteMyTask(state,id) {
			util_common.deleteArrayByVal(state.list_my,id)
			uni.$emit("onDeleteTaskMy")
			apihandle.apiDeleteMyTaskInfo(id)
		},
	},
	actions: { 
		async loadTaskOne(context,id) {
			var res = await apihandle.apiGetOneTaskInfo(id)
			if (res) {
				// console.log("get task ",res)
				context.commit("updateTaskOne",res)
			}
			return res
		},
		async getTaskInfo(context,id) {
			let task = context.getters.getTaskById(id)
			if (task) {
				return task
			}
			var res = await apihandle.apiGetOneTaskInfo(id)
			if (res) {
				// console.log("get task ",res)
				context.commit("updateTaskOne",res)
			}
			return res
		},
		async loadTaskJoin(context,info) {
			return loadTask(context,info,"list_join","state_join",apihandle.apiLoadMyJoinTaskInfo.bind(apihandle))
		},
		async loadTaskMy(context,info) {
			return loadTask(context,info,"list_my","state_my",apihandle.apiLoadMyTaskInfo.bind(apihandle))
		},
		async loadTaskInterest(context,info) {
			return loadTask(context,info,"list_interest","state_interest",apihandle.apiLoadInterestTask.bind(apihandle))
		}
	}
}
