var global_data = {
	user:{},
	cid:0,
	setUser(user) {
		this.user = user
		this.cid = user.cid
	}
}

export default global_data