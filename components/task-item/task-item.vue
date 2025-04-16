<template>
	<view class="" style="width: 100%;">
		<uni-card margin="7px 14px 7px 14px" padding="10px 4px 10px 4px" :border="false" :is-shadow="false">
			<template v-slot:title>
				<view style="margin-top: 16px;padding: 0px 4px 0px 4px;">
					<myrow :wrap="false">
						<avatar :src="icon" />
						<!-- <view class="" style="margin-left: 8rpx;">							
							<mycol itemAlign="flex-start">
								<text class="txt-name">{{task.creator_name}}</text>
								<text class="txt-credit" v-if="creditScore">信用分:{{creditScore}}</text>
							</mycol>
						</view> -->
						<view style="margin: 5px;"></view>
						<text class="txt-name">{{userName}}</text>
						<view style="margin: 2.5px;"></view>
						<sex-icon :sex="userSex" :size="12"></sex-icon>
						<view style="margin-left: 5px;"></view>
						<text-tag bgcolor="#dfffef" text="限女生" v-if="sexlimitType == 0"/>
						<text-tag bgcolor="#dfffef" text="限男生" v-if="sexlimitType == 1"/>
						<expanded/>
						<uni-icons v-if="taskDistance" type="location-filled" color="#666666" :size="18"></uni-icons>
						<text class="text-dis" >{{taskDistance}}</text>
					</myrow>
				</view>
				<!-- <view style="margin-top: 10px;">
					<uv-line></uv-line>
				</view> -->
			</template>
			<myrow itemAlign="flex-start" :wrap="false">
				<mycol itemAlign="flex-start">
					<text class="text-title text-nothide">{{task.title}}</text>
					<text class="txt-content">{{task.content}}</text>
					<view style="margin-top: 10px;"></view>
					<view v-if="haveTaskRangeTime">
						<!-- <view class="round-dot" style="margin: 6rpx;"></view> -->
						<myrow>							
							<!-- <uv-icon name="clock" size="20"></uv-icon> -->
							<text-tag text="报名中" bgcolor="#1EFE8F" color="#333333"></text-tag>
							<text style="font-size: 14px;margin-left: 9px;">时间: {{taskRangTime}}</text>
						</myrow>
					</view>
					<!-- <view v-if="haveTaskRangeTime">
						<view class="round-dot" style="margin: 6rpx;background:#f4c2a2"></view>
						<text style="font-size: 14px;">{{taskRangeEnd}}</text>
					</view> -->
				</mycol>
				<!-- <uni-title :title="task.title" type="h3"></uni-title> -->
				<!-- <expanded></expanded> -->
			</myrow>
			<view v-if="taskImage.length" style="margin: 10px 0px;">
				<myrow :mainAlign="taskImage.length == 3 ? 'space-between' : 'flex-start'">
					<template v-for="(item,index) in taskImage" :key="index">
						<image :class="item.class" style="width: 206rpx;height: 218rpx;" :style="{marginRight:taskImage.length == 3 ? '0rpx' : '8rpx'}" :src="item.url" mode="aspectFill"></image>
					</template>
				</myrow>
			</view>			
			<myrow>
				<view v-if="haveReward" class="boxText">赏</view>
				<text v-if="!haveReward" style="font-size: 14px;color: black;">费用:</text>
				<!-- :style="{fontSize: '14px',color: moneyColor}"  -->
				<text class="text-money">{{taskMoney}}</text>
			</myrow>
			<myrow :wrap="false">
				<myrow :wrap="false">								
					<uv-avatar-group :urls="icongroup" :size="30"></uv-avatar-group>
					<!-- <text style="color: #f4d1b9;">{{numinfo[0]}}</text>
					<text style="margin-right: 5px;">/{{numinfo[1]}}</text> -->
					<view style="margin-left: 8px;" v-if="icongroup.length > 0"></view>
					<text>{{joinString}}</text>
				</myrow>
				<expanded></expanded>
				<view class="call-box">
					<text class="call-text">{{optName}}</text>
				</view>
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
import util_task from "@/common/util_task.js"
import { EnumSex, TaskType } from "../../common/define_const"
	
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
			this.setUser()
		},
		watch:{
			task:{
				handler(newv,oldv){
					// console.log("taskchange",newv,oldv)
					if (newv.cid == oldv?.cid) {
						return
					}
					this.setUser()
				},
				immediate:false
			}
		},
		computed:{
			numinfo() {
				let num = utiltask.getJoinNum(this.task)
				return [num[0]+num[1],this.task.people_num]
			},
			joinString() {
				let num = utiltask.getJoinNum(this.task)
				let total = num[0]+num[1]
				if (total == 0) {
					return "报名中"
				}else{
					return `${total}人已报名`
				}
			},
			sexlimitType() {
				return utiltask.getLimitSex(this.task)
			},
			haveReward() {
				return utiltask.haveRewardMoney(this.task)
			},
			haveTaskRangeTime() {
				return (this.task.task_start_time || 0) > 0
			},
			taskRangTime() {
				let isSameDay = util_time.isSameDay(this.task.task_start_time,this.task.task_end_time)
				if (isSameDay) {
					let start = util_time.formatTaskWeekTime(this.task.task_start_time,{day:true})
					let endstr = util_time.formatTaskWeekTime(this.task.task_end_time)
					return `${start} - ${endstr}`
				}else{
					let start = util_time.formatTaskWeekTime(this.task.task_start_time,{day:true,nohm:true})
					let endstr = util_time.formatTaskWeekTime(this.task.task_end_time,{day:true,nohm:true})
					return `${start} - ${endstr}`
				}
			},
			taskRangeStart() {
				return util_time.formatTaskWeekTime(this.task.task_start_time)+" 开始"
			},
			taskRangeEnd() {
				return util_time.formatTaskWeekTime(this.task.task_end_time)+" 结束"
			},
			taskImage() {
				let vec = utiltask.getImageUrls(this.task)
				let res = []
				for (var i = 0; i < vec.length && i < 3; i++) {
					res.push({
						url:vec[i],
						class:"",
					})
				}
				if (res.length == 1) {
					res[0].class = "image-one"
				}else if(res.length > 1){
					res[0].class = "image-left"
					res[res.length-1].class = "image-right"
					// console.log(res)
				}
				return res
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
			},
			icon() {
				return this.taskuser?.icon || ""
			},
			userName() {
				return this.taskuser?.name || ""
			},
			userSex() {
				// return EnumSex.WOMAN
				// console.log("usersex",this.taskuser?.sex)
				return this.taskuser?.sex
			},
			icongroup() {
				return util_task.getJoinIcons(this.task)
			},
			optName() {
				return this.task.taskType == TaskType.Help ? "帮助TA" : "呼TA"
			}
		},
		methods:{
			...mapState({
				location: state => state.user_data.location
			}),
			setUser() {
				store.dispatch("getOtherUser",this.task.cid).then((res)=>{
					if (res) {
						this.taskuser = res
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
	
	page {
		background-color: #F7F7F7;
	}
	
	.uni-card {
		border-radius: 12px;
	}
	
	.txt-credit {
		font-size: 14px;
		color: $uni-error;
	}
	
	.txt-name {
		font-size: 14px;
		color: $uni-base-color;
		font-weight: 600;
		text-align: left;
		white-space: nowrap;
		line-height: 20px;
		font-family: PingFangSC-Semibold;
	}
	
	.image-left {
		border-radius: 10px 0px 0px 10px;
	}
	
	.image-one {
		border-radius: 10px 10px 10px 10px;
	}
	
	.image-right {
		border-radius: 0px 10px 10px 0px;
	}
	
	.text-hide {
	    display: -webkit-box; /*弹性伸缩盒子模型显示*/
	    -webkit-box-orient: vertical; /*排列方式*/ 
	    -webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
	    overflow: hidden; /*溢出隐藏*/
	}
	
	.text-title {
		overflow-wrap: break-word;
		color: #000000;
		font-size: 16px;
		// font-family: PingFangSC-Semibold;
		font-weight: 600;
		text-align: left;
		white-space: nowrap;
		line-height: 22px;
		margin-bottom: 5px;
	}
	
	.text-nothide {
	    // display: -webkit-box; /*弹性伸缩盒子模型显示*/
	    // -webkit-box-orient: vertical; /*排列方式*/ 
	    // -webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
	    // overflow: hidden; /*溢出隐藏*/
		white-space: pre-wrap;
	}
	
	.txt-content {
		color: $uni-secondary-color;
		font-size: 14px;
		// white-space: normal !important;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 20px;
	}
	
	.call-box {
		background-color: #222222;
		border-radius: 16px;
		display: flex; /* 开启flex布局 */
		justify-content: center; /* 水平居中对齐 */
		align-items: center; /* 垂直居中对齐 */
		padding: 7px 21px;
	}
	
	.call-text {
		overflow-wrap: break-word;
		color: $my-color-text-primary;
		font-size: 14px;
		// font-family: AlibabaPuHuiTi_2_85_Bold;
		font-weight: bold;
		text-align: left;
		white-space: nowrap;
		line-height: 17px;
	}
	
	.text-money {
		overflow-wrap: break-word;
		color: $my-color-money;
		font-size: 14px;
		font-family: PingFangSC-Semibold;
		font-weight: 600;
		text-align: left;
		white-space: nowrap;
		line-height: 20px;
	}
	
	.text-dis {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 14px;
		color: #999999;
		line-height: 20px;
		text-align: left;
		font-style: normal;
	}
	
</style>