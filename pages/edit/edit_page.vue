<template>
	<view>
		<view style="margin-top: 20px;"></view>
		<view class="class-ceter">
			<!-- #ifndef MP-WEIXIN -->
				<view class="avator-box">
					<button @click="onChooseIcon" class="button-avator">				
						<avatar :src="user.icon" :radius="75"></avatar>
					</button>
					<uni-icons type="camera" class="camera-icon" :size="30"></uni-icons>
				</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
				<view class="avator-box">					
					<button @chooseavatar="onChooseAvatar" open-type="chooseAvatar" class="button-avator">
						<avatar :src="user.icon" :radius="75"></avatar>
					</button>
					<uni-icons type="camera" class="camera-icon" :size="30"></uni-icons>
				</view>
			<!-- #endif -->
		</view>
		<view class="card">			
			<uv-cell-group :border="false">
				<uv-cell title="昵称" :isLink="true" @click="toEditName" :value="user.name"></uv-cell>
				<!-- <uv-cell title="性别" :isLink="true" @click="toEditSex" :value="sex"></uv-cell> -->
				<uv-cell title="实名验证" :isLink="true" @click="toEditIdCard" :value="idcard" :border="false"></uv-cell>
			</uv-cell-group>
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
				util_common.uploadFile(e.detail.avatarUrl,e.detail.avatarUrl,(url)=>{
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
								apihandle.toast("操作失败,请重试")
								// uni.navigateBack()
							}
						})
					}else{
						apihandle.toast("操作失败,请重试")
						// uni.navigateBack()
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
	
	button::after{
		border: none;
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
	}
	
	.camera-icon {
		position: absolute;
		right: 0;
		bottom: 0;
	}
	
	.card {
		border-radius: 10px;
		background-color: #fff;
		margin: 20px 10px;
	}
	
</style>
