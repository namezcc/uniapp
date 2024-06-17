<template>
	<view class="" style="width: 100%;">
		<uni-card margin="5px">
			<template v-slot:title>
				<view style="margin-top: 10px">
					<myrow>
						<avatar :src="icon" :usercid="task.cid"/>
						<!-- <text>{{task.creator_name}}</text> -->
						<expanded/>
						<view class="boxText" style="font-size: 26rpx;" v-if="sexlimitType == 0">限女生</view>
						<view class="boxText" style="font-size: 26rpx;" v-if="sexlimitType == 1">限男生</view>
						<view style="margin-left: 20rpx;">
							<text>报名 </text>
							<text style="color: #f4d1b9;">{{numinfo[0]}}</text>
							<text>/{{numinfo[1]}}</text>
						</view>
						<view v-if="myTask" style="margin-left: 10px;"  @click.stop="showMoreAction">
							<uni-icons type="more-filled"></uni-icons>
						</view>
						<!-- <mycol>
							<text-tag :text="taskStateString" :theme="taskStateTheme"></text-tag>
						</mycol> -->
					</myrow>
				</view>
				<view style="margin-top: 10px;">
					<uv-line></uv-line>
				</view>
			</template>
			<myrow itemAlign="flex-start" :wrap="false">
				<text style="white-space: pre-wrap;" class="task-title">{{task.title}}</text>
				<expanded></expanded>
				<view style="margin-left: 5px;"></view>
				<view v-if="haveReward" class="boxText">赏</view>
				<text :style="{fontSize: '16px',color: theme.primary,whiteSpace: 'nowrap'}" >{{taskMoney}}</text>
			</myrow>
			<view class="text-chat" v-if="taskChat">
				<myrow>
					<text>{{taskChatString}}</text>
					<expanded></expanded>
					<text>{{taskChatTime}}</text>
					<uni-badge :text="taskUnReadNum" type="error"></uni-badge>
				</myrow>
			</view>
			<view class="" style="margin-top: 6rpx;">
				<myrow>
					<text-tag :text="taskStateString" :theme="taskStateTheme"></text-tag>
					<expanded></expanded>
					<view class="" @click.stop="deleteJoin" v-if="showDelete">
						<uni-icons type="closeempty" ></uni-icons>
					</view>
				</myrow>
			</view>
		</uni-card>
	</view>
</template>

<script>
	import utiltask from "@/common/util_task.js"
	import {color as theme} from "@/common/theme.js"
import store from "../../store";
import util_chat from "../../common/util_chat";
import util_time from '@/common/util_time';
import util_task from "@/common/util_task.js";
import global_data from "../../common/global_data";
import { TaskShowState } from "../../common/define_const";
import apihandle from "../../common/api_handle";
	
	export default {
		name:"task-chat-item",
		emits: ['clickClose'],
		props: {
			task: {
				type: Object,
				require: true,
			},
		},
		data() {
			return {
				theme:theme,
				icon:"",
			};
		},
		mounted() {
			store.dispatch("getOtherUser",this.task.cid).then((res)=>{
				if (res) {
					this.icon = res.icon
					// console.log("user icon ",res.icon)
				}
			})
		},
		computed:{
			numinfo() {
				let num = utiltask.getJoinNum(this.task)
				return [num[0]+num[1],this.task.people_num]
			},
			sexlimitType() {
				return utiltask.getLimitSex(this.task)
			},
			taskMoney() {
				return utiltask.getMoneyString(this.task)
			},
			haveReward() {
				return utiltask.haveRewardMoney(this.task)
			},
			taskDistance() {
				if (this.task.address == null) {
					return "";
				}else{
					var loc = this.location()
					if (loc == null) {
						return this.task.address.cityname || ""
					}else{
						return utiltask.getDistanceString(this.location(),this.task.address)
					}
				}
			},
			taskChat() {
				let tchat = store.getters.getTaskChatById(this.task.id)
				return tchat.data.length == 0 ? null : tchat.data[0]
			},
			taskChatString() {
				let chat = this.taskChat
				return chat == null ? null : (chat.sendername +": "+ util_chat.getShortContent(chat.content_type,chat.content))
			},
			taskChatTime() {
				return util_time.diffString(this.taskChat.send_time)
			},
			taskUnReadNum() {
				let num = store.getters.getTaskChatUnReadNum(this.task.id)
				// console.log("task unread ",num)
				return num
			},
			taskStateString() {
				let state = util_task.getTaskState(this.task,global_data.cid)
				switch (state){
					case TaskShowState.Open:
						return "进行中";
					case TaskShowState.InCheck:
						return "审核中";
					case TaskShowState.CheckFail:
						return "审核失败";
					case TaskShowState.TaskTimeEnd:
						return "已结束";
					case TaskShowState.TaskDelete:
						return "已解散";
					case TaskShowState.Kicked:
						return "被踢出";
					case TaskShowState.Illegal:
						return "已下架";
					case TaskShowState.Finish:
						return "已完成";
					default:
						break;
				}
				return "进行中"
			},
			taskStateTheme() {
				let state = util_task.getTaskState(this.task,global_data.cid)
				switch (state){
					case TaskShowState.Open:
						return "success";
					case TaskShowState.InCheck:
						return "warning";
					case TaskShowState.CheckFail:
						return "error";
					case TaskShowState.TaskTimeEnd:
						return "grey";
					case TaskShowState.TaskDelete:
						return "grey";
					case TaskShowState.Kicked:
						return "grey";
					case TaskShowState.Illegal:
						return "error";
					case TaskShowState.Finish:
						return "grey";
					default:
						break;
				}
				return "grey"
			},
			showDelete() {
				let state = util_task.getTaskState(this.task,global_data.cid)
				if (state == TaskShowState.Kicked || state == TaskShowState.TaskDelete || state == TaskShowState.Illegal) {
					return true
				}
				return false
			},
			myTask() {
				return this.task.cid == global_data.cid
			},
		},
		methods:{
			deleteJoin() {
				// uni.showModal({
				// 	title:"删除任务",
				// 	content:`确认删除任务: ${this.task.title} 吗?`,
				// 	success: (res) => {
				// 		if (res.confirm) {
				// 			console.log("delete join")
				// 			store.commit("deleteJoinTask",this.task.id)
				// 		}
				// 	}
				// })
				this.$emit("clickClose")
			},
			finishTask() {
				let state = util_task.getTaskState(this.task,global_data.cid)
				if (state != TaskShowState.Open) {
					apihandle.toast("进行中才可完成")
					return
				}
				uni.showModal({
					title:"完成任务",
					content:`确定完成: ${this.task.title} 吗? 任务完成后不可在报名`,
					success: (res) => {
						if (res.confirm) {
							store.commit("finishMyTask",this.task.id)
						}
					}
				})
			},
			deleteTask() {
				uni.showModal({
					title:"删除任务",
					content:`确认删除任务: ${this.task.title} 吗?`,
					success: (res) => {
						if (res.confirm) {
							console.log("delete join")
							// store.commit("deleteJoinTask",this.task.id)
							store.commit("deleteMyTask",this.task.id)
						}
					}
				})
			},
			showMoreAction() {
				uni.showActionSheet({
					itemList:["完成任务","取消任务"],
					success: (i) => {
						// console.log("share ",i.tapIndex)
						switch (i.tapIndex){
							case 0:
								this.finishTask()
								break;
							case 1:
								this.deleteTask()
								break;
						}
					},
					fail() {
					}
				})
			}
		},
		options: {
			multpleSlots: true,
			styleIsolation: "shared",
			addGlobalClass: true,
			virtualHost: true,
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	.uni-card {
		border-radius: 10px;
	}
	
	.text-chat {
		font-size: 14px;
		color: #999;
	}
</style>