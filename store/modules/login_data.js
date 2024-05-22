import api from "@/common/api_handle.js"
import util_time from "../../common/util_time"
import wsconn from "../../common/wsconn"

export default {
	state: {
		token:"",
	},
	getters: {
		isLogin: state => {
			return state.token.length > 0
		}
	},
	mutations: {
		setLogoutToken(state) {
			console.log("logout token")
			state.token = ""
			uni.setStorageSync("token","")
			wsconn.close()
		},
		loadToken(state) {
			state.token = uni.getStorageSync("token")
			var tokentime = uni.getStorageSync("tokentime") || 0
			console.log("load token ",state.token)
			if (state.token.length > 0) {
				api.setToken(state.token)
				var now = util_time.getSecond()
				if (now > tokentime || true) {
					// 刷新token
					this.dispatch("refreshToken")
				}else{
					this.dispatch("getUserData")
					// websocket 链接
					wsconn.connectServer(state.token)
				}
			}
		},
		login(state,token) {
			state.token = token;
			console.log("save token ",token)
			uni.setStorageSync("token",token)
			if (token == "" || !token) {
				return
			}
			var outime = util_time.getSecond() + 3600*24 	//每天刷新
			uni.setStorageSync("tokentime",outime)
			this.dispatch("getUserData")
			// websocket 链接
			wsconn.connectServer(state.token)
		}
	},
	actions: { 
		refreshToken(context) {
			console.log("refreshToken");
			api.apiUserRefreshToken(context.state.token).then((res)=>{
				if (res) {
					// console.log(res)
					context.commit("login",res.data)
				}else{
					context.commit("login","")
				}
			}).catch(e=>{
				context.commit("login","")
			})
		}
	}
}
