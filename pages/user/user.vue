<template>
	<view style="height: 100%;">
		<scroll-view scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh" :refresherTriggered="refreshFinish"
		style="height: 100%;">
			<myrow>
				<avatar :src="user.icon"></avatar>
				<text>{{user.name}}</text>
				<expanded></expanded>
				<text>{{user.money}}</text>
			</myrow>
			<myrow>
				<button @click="toEditPage">编辑资料</button>
				<button @click="toHistoryPage">浏览记录</button>
				<button @click="toSettingPage">设置</button>
			</myrow>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import store from "@/store/index.js"
import apihandle from "../../common/api_handle"
	
	export default {
		data() {
			return {
				refreshFinish:false,
			}
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
		},
		methods: {
			onPullDownRefresh() {
				this.refreshFinish = true
				apihandle.apiGetUserInfo().then((res)=>{
					if (res) {
						store.commit("setUser",res)
					}
					this.refreshFinish = false
				})
			},
			toEditPage() {
				uni.navigateTo({
					url:"/pages/edit/edit_page"
				})
			},
			toHistoryPage() {
				
			},
			toSettingPage() {
				uni.navigateTo({
					url:"/pages/setting/setting_page"
				})
			}
		}
	}
</script>

<style>

</style>
