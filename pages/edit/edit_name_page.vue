<template>
	<view class="col-class">
		<view style="margin: 10px;padding: 5px;background-color: #fff;border-radius: 10px;">
			<uv-input type="text" v-model="txtName" border="none"></uv-input>
		</view>
		<view style="margin: 0px 15px;">
			<text class="tip">2-15个字符</text>
		</view>
		<view style="height: 100%;"></view>
		<view style="margin: 10px;">
			<button class="fill-btn-primary" @click="onSave">保存</button>
		</view>
		<view style="height: 50px;"></view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import store from "@/store/index.js"
import apihandle from "../../common/api_handle"
	
	export default {
		data() {
			return {
				txtName:""
			}
		},
		onLoad(e) {
			this.txtName = e.name
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
		},
		methods: {
			onSave() {
				let len = this.txtName.length
				if (len <= 0 || len > 15) {
					apihandle.toast("昵称不符合规则")
					return
				}
				if (this.txtName == this.user.name) {
					uni.navigateBack()
					return
				}
				apihandle.apiEditName(this.txtName).then((res)=>{
					if (res) {
						apihandle.toast("修改成功")
						store.commit("setUserName",this.txtName)
						uni.navigateBack()
					}else{
						apihandle.toast("操作失败,请重试")
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
	
	.tip {
		color: $uni-base-color;
		font-size: 14px;
	}
	
</style>
