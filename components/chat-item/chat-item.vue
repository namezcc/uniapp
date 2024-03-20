<template>
	<view class="chat-item">
		<mycol>
			<text v-if="showTime" class="text-time">{{timeString}}</text>
			<myrow itemAlign="flex-start">
				<template v-if="isSelf">
					<expanded></expanded>
				</template>
				<template v-else>
					<avatar :src="chat.sendericon" :tocid="chat.cid" :inpage="inpage"></avatar>
				</template>
				<view style="margin: 0rpx 20rpx;">				
					<mycol :itemAlign="nameAlign">
						<template v-if="showName">
							<text class="user-name">{{chat.sendername}}</text>
						</template>
						<chat-item-content :chat="chat" :self="isSelf"></chat-item-content>
					</mycol>
				</view>
				<template v-if="isSelf">
					<avatar :src="chat.sendericon"></avatar>
				</template>
				<template v-else>
					<expanded></expanded>
				</template>
			</myrow>
		</mycol>
	</view>
</template>

<script>
	import { mapState } from "vuex"
import { PageType } from "../../common/define_const";
import util_time from "../../common/util_time";
	
	export default {
		name:"chat-item",
		props:{
			chat:{
				require:true
			},
			lastChatTime:{
				default:0
			},
			showName:{
				default:true
			},
			inpage:{
				default:0
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			...mapState({
				user: s=> s.user_data.user
			}),
			isSelf() {
				return this.user.cid == this.chat.cid
			},
			nameAlign() {
				return this.isSelf ? "flex-end":"flex-start"
			},
			showName2() {
				console.log("showname ",this.showName)
				return this.showName
			},
			showTime() {
				return this.chat.send_time > this.lastChatTime + 300
			},
			timeString() {
				return util_time.diffString(this.chat.send_time)
			}
		}
		
	}
</script>

<style>
	.chat-item {
		margin: 30rpx;
	}
	
	.user-name {
		font-size: 30rpx;
		color: grey;
	}
	
	.text-time {
		font-size: 20rpx;
		color: grey;
	}

</style>