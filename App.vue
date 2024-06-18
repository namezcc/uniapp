<script>
	import store from "@/store/index.js"
import apihandle from "./common/api_handle"
import util_emoji from "./common/util_emoji"
import wsconn from "./common/wsconn"

	// uni.onError((res)=>{
	// 	console.log("geterror:",res)
	// })

	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
			// util_emoji.initEmoji()
			store.commit("loadToken")
			// wsconn
			wsconn.init()
		},
		onError:function(err){
			try{
				// console.log("geterror ****:" + err)
				if (process.env.NODE_ENV != "development") {
					// 上报错误
					let errinfo = {
						msg:err.message,
						stack:err.stack,
						all:" " + err,
					}
					apihandle.apiAppError(JSON.stringify(errinfo))
					// #ifdef MP-WEIXIN
						let log = uni.getRealtimeLogManager()
						if (log) {
							log.info(err)
						}
					// #endif
				}				
			}catch(e){
				//TODO handle the exception
				console.log(e.message)
			}
		},
		onShow: function() {
			console.log("env ",process.env.NODE_ENV)
			if (process.env.NODE_ENV == "development") {
				console.log("in debug")
			}else{
				console.log("in relese")
			}
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uv-ui-tools/index.scss';
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
		// background-color: #939396;
		width: 100%;
		height: 100%;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
