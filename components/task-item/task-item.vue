<template>
	<view class="" style="width: 100%;">
		<uni-card margin="5px">
			<template v-slot:title>
				<view style="margin-top: 10px">
					<myrow>
						<avatar :src="task.creator_icon"/>
						<view class="" style="margin-left: 8rpx;">							
							<mycol itemAlign="flex-start">
								<text class="txt-name">{{task.creator_name}}</text>
								<!-- <text class="txt-credit" v-if="creditScore">信用分:{{creditScore}}</text> -->
							</mycol>
						</view>
						<expanded/>
						<view class="boxText" style="font-size: 26rpx;" v-if="sexlimitType == 0">限女生</view>
						<view class="boxText" style="font-size: 26rpx;" v-if="sexlimitType == 1">限男生</view>
						<view style="margin-left: 20rpx;">							
							<text>报名 </text>
							<text style="color: #f4d1b9;">{{numinfo[0]}}</text>
							<text>/{{numinfo[1]}}</text>
						</view>
					</myrow>
				</view>
				<view style="margin-top: 10px;">
					<uv-line></uv-line>
				</view>
			</template>
			<myrow itemAlign="flex-start" :wrap="false">
				<mycol itemAlign="flex-start">
					<text style="white-space: pre-wrap" class="task-title">{{task.title}}</text>
					<view v-if="haveTaskRangeTime">
						<view class="round-dot" style="margin: 6rpx;"></view>
						<text style="font-size: 14px;">{{taskRangeStart}}</text>
					</view>
					<view v-if="haveTaskRangeTime">
						<view class="round-dot" style="margin: 6rpx;background:#f4c2a2"></view>
						<text style="font-size: 14px;">{{taskRangeEnd}}</text>
					</view>
				</mycol>
				<!-- <uni-title :title="task.title" type="h3"></uni-title> -->
				<expanded></expanded>
				<image style="width: 75px;height: 75px;margin: 10rpx;" v-if="taskImage.length" :src="taskImage[0]" mode="aspectFit"></image>
			</myrow>
			<myrow>
				<view v-if="haveReward" class="boxText">赏</view>
				<text :style="{fontSize: '16px',color: moneyColor}" >{{taskMoney}}</text>
				<expanded></expanded>
				<text :style="{fontSize: '12px'}" >{{taskDistance}}</text>
				<uni-icons v-if="taskDistance" type="location-filled"></uni-icons>
			</myrow>
		</uni-card>
	</view>
</template>

<script>
	import utiltask from "@/common/util_task.js"
	import {color as mycolor} from "@/common/theme.js"
	import { mapState } from "vuex"
	import store from "@/store/index.js"
	import util_time from "../../common/util_time"
import util_common from "../../common/util_common"
	
	export default {
		name:"task-item",
		props: {
			task: {
				type: Object,
				require: true,
			},
		},
		data() {
			// var task = store.getters.getTaskById(this.taskid)
			return {
				moneyColor:mycolor.primary,
				avator:"",
				taskuser:null,
			};
		},
		mounted() {
			store.dispatch("getOtherUser",this.task.cid).then((res)=>{
				if (res) {
					this.taskuser = res
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
			haveReward() {
				return utiltask.haveRewardMoney(this.task)
			},
			haveTaskRangeTime() {
				return (this.task.task_start_time ?? 0) > 0
			},
			taskRangeStart() {
				return util_time.formatTaskWeekTime(this.task.task_start_time)+" 开始"
			},
			taskRangeEnd() {
				return util_time.formatTaskWeekTime(this.task.task_end_time)+" 结束"
			},
			taskImage() {
				return utiltask.getImageUrls(this.task)
			},
			taskMoney() {
				return utiltask.getMoneyString(this.task)
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
			creditScore() {
				return this.taskuser == null ? null : util_common.getCreditShowScore(this.taskuser.credit_score)
			}
		},
		methods:{
			...mapState({
				location: state => state.user_data.location
			})
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
	@import "@/static/my.scss";
	
	.uni-card {
		border-radius: 10px;
	}
	
	.txt-credit {
		font-size: 14px;
		color: $uni-error;
	}
	
	.txt-name {
		font-size: 14px;
		color: $uni-base-color;
	}
	
</style>