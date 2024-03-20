<template>
	<view>
		<t-cropper mode="fixed" :imageUrl="src" :width="300" :height="300" @confirm="handleCrop" @cancel="onCancel"></t-cropper>
		<!-- <qf-image-cropper :showAngle="false" :src="src" @crop="handleCrop"></qf-image-cropper> -->
	</view>
</template>

<script>
import apihandle from '../../common/api_handle'
import http_util from '../../common/http_util'
import util_task from '../../common/util_task'
import store from '../../store'

	export default {
		data() {
			return {
				src:""
			}
		},
		onLoad(e) {
			this.src = e.src
		},
		methods: {
			handleCrop(e) {
				console.log("crop ",e)
				http_util.uploadImage(e.tempFilePath,(res)=>{
					if (res) {
						let uploaddata = JSON.parse(res.data)
						let url = util_task.getImageUrlName(uploaddata.data)
						// console.log("url ",url)
						apihandle.apiSetUserIcon(url).then((res)=>{
							if (res) {
								store.commit("setUserIcon",url)
								apihandle.toast("设置成功")
								uni.navigateBack()
							}else{
								apihandle.toast("操作失败,请重试")
								uni.navigateBack()
							}
						})
					}else{
						apihandle.toast("操作失败,请重试")
						uni.navigateBack()
					}
				})
			},
			onCancel() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	@import "@/uni.scss";
</style>
