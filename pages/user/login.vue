<template>
	<view class="center" :style="{height: winHeight+'px'}">
		<view class="input-phone">
			<mycol mainAlign="center">
				<myrow mainAlign="center">
					<uni-easyinput :primaryColor="colorTheme.primary" @input="onPhoneInput" :maxlength="11" type="number" placeholder="手机号"/>
				</myrow>
				<view style="height: 20px;width: 100%;"></view>
				<myrow mainAlign="center">
					<uni-easyinput :primaryColor="colorTheme.primary" @input="onCodeInput" type="number" :maxlength="6" placeholder="验证码" />
					<uv-code ref="ucode" @change="onCodeChange" change-text="X" @start="codeDisabled = true" @end="codeDisabled = false" ></uv-code>
					<button @click="getPhoneCode" type="warn" :style="{backgroundColor:colorTheme.primary,marginLeft: '20px',width:'100px'}" size="mini" :disabled="codeDisabled">{{codeTip}}</button>
				</myrow>
				<view style="height: 40px;width: 100%;"></view>
				<button @click="login" type="warn" class="login-btn" :style="{backgroundColor:colorTheme.primary}" >登录</button>
			</mycol>
		</view>
	</view>
</template>

<script>
	import util from "@/common/util_common.js"
	import {color as theme} from "@/common/theme.js"
	import api from "@/common/api_handle.js"
	import store from "@/store/index.js"
	import { ErrCode } from "../../common/define_const"
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
			}
		},
		onLoad() {
			util.getSystemInfo((res)=>{
				this.winHeight = res.windowHeight
			})
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
				if (!this.$refs.ucode.canGetCode) {
					return
				}
				if (this.phone.length == 0) {
					api.toast("手机号错误")
				}else{
					api.once("apiGetPhoneCode",(unlock)=>{						
						api.apiGetPhoneCode(this.phone).then((res)=>{
							if (res && res.code == ErrCode.SUCCESS) {
								this.$refs.ucode.start()
								api.toast("验证码已发送 "+res.data)
							}
							unlock();
						})
					})
				}
			},
			login() {
				if (this.phone.length == 0) {
					api.toast("手机号错误")
				}else if(this.code.length == 0){
					api.toast("验证码错误")
				}else{
					api.once("apiUserLogin",(unlock)=>{
						api.apiUserLogin(this.phone,this.code).then((res)=>{
							if (res) {
								console.log(res)
								store.commit("login",res.data)
								api.toast("登录成功")
								uni.navigateBack()
							}
							unlock();
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.center {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	.input-phone {
		margin: 20px;
	}
	
	.login-btn {
		width: 100%;
		font-size: 15px;
		border-radius: 30px;
	}
</style>
