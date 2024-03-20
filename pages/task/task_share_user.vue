<template>
	<view>
		<page-user-chat :tabIndex="0" :currentIndex="0" :customClick="true">
			<template #default="{item}">
				<user-chat-list-item :cid="item" :customClick="true" @click="shareToUser"/>
			</template>
		</page-user-chat>
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
				task:null,
			}
		},
		onLoad(d) {
			this.task = store.getters.getTaskById(d.id)
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
		},
		methods: {
			shareToUser(touser) {
				let cid = touser.cid
				console.log("share to ",cid)
				uni.showActionSheet({
					alertText:`分享到 ${touser.name}`,
					itemList:["确定"],
					success: () => {
						// console.log("share ",task.title)
						let chat = util_chat.makeTaskInfo(this.task,this.user)
						store.commit("sendUserChat",{cid,chat})
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
