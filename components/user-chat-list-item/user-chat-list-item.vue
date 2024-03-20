<template>
	<view>
		<uni-list-chat v-if="user" :avatar-circle="true" :title="user.name" :avatar="icon" 
		:note="chatString" :time="timeString" @click="toChatPage" clickable>
		</uni-list-chat>
	</view>
</template>

<script>
import util_chat from '../../common/util_chat';
import util_common from '../../common/util_common';
import util_time from '../../common/util_time';
import store from '../../store';
	export default {
		name:"user-chat-list-item",
		emits:["click"],
		props:{
			cid:{
				require:true
			},
			customClick:{
				default:false
			}
		},
		data() {
			console.log("chat list data")
			return {
				user:null,
			};
		},
		created() {
			store.dispatch("getOtherUser",this.cid).then((res)=>{
				if (res) {
					this.user = res
				}
			})
		},
		computed:{
			chat() {
				let c = store.getters.getUserChatByCid(this.cid)
				return c.data[0]
			},
			icon() {
				return util_common.getIconUrl(this.user.icon)
			},
			timeString() {
				return util_time.diffString(this.chat.send_time)
			},
			chatString() {
				return util_chat.getShortContent(this.chat.content_type,this.chat.content)
			}
		},
		methods:{
			toChatPage() {
				if (this.customClick) {
					this.$emit("click",this.user)
					return
				}
				uni.navigateTo({
					url:`/pages/message/chat_user_page?cid=${this.cid}`
				})
			}
		}
	}
</script>

<style>

</style>