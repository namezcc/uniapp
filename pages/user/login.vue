<template>
	<!-- <view class="center" style="height: 100%;"> -->
		<view class="input-phone" style="height: 100%;">
			<mycol mainAlign="center">
				<view style="height: 50px;"></view>
				<myrow mainAlign="center">
					<uni-easyinput v-if="showTestInput" :primaryColor="colorTheme.btn_primary" @input="onPhoneInput" :maxlength="11" type="number" placeholder="手机号"/>
					<view class="logo" v-if="!showTestInput">
						<!-- <text>帮  帮</text> -->
						<image style="width: 100px;height: 100px;border-radius: 10px;" :src="srchost+'src/app_icon.png'"></image>
					</view>
				</myrow>
				<view style="height: 30px;"></view>
				<text class="logo-txt">有困难,上帮帮</text>
				<view style="height: 20px;width: 100%;"></view>
				<!-- <myrow mainAlign="center">
					<uni-easyinput :primaryColor="colorTheme.primary" @input="onCodeInput" type="number" :maxlength="6" placeholder="验证码" />
					<uv-code ref="ucode" @change="onCodeChange" change-text="X" @start="codeDisabled = true" @end="codeDisabled = false" ></uv-code>
					<button @click="getPhoneCode" type="warn" :style="{backgroundColor:colorTheme.primary,marginLeft: '20px',width:'100px'}" size="mini" :disabled="codeDisabled">{{codeTip}}</button>
				</myrow> -->
				<expanded></expanded>
					<button v-if="showTestInput" @click="login" type="warn" class="login-btn" :style="{backgroundColor:colorTheme.btn_primary}" >一键登录</button>
					<button v-if="!showTestInput" type="warn" class="login-btn" :style="{backgroundColor:colorTheme.btn_primary}" 
					open-type="getPhoneNumber" @getphonenumber="getPhonenumber">手机号一键登录</button>
				<!-- #ifndef MP-WEIXIN -->
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<!-- #endif -->
				<view style="margin-top: 10px;" v-if="showOpenTest">
					<text v-if="!showTestInput" style="font-size: 14px;color: #ccc;" @click="openTestInput(true)">手动输入登录</text>
					<text v-if="showTestInput" style="font-size: 14px;color: #ccc;" @click="openTestInput(false)">返回自动登录</text>
				</view>
				<view style="margin-top: 20px;font-size: 14px;">					
					<myrow>
						<radio value="1" :checked="agree" style="transform:scale(0.7)" @click="onAgree"></radio>
						<text @click="onAgree">我已阅读并同意</text>
						<text class="agree-txt" @click="toPageYh">《用户协议》</text>
						<text class="agree-txt" @click="toPageYs">《隐私政策》</text>
					</myrow>
				</view>
				<view style="height: 100px;width: 100%;"></view>
				<!-- <uv-safe-bottom></uv-safe-bottom> -->
			</mycol>
		</view>
	<!-- </view> -->
</template>

<script>
	import util from "@/common/util_common.js"
	import {color as theme} from "@/common/theme.js"
	import api from "@/common/api_handle.js"
	import store from "@/store/index.js"
	import { ErrCode, SrcHost } from "../../common/define_const"
	// import {mapGetters} from "vuex"
	
	
	export default {
		data() {
			return {
				winHeight:0,
				colorTheme:theme,
				phone:"",
				code:"",
				codeTip:"",
				codeDisabled:false,
				agree:false,
				showTestInput:false,
				showOpenTest:false,
				opencode:"",
				srchost:SrcHost,
			}
		},
		onLoad() {
			// util.getSystemInfo((res)=>{
			// 	this.winHeight = res.windowHeight
			// })
			
			api.apiGetOpenTestInput().then((res)=>{
				if (res == 1) {
					this.showOpenTest = true
				}
			})
			
			this.getOpenCode()
		},
		methods: {
			onPhoneInput(val) {
				this.phone = val;
			},
			onCodeInput(val) {
				this.code = val;
			},
			onCodeChange(v) {
				this.codeTip = v
			},
			getPhoneCode() {
				// if (!this.$refs.ucode.canGetCode) {
				// 	return
				// }
				// if (process.env.NODE_ENV == "development") {
				// 	this.phone = "15757181901"
				// 	// #ifdef MP-WEIXIN
				// 		this.phone = "15757181904"
				// 	// #endif
				// }
				
				// if (this.phone.length == 0) {
				// 	api.toast("手机号错误")
				// }else{
				// 	api.once("apiGetPhoneCode",(unlock)=>{						
				// 		api.apiGetPhoneCode(this.phone).then((res)=>{
				// 			if (res && res.code == ErrCode.SUCCESS) {
				// 				// this.$refs.ucode.start()
				// 				// api.toast("验证码已发送 "+res.data)
				// 				this.code = res.data
				// 				this.login()
				// 			}
				// 			unlock();
				// 		})
				// 	})
				// }
			},
			openTestInput(res) {
				this.showTestInput = res
			},
			getOpenCode() {
				console.log("getOpenCode ")
				uni.login({
					provider:"weixin",
					fail:(res)=>{
						console.log("getOpenCode fail",res)
					},
					success:(res)=>{
						console.log("getOpenCode success",res)
						this.opencode = res.code
					}
				})
			},
			login() {
				if (!this.agree) {
					api.toast("请阅读并勾选用户协议")
					return
				}
				if (this.phone.length == 0 && process.env.NODE_ENV == "development") {
					this.phone = "15757181901"
					// #ifdef MP-WEIXIN
						this.phone = "15757181904"
					// #endif
				}
				if (this.phone.length == 0) {
					api.toast("手机号错误")
				}else{
					api.once("apiUserLogin",(unlock)=>{
						api.apiUserLogin(this.phone,this.opencode).then((res)=>{
							if (res) {
								console.log(res)
								store.commit("login",res.data.token)
								api.toast("登录成功")
								uni.navigateBack()
							}
							unlock();
						})
					})
				}
			},
			getPhonenumber(e) {
				if (!this.agree) {
					api.toast("请阅读并勾选用户协议")
					return
				}
				if (e.detail.code == null) {
					api.toast("获取手机号失败")
					console.log(e.detail)
					return
				}
				
				uni.showLoading({
					title:"登录中..."
				})
				api.once("userloginWxCode",(unlock)=>{
					api.userloginWxCode(e.detail.code,this.opencode).then((res)=>{
						if (res) {
							console.log(res)
							store.commit("login",res.data.token)
							uni.hideLoading()
							api.toast("登录成功")
							uni.navigateBack()
						}
						unlock();
					})
				})
			},
			onAgree() {
				this.agree = !this.agree
			},
			toPageYh() {
				uni.navigateTo({
					url:"/pages/web/web_xy_yh"
				})
			},
			toPageYs() {
				uni.navigateTo({
					url:"/pages/web/web_xy_ys"
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	.logo {
		border-radius: 10px;
		font-size: 28px;
		display: flex; /* 开启flex布局 */
		justify-content: center; /* 水平居中对齐 */
		align-items: center; /* 垂直居中对齐 */
		width: 100px;
		height: 100px;
		color: #fff;
		// background-color: $my-color-primary-second;
	}
	
	.logo-txt {
		color: $uni-main-color;
		font-size: 20px;
	}
	
	.center {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
	
	.input-phone {
		margin: 20px;
	}
	
	.login-btn {
		width: 80%;
		font-size: 15px;
		border-radius: 30px;
		// margin: 20px;
	}
	
	.agree-txt {
		color: $uni-error;
	}
</style>
