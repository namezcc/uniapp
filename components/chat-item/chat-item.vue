<template>
	<view class="chat-item">
		<mycol>
			<text v-if="showTime" class="text-time">{{timeString}}</text>
			<myrow itemAlign="flex-start">
				<template v-if="isSelf">
					<expanded></expanded>
				</template>
				<template v-else>
					<avatar :usercid="chat.cid" :tocid="chat.cid" :inpage="inpage"></avatar>
				</template>
				<view style="margin: 0rpx 20rpx;">				
					<mycol :itemAlign="nameAlign">
						<template v-if="showName">
							<text class="user-name">{{chat.sendername}}</text>
						</template>
						<view v-else style="height: 10px;"></view>
						<myrow>
							<uni-icons type="info-filled" size="20" color="#e43d33" v-if="chat.sendfail==true"></uni-icons>
							<chat-item-content :chat="chat" :self="isSelf"></chat-item-content>
						</myrow>
					</mycol>
				</view>
				<template v-if="isSelf">
					<avatar :usercid="chat.cid"></avatar>
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
				// console.log("showname ",this.showName)
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

<style lang="scss">
	.chat-item {
		margin: 30rpx;
	}
	
	.user-name {
		font-size: 28rpx;
		/* color: grey; */
		color: $uni-secondary-color;
	}
	
	.text-time {
		font-size: 28rpx;
		// color: grey;
		color: $uni-secondary-color;
		margin: 16rpx;
	}

</style>