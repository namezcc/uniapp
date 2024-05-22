var global_data = {
	user:{},
	cid:0,
	user_chat_read_save:new Map(),
	user_chat_read_saveing: false,
	
	task_chat_read_save:new Map(),
	task_chat_read_saveing: false,
	
	setUser(user) {
		this.user = user
		if (user) {
			this.cid = user.cid
		}else{
			this.cid = 0
		}
	},
	isLogin() {
		return this.cid > 0
	},
	setUserReadIndex(tocid,index) {
		this.user_chat_read_save.set(tocid,index)
	},
	setTaskReadIndex(taskid,index) {
		this.task_chat_read_save.set(taskid,index)
	}
}

export default global_data