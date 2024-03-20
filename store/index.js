// import Vue from "vue"
// import Vuex from "vuex"

import { createStore } from "vuex"

import task_data from "@/store/modules/task_list.js"
import user_data from "@/store/modules/user_data.js"
import login_data from "@/store/modules/login_data.js"
import task_chat_data from "@/store/modules/task_chat_data.js"
import user_chat_data from "@/store/modules/user_chat_data.js"


// Vue.use(Vuex)

const store = createStore({
	modules:{
		task_data,user_data,login_data,task_chat_data,user_chat_data
	},
	state:{
		
	},
	getters:{
		
	},
	// 只能同步函数
	mutations:{
		
	},
	actions:{
		
	}
})

export default store