<template>
	<view style="height: 100%;">
		<page-task-join v-if="join" :tabIndex="0" :currentIndex="0" :customClick="true" @clickTask="onTabTask"/>
		<page-task-my v-else :tabIndex="0" :currentIndex="0" :customClick="true" @clickTask="onTabTask"/>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import store from "@/store/index.js"
import util_chat from "../../common/util_chat"
import apihandle from "../../common/api_handle"
	
	export default {
		data() {
			return {
				join:true
			}
		},
		onLoad(d) {
			this.join = d.join == 1
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
		},
		methods: {
			onTabTask(task) {
				uni.showActionSheet({
					alertText:`分享到 ${task.title}`,
					itemList:["确定"],
					success: () => {
						// console.log("share ",task.title)
						let chat = util_chat.makeTaskInfo(task,this.user)
						store.commit("sendTaskChat",{id:task.id,chat:chat})
						apihandle.toast("已发送")
					},
					fail() {
					}
				})
			}
		}
	}
</script>

<style>

</style>
