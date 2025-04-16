<template>
	<view>
		<view class="top-background-color top-bg" style="width: 100%;"></view>
		<my-top-bar bgcolor="transparent" title="编辑资料"></my-top-bar>
		<view style="position: absolute;z-index: 3;width: 100%;">			
			<view style="height: 100px;"></view>
			<view style="border-radius: 26px 26px 0px 0px;width: 100%;background-color: #F8F8F8;">
				<view class="class-ceter">
					<!-- #ifndef MP-WEIXIN -->
						<view class="avator-box">
							<button @click="onChooseIcon" class="button-avator">				
								<avatar :src="user.icon" :radius="75" outline="3px"></avatar>
							</button>
							<view style="background-color: #000;padding: 3px 3px;border-radius: 50%;" class="camera-icon">
								<uni-icons type="camera-filled"  color="#15FA8B" :size="17"></uni-icons>
							</view>
						</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
						<view class="avator-box">					
							<button @chooseavatar="onChooseAvatar" open-type="chooseAvatar" class="button-avator">
								<avatar :src="user.icon" :radius="75" outline="3px"></avatar>
							</button>
							<view style="background-color: #000;padding: 3px 3px;border-radius: 50%;" class="camera-icon">
								<uni-icons type="camera-filled"  color="#15FA8B" :size="17"></uni-icons>
							</view>
						</view>
					<!-- #endif -->
				</view>
				<myrow mainAlign="center">
					<text class="text-name" style="margin: 8px 8px;">{{user.name}}</text>
					<sex-icon :sex="sex" :size="16"></sex-icon>
				</myrow>
				<myrow>
					<image src="@/static/icon_tip.png" style="width: 37px;height: 26px;margin-left: 16px;"></image>
					<text class="tip-text" style="margin-left: 8px;">请完善资料</text>
				</myrow>
				<view class="card">			
					<uv-cell-group :border="false">
						<uv-cell title="昵称" :isLink="true" @click="toEditName" :value="user.name" :border="false">
							<template v-slot:title>
								<text class="cell-title">昵称</text>
							</template>
						</uv-cell>
						<uv-cell title="实名验证" :isLink="true" @click="toEditIdCard" :value="idcard" :border="false">
							<template v-slot:title>
								<text class="cell-title">实名验证</text>
							</template>
						</uv-cell>
					</uv-cell-group>
				</view>
				<view style="height: 200px;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
import apihandle from "../../common/api_handle"
import { EnumSex } from "../../common/define_const"
import http_util from "../../common/http_util"
import util_common from "../../common/util_common"
import util_string from "../../common/util_string"
import util_task from "../../common/util_task"
import store from "../../store"
	
	export default {
		data() {
			return {
				// errtxt:""
			}
		},
		onLoad(e) {
			if (e.tip == 1) {
				apihandle.toast("请设置头像和昵称")
			}
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
			sex() {
				return this.user.sex == EnumSex.MAN ? "男" :"女"
			},
			idcard() {
				return this.user.age > 0 ? "(已完成)" : "(未完成)"
			}
		},
		methods: {
			onChooseIcon() {
				// console.log("onChooseIcon")
				uni.chooseImage({
					count:1,
					sourceType: ['album'],
					success: (cres) => {
						const tempFilePaths = cres.tempFilePaths;
						uni.navigateTo({
							url:`/pages/edit/icon_crop?src=${tempFilePaths[0]}`
						})
					}
				})
			},
			onChooseAvatar(e) {
				console.log("onChooseAvatar",e)
				uni.showLoading({
					title:"上传中..."
				})
				util_common.uploadFile(e.detail.avatarUrl,e.detail.avatarUrl,(url,err)=>{
					uni.hideLoading()
					if (url) {
						// console.log("url ",url)
						apihandle.apiSetUserIcon(url).then((setres)=>{
							console.log("apiSetUserIcon setres",setres)
							if (setres) {
								store.commit("setUserIcon",url)
								apihandle.toast("设置成功")
								// uni.navigateBack()
							}else{
								apihandle.toast("操作失败请重试")
								// uni.navigateBack()
							}
						})
					}else{
						apihandle.toast("操作失败,请重试")
						// uni.navigateBack()
						// if (err) {
						// 	this.errtxt = err.toString()
						// }
					}
				})
				
				// http_util.uploadImage(e.detail.avatarUrl,(res)=>{
				// 	if (res) {
				// 		let uploaddata = JSON.parse(res.data)
				// 		let url = util_task.getImageUrlName(uploaddata.data)
				// 		console.log("url ",url)
				// 		apihandle.apiSetUserIcon(url).then((setres)=>{
				// 			console.log("apiSetUserIcon setres",setres)
				// 			if (setres) {
				// 				store.commit("setUserIcon",url)
				// 				apihandle.toast("设置成功")
				// 				// uni.navigateBack()
				// 			}else{
				// 				apihandle.toast("操作失败,请重试")
				// 				// uni.navigateBack()
				// 			}
				// 		})
				// 	}else{
				// 		apihandle.toast("操作失败,请重试")
				// 		uni.navigateBack()
				// 	}
				// })
			},
			toEditName() {
				// console.log("user ",this.user)
				uni.navigateTo({
					url:"/pages/edit/edit_name_page?name="+this.user.name
				})
			},
			// toEditSex() {
			// 	uni.navigateTo({
			// 		url:"/pages/edit/edit_sex_page"
			// 	})
			// },
			toEditIdCard() {
				if (this.user.age > 0) {
					return
				}
				uni.navigateTo({
					url:"/pages/edit/edit_idcard_page"
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	page {
		background-color: #F8F8F8;
	}
	
	.top-bg {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 0;
		height: 300px;
	}
	
	button::after{
		border: none;
	}
	
	.text-name {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 18px;
		color: #333333;
		line-height: 25px;
		text-align: left;
		font-style: normal;
	}
	
	.button-avator {
		// height: 70px;
		// width: 70px;
		padding: 0px;
		border: none;
		outline: none;
		background-color: transparent;
		// position: relative;
	}
	
	.avator-box {
		position: relative;
		height: 80px;
		width: 80px;
		margin-top: -50px;
		background-color: transparent;
	}
	
	.camera-icon {
		position: absolute;
		right: 0;
		bottom: 0;
		height: 20px;
		width: 20px;
		display: flex; /* 开启flex布局 */
		justify-content: center; /* 水平居中对齐 */
		align-items: center; /* 垂直居中对齐 */
	}
	
	.card {
		border-radius: 10px;
		background-color: #fff;
		margin: 20px 10px;
	}
	
	.tip-text {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 14px;
		color: #737373;
		line-height: 20px;
		text-align: justify;
		font-style: normal;
	}
	
	.cell-title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 14px;
		color: #000000;
		line-height: 20px;
		text-align: left;
		font-style: normal;
	}
	
</style>
