import apihandle from "../../common/api_handle"
import { EnumLoadState, ServerConfig, UpdateEventType } from "../../common/define_const"
import util_common from "../../common/util_common"

async function loadTask(context,{skip,ref,usecash},listkey,statekey,loadfunc) {
	let state = context.state
	let list = state[listkey]
	if (usecash) {
		return list
	}
	if (state[statekey] == EnumLoadState.Loading) {
		return
	}
	if (!ref) {
		let vec = list.slice(skip,ServerConfig.LoadTaskNum)
		if (vec.length > 0) {
			let res = []
			for (let id of vec) {
				res.push(context.getters.getTaskById(id))
			}
			return res
		}
		if (state[statekey] == EnumLoadState.noMore) {
			return []
		}
	}
	state[statekey] = EnumLoadState.Loading
	var res = await loadfunc(skip)
	if (res) {
		res = res.reverse()
		context.commit("updateTaskData",res)
		if (ref) {
			state[listkey] = []
		}
		if (res.length < ServerConfig.LoadTaskNum) {
			state[statekey] = EnumLoadState.noMore
		}else{
			state[statekey] = EnumLoadState.More
		}
		for (let t of res) {
			list.push(t.id)
		}
	}else{
		state[statekey] = EnumLoadState.noMore
	}
	// console.log(res)
	return res
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
		}
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
