<template>
	<view v-if="task" class="col-class text-normal" style="height: 100%;">
		<my-top-bar bgcolor="transparent" title="详细信息"></my-top-bar>
		<view class="top-bg top-background-color"></view>
		<uv-popup ref="popup" mode="bottom" round="10px" :bgColor="theme.content_grey_deep">
			<view style="height: 200px;padding: 10px;">
				<uv-grid :col="4" :border="false">
					<uv-grid-item v-if="selfTask && !isDelete" @click="deleteTask">
						<chat-icon name="取消">
							<uni-icons type="trash-filled" size="30"></uni-icons>
						</chat-icon>
					</uv-grid-item>
					<uv-grid-item @click="toReportPage" v-if="!selfTask">
						<chat-icon name="举报">
							<uv-icon name="warning-fill" size="24px"></uv-icon>
						</chat-icon>
					</uv-grid-item>
					<uv-grid-item v-if="isManager" @click="removeOtherUserTask" >
						<chat-icon name="下架">
							<uv-icon name="warning-fill" size="24px"></uv-icon>
						</chat-icon>
					</uv-grid-item>
					<uv-grid-item v-if="isManager" @click="setTaskCheck(1)" >
						<chat-icon name="通过">
							<uv-icon name="warning-fill" size="24px"></uv-icon>
						</chat-icon>
					</uv-grid-item>
					<uv-grid-item v-if="isManager" @click="setTaskCheck(1)" >
						<chat-icon name="不通过">
							<uv-icon name="warning-fill" size="24px"></uv-icon>
						</chat-icon>
					</uv-grid-item>
				</uv-grid>
			</view>
		</uv-popup>
		<uv-action-sheet ref="actionShare" :actions="actionList" title="分享到" cancelText="取消" 
		round="10" @select="onSelectShare"></uv-action-sheet>
		<view class="top-box" style="position: relative;z-index: 1;">			
			<myrow :customStyle="{padding:'10px 10px'}" :wrap="false">
				<view @click="toOtherUser" >
					<myrow :customStyle="{width:'auto'}">				
						<avatar :src="userIcon" outline="2px" />
						<text class="text-name" style="margin-left: 10px;">{{task.creator_name}}</text>
					</myrow>
				</view>
				<expanded></expanded>
				<view v-if="!selfTask" style="margin: 5px;">
					<uni-icons :type="starType" size="24" @click="onStarClick" :color="starColor"></uni-icons>
				</view>
				<view style="margin: 5px;">
					<uni-icons size="24" type="more-filled" @click="openPopup"></uni-icons>
				</view>
				<!-- <view style="width: 5px;"></view> -->
			</myrow>
		</view>
			<uni-notice-bar v-if="taskIllegal" text="存在违规内容,请修改!" />
		<scroll-view scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh" :refresher-triggered="refreshFinish"
		 style="height: 0;flex: 1;border-radius: 26px 26px 0px 0px;overflow: hidden;background-color: #fff;z-index: 1;">
			<view class="box-radius" style="padding: 0px;border-radius: 20px;">				
				<swiper :indicator-dots="true" :autoplay="false" v-if="images.length" :style="{height: '255px'}">
					<template v-for="(u,index) in images" :key="index">
						<swiper-item>
							<image :src="u" mode="aspectFill" :style="{width: '100%',height:'255px',borderRadius:'10px'}" @load="onImageLoaded" @click="previewImage(index)"></image>
						</swiper-item>
					</template>
				</swiper>
			</view>
			<view class="text-title" style="margin: 10px 16px;">
				<text>{{task.title}}</text>
			</view>
			<view class="box-radius" v-if="haveContent" style="min-height: 50px;padding: 15px 10px;">
				<text>{{task.content}}</text>
			</view>
			<!-- <uni-section :title="task.title" type="line" titleFontSize="18px">					
			</uni-section> -->
			<!-- <uv-line></uv-line> -->
			<view class="box-radius">
				<view class="cell-info" @click="toMemberPage">
					<myrow :wrap="false">
						<text>{{numString}}</text>
						<expanded></expanded>
						<uv-avatar-group :urls="icongroup" :size="30"></uv-avatar-group>
						<uni-icons type="right"></uni-icons>
					</myrow>
				</view>
			</view>	
			<view class="box-radius">
				<view class="cell-info" v-if="!emptyReward">
					<myrow>
						<text class="text-subtitle">{{moneyTitle}}</text>
						<expanded></expanded>
						<text class="text-primary text-money">{{moneyString}}</text>
					</myrow>
				</view>
				<!-- <view class="cell-info" @click="toMemberPage">
					<myrow>
						<text class="text-subtitle">报名成员</text>
						<expanded></expanded>
						<text>{{numString}}</text>
						<uni-icons type="right"></uni-icons>
					</myrow>
				</view> -->
				<view class="cell-info">
					<myrow>
						<text class="text-subtitle">联系方式</text>
						<expanded></expanded>
						<text class="text-location" style="max-width: 220px;" @click="copyContactWay">{{contactWay}}</text>
						<view class="copy-box" v-if="haveContactWay" style="margin-left: 3px;" @click="copyContactWay">
							<text>复制</text>
						</view>
					</myrow>
				</view>
				<view v-if="task.address != null" class="cell-info" @click="toMapLocation">
					<myrow>
						<text class="text-subtitle">任务地点</text>
						<expanded></expanded>
						<view style="width: 20px;"></view>
						<text class="text-location">{{location}}</text>
						<uni-icons type="location-filled" color="#00aaff"></uni-icons>
					</myrow>
				</view>
				<view class="cell-info">
					<myrow>
						<text class="text-subtitle">报名截止时间</text>
						<expanded></expanded>
						<text>{{timeString}}</text>
					</myrow>
				</view>
				<view class="cell-info" v-if="(task.task_start_time || 0) > 0">
					<!-- <myrow>
						<text>时间</text>
					</myrow> -->
					<myrow mainAlign="center">
						<!-- <uv-icon name="calendar" color="#40c25f" size="24"></uv-icon> -->
						<text class="text-subtitle">时间</text>
						<expanded></expanded>
						<!-- <view class="timeContent" style="width: 90px;">
							{{taskStartTime}}
						</view> -->
						<text>{{taskStartTime}} - {{taskEndTime}}</text>
						<!-- <view class="timeContent" style="width: 90px;">
							{{taskEndTime}}
						</view> -->
					</myrow>
				</view>
			</view>
			<view class="box-radius">
				<view class="cell-info">
					<myrow>
						<text class="text-subtitle">年龄限制</text>
						<expanded></expanded>
						<text>{{ageLimit}}</text>
					</myrow>
				</view>
				<view class="cell-info">
					<myrow>
						<text class="text-subtitle">信用分限制</text>
						<expanded></expanded>
						<text>{{taskCreditScore}}</text>
					</myrow>
				</view>
				<view class="cell-info">	
				<myrow>
					<text class="text-subtitle">发布时间</text>
					<expanded></expanded>
					<text>{{task.createAt}}</text>
				</myrow>
				</view>
				<view class="cell-info" v-if="selfTask">
					<myrow>
						<text class="text-subtitle">是否公开</text>
						<expanded></expanded>
						<text>{{task.nonpublic == 1 ? "不公开" :"公开"}}</text>
					</myrow>
				</view>
			</view>
			<view style="height: 50px;"></view>
		</scroll-view>
		
		<!-- <view style="background-color: #fff;height: 10px;"></view> -->
		<myrow :customStyle="{backgroundColor: '#fff',padding:'10px 0px'}" :wrap="false">
			<!-- <uni-icons type=""></uni-icons> -->
			<view style="margin: 0px 10px;" @click="showShare">				
				<mycol>
					<uv-icon name="share" size="26" :customStyle="{marginLeft: '10px',marginRight: '10px'}" ></uv-icon>
					<text class="text-share">分享</text>
				</mycol>
			</view>
			<button @click="optAction" :class="canAction?'fill-btn-primary':'fill-btn-primary-disabled'" style="margin-right: 10px;">{{optName}}</button>
			<!-- <expanded>
			</expanded> -->
			<view style="margin: 0px 10px 0px 0px;" @click="toEditPage" v-if="selfTask">
				<mycol>
					<uv-icon name="edit-pen" size="26" :customStyle="{marginLeft: '10px',marginRight: '10px'}" ></uv-icon>
					<text class="text-share">编辑</text>
				</mycol>
			</view>
			<!-- <text :style="{margin: '0px 5px 0px 10px',color:theme.primary,whiteSpace:'nowrap'}" v-if="selfTask" @click="toEditPage">编辑</text>
			<view style="width: 10px;"></view> -->
		</myrow>
		<view class="bg-color-white">
			<uv-safe-bottom></uv-safe-bottom>
		</view>
	</view>
	
</template>

<script>
	import store from "@/store/index.js"
	import util_task from "@/common/util_task"
	import { AgeType, EnumSex, ErrCode, PageType, TaskMoneyType, TaskType, UpdateEventType, UserFinishState } from "../../common/define_const"
	import apihandle from "@/common/api_handle"
	import { mapState,mapGetters } from "vuex"
	import {color as theme} from "@/common/theme.js"
	import user_data from "../../store/modules/user_data"
import util_time from "../../common/util_time"
import util_page from "../../common/util_page"
import util_common from "../../common/util_common"
import global_data from "../../common/global_data"
	
	var optState = {
		join:0,
		quit:1,
		finish:2,
		full:3,
		sexMan:4,
		sexWoman:5,
		inCheck:6,
		illegal:7,
		outTime:8,
	}
	
	export default {
		data() {
			return {
				taskid:null,
				fromShare:false,
				refreshFinish: false,
				theme:theme,
				task:null,
				taskuser:null,
				actionList:[
					{name:"微信聊天",openType:"share"},
					{name:"分享到朋友圈请点右上角"},
				],
				swiperHeight:300,
				imageHeight:0,
			}
		},
		onLoad(e) {
			// this.task = store.getters.getTaskById(e.taskid)
			this.taskid = e.taskid
			if (util_common.isFromPYQ()) {
				this.fromShare = true
			}
			
			uni.showLoading({
			})
			store.dispatch("getTaskInfo",this.taskid).then((res)=>{
				this.task = res
				
				store.dispatch("getOtherUser",this.task.cid).then((userres)=>{
					if (userres) {
						this.taskuser = userres
					}
				})
				// if (res && (res.cid == global_data.cid || res.state != util_task.TaskServerState.Illegal)) {
				// }else{
				// 	apihandle.toast("任务已下架")
				// 	if (!this.fromShare) {
				// 		uni.navigateBack()
				// 	}
				// }
			}).finally(()=>{
				uni.hideLoading()
			})
			// uni.$on(UpdateEventType.Task,(tid)=>{
			// 	if (tid == this.taskid) {
			// 		this.taskid = tid
			// 	}
			// })
		},
		onUnload() {
			// uni.$off(UpdateEventType.Task)
		},
		computed:{
			...mapGetters(["inInterestTask"]),
			...mapState({
				user: state => state.user_data.user,
			}),
			// task() {
			// 	return store.getters.getTaskById(this.taskid)
			// },
			haveContent() {
				return this.task.content != ""
			},
			avatorCid() {
				return this.fromShare ? 0 : this.task.cid
			},
			taskType() {
				return this.task.tasktype || TaskType.Active
			},
			selfTask() {
				return this.task.cid == this.user.cid
			},
			userIcon() {
				return this.taskuser?.icon || ""
			},
			isDelete() {
				return this.task.delete == 1
			},
			starType() {
				if (this.fromShare) {
					return "heart"
				}
				return this.inInterestTask(this.taskid) ? "heart-filled" : "heart"
			},
			starColor() {
				if (this.fromShare) {
					return "#333333"
				}
				return this.inInterestTask(this.taskid) ? theme.moneyColor :"#333333"
			},
			images() {
				return util_task.getImageUrls(this.task)
			},
			emptyReward() {
				if (this.task.money_type == TaskMoneyType.Reward && this.task.money <= 0) {
					return true
				}
				return false
			},
			moneyTitle() {
				return this.task.money_type == TaskMoneyType.Reward ? "可获得奖励" : "费用"
			},
			moneyString() {
				return util_task.getMoneyString(this.task,true)
			},
			numString() {
				return util_task.getNumString(this.task)
			},
			icongroup() {
				return util_task.getJoinIcons(this.task)
			},
			timeString() {
				return util_task.getEndTime(this.task)
			},
			location() {
				// console.log("location ",this.task.address)
				return this.task.address?.name || "无"
			},
			getOptState() {
				if (this.fromShare) {
					return optState.join
				}
				var task = this.task
				let tstate = task.state || 0
				if (tstate == util_task.TaskServerState.Finish) {
					return optState.finish
				}else if(tstate == util_task.TaskServerState.InCheck){
					return optState.inCheck
				}else if(tstate == util_task.TaskServerState.CheckFail || tstate == util_task.TaskServerState.Illegal){
					return optState.illegal
				}
				var user = this.user
				var userjoin = util_task.getJoinByCid(user.cid,task)
				if (userjoin) {
					if (userjoin.state != UserFinishState.none) {
						return optState.finish
					}else{
						return optState.quit
					}
				}else{
					let limitsex = util_task.getLimitSex(task)
					if (limitsex != EnumSex.NONE && limitsex != user.sex) {
						return limitsex == EnumSex.WOMAN ? optState.sexWoman : optState.sexMan
					}
					let now = util_time.getSecond()
					if (now > task.end_time) {
						return optState.outTime
					}
					if (util_task.canJoin(task,user.sex)) {
						return optState.join
					}else{
						return optState.full
					}
				}
			},
			canAction() {
				var state = this.getOptState
				return state == optState.join || state == optState.quit
			},
			optName() {
				var state = this.getOptState
				if (state == optState.join) {
					if (this.taskType == TaskType.Help) {
						return "帮助ta"
					}else{
						return "报名"
					}
				}else if(state == optState.quit){
					return "退出"
				}else if(state == optState.finish){
					return "已完成"
				}else if(state == optState.full){
					return "已满"
				}else if(state == optState.sexWoman){
					return "限女生"
				}else if(state == optState.sexMan){
					return "限男生"
				}else if(state == optState.inCheck){
					return "审核中"
				}else if(state == optState.illegal){
					return "内容违规"
				}else if(state == optState.outTime){
					return "已结束报名"
				}
				
			},
			taskStartTime() {
				return util_time.formatTaskWeekTime(this.task.task_start_time,{day:true,week:false})
			},
			taskEndTime() {
				return util_time.formatTaskWeekTime(this.task.task_end_time,{day:true,week:false})
			},
			ageLimit() {
				let agemin = this.task.agemin || 0
				let agemax = this.task.agemax || 0
				if (agemin < AgeType.Min || agemax < AgeType.Max) {
					return "18 - 不限"
				}
				agemax = agemax >= AgeType.Max ? "不限" : `${agemax}岁`
				return `${agemin} - ${agemax}`
			},
			taskCreditScore() {
				let score = this.task.credit_score || 0
				return `≥ ${score} 分`
			},
			taskIllegal() {
				return this.task.state == util_task.TaskServerState.Illegal
			},
			contactWay() {
				let way = this.task.contact_way || ""
				if (way.length > 0) {
					if (global_data.isLogin()) {
						way = `${way}`
					}else{
						way = `(登录解锁) ****`
					}
				}else{
					way = "无"
				}
				return way
			},
			haveContactWay() {
				let way = this.task.contact_way || ""
				if (way.length > 0 && global_data.isLogin()) {
					return true
				}
				return false
			},
			isManager() {
				return this.user.phone == "15757181904"
			}
		},
		onShareAppMessage(res) {
			if (!this.checkShare()) {
				return
			}
			console.log("onShareAppMessage:",res)
			let money = ""
			if (this.task.money_type == TaskMoneyType.Reward && this.task.money > 0) {
				money = "奖励 " + this.moneyString
			}
			let image = this.images.length > 0 ? this.images[0] : ""
			return {
				title:this.task.title+" "+money,
				path:"/pages/task/task_info?taskid="+this.task.id,
				imageUrl:image,
			}
		},
		onShareTimeline(res) {
			if (!this.checkShare()) {
				return
			}
			console.log("onShareTimeline:",res)
			let money = ""
			if (this.task.money_type == TaskMoneyType.Reward && this.task.money > 0) {
				money = "奖励 " + this.moneyString
			}
			// let image = this.images.length > 0 ? this.images[0] : ""
			return {
				title:this.task.title+" "+money,
				query:"taskid="+this.task.id+"&share=1"
				// imageUrl:image,
			}
		},
		methods: {
			onPullDownRefresh() {
				if (this.fromShare) {
					return
				}
				this.refreshFinish = true
				// console.log("onRefreshTask")
				store.dispatch("loadTaskOne",this.taskid).then((res)=>{
					this.refreshFinish = false
				})
			},
			onStarClick() {
				if (this.fromShare) {
					return
				}
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				if (this.inInterestTask(this.taskid)) {
					// 取消收藏
					apihandle.apiTaskPullInterest(this.taskid).then((res)=>{
						if (res?.code == ErrCode.SUCCESS) {
							store.commit("pullInterestTask",this.taskid)
							apihandle.toast("已取消")
						}
					})
				}else{
					// 收藏
					if (store.getters.maxInterestTask) {
						apihandle.toast("兴趣列表已达上限,请清理")
						return
					}
					apihandle.apiTaskPushInterest(this.taskid).then((res)=>{
						if (res?.code == ErrCode.SUCCESS) {
							store.commit("pushInterestTask",this.taskid)
							apihandle.toast("已加入兴趣列表,在 消息-兴趣 查看")
						}
					})
				}
			},
			toMemberPage() {
				if (this.fromShare) {
					return
				}
				// console.log("toMemberPage")
				uni.navigateTo({
					url:"/pages/task/task_member?taskid="+this.taskid,
					fail:(e) => {
						console.log("fail ",e)
					}
				})
			},
			toMapLocation() {
				if (this.fromShare) {
					return
				}
				var addr = this.task.address
				if (!addr) {
					return
				}
				// console.log("toMapLocation")
				uni.openLocation({
					latitude: addr.latitude,
					longitude: addr.longitude,
					fail: (e) => {
						console.log("openLocation fail ",e)
					}
				})
			},
			toEditPage() {
				if (this.fromShare) {
					return
				}
				uni.navigateTo({
					url:"/pages/task/task_add?taskid="+this.taskid,
				})
			},
			checkJoin() {
				let age = this.user.age
				if (age <= 0) {
					apihandle.toast("请先进行实名验证")
					util_page.toIdCardPage()
					return false
				}
				
				let agemin = this.task.agemin || 0
				let agemax = this.task.agemax || 0
				if (agemin >= AgeType.Min && agemax >= AgeType.Min) {
					agemax = agemax >= AgeType.Max ? 100 : agemax
					if (age < agemin || age > agemax) {
						apihandle.toast("年龄限制无法报名")
						return false
					}
				}
				
				let needscore = this.task.credit_score||0
				let uscore = util_common.getCreditShowScore(this.user.credit_score)
				if (uscore < needscore) {
					apihandle.toast("信用分不足")
					return false
				}
				let now = util_time.getSecond()
				if (now > this.task.end_time) {
					apihandle.toast("报名时间已结束")
					return false
				}
				let tstate = this.task.state || 0
				if (tstate == util_task.TaskServerState.Finish) {
					apihandle.toast("任务已结束")
					return false
				}
				if (tstate == util_task.TaskServerState.InCheck) {
					apihandle.toast("审核中")
					return false
				}
				if (tstate == util_task.TaskServerState.CheckFail) {
					apihandle.toast("内容违规无法报名")
					return false
				}
				if (tstate == util_task.TaskServerState.Illegal) {
					apihandle.toast("内容违规无法报名")
					return false
				}
				return true
			},
			optAction() {
				if (this.fromShare) {
					return
				}
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				var state = this.getOptState
				if (state == optState.join) {
					if (!this.checkJoin()) {
						return
					}
					apihandle.apiJoinTask(this.task.id).then((res)=>{
						if (res) {
							this.task.join = res.join
							store.commit("updateTaskOne",this.task)
							apihandle.toast("报名成功")
							// uni.navigateTo({
							// 	url:"/pages/message/task_chat_page?taskid="+this.task.id,
							// })
						}
					})
				}else if (state == optState.quit) {
					apihandle.apiQuitTask(this.task.id).then((res)=>{
						if (res) {
							this.task.join = res.join
							store.commit("updateTaskOne",this.task)
							store.commit("deleteJoinTask",this.task.id)
							apihandle.toast("已退出")
						}
					})
				}
			},
			openPopup() {
				if (this.fromShare) {
					return
				}
				this.$refs.popup.open()
			},
			checkShare() {
				let state = this.task.state || util_task.TaskServerState.InCheck
				if (state == util_task.TaskServerState.Illegal || state == util_task.TaskServerState.CheckFail) {
					apihandle.toast("存在违规内容请修改")
					return false
				}
				if (state == util_task.TaskServerState.InCheck) {
					apihandle.toast("审核中")
					return false
				}
				return true
			},
			showShare() {
				if (this.fromShare) {
					return
				}
				if (!this.checkShare()) {
					return
				}
				this.$refs.actionShare.open()
				// uni.showActionSheet({
				// 	// title:"分享到",
				// 	// alertText:"分享到",
				// 	// itemList:["已报名","我的发布","私聊"],
				// 	itemList:["微信聊天","朋友圈"],
				// 	success: (i) => {
				// 		// console.log("share ",i.tapIndex)
				// 		let url = ""
				// 		switch (i.tapIndex){
				// 			case 0:
				// 				url = "/pages/task/task_share?join=1"
				// 				break;
				// 			case 1:
				// 				url = "/pages/task/task_share?join=0"
				// 				break;
				// 			case 2:
				// 				url = "/pages/task/task_share_user?id="+this.taskid
				// 				break;
				// 		}
				// 		uni.navigateTo({
				// 			url:url
				// 		})
				// 	},
				// 	fail() {
				// 	}
				// })
			},
			onSelectShare(e) {
				// console.log("select share:",e)
			},
			// 解散任务
			deleteTask() {
				uni.showModal({
					title:"解散任务",
					content:"确定解散任务吗?",
					success: (res) => {
						if (res.confirm) {
							store.commit("deleteMyTask",this.taskid)
							apihandle.toast("已解散")
							// uni.navigateBack()
							uni.switchTab({
								url: '/pages/message/task_join'
							});
						}
					}
				})
			},
			removeOtherUserTask() {
				uni.showModal({
					title:"下架任务",
					content:"确定下架任务吗?",
					success: (res) => {
						if (res.confirm) {
							apihandle.apiRemoveTsak(this.taskid).then((remres)=>{
								if (remres) {									
									apihandle.toast("已下架")
									uni.navigateBack()
								}else{
									apihandle.toast("下架失败")
								}
							})
						}
					}
				})
			},
			setTaskCheck(open) {
				uni.showModal({
					title:"审核任务",
					content:"确定审核任务吗?",
					success: (res) => {
						if (res.confirm) {
							apihandle.apiTaskCheckOne(this.taskid,open).then((remres)=>{
								if (remres) {		
									apihandle.toast("操作成功")
								}else{
									apihandle.toast("操作失败")
								}
							})								
						}
					}
				})
			},
			toReportPage() {
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				uni.navigateTo({
					url:`/pages/report/report_task_page?cid=${this.user.cid}&taskid=${this.taskid}`
				})
			},
			// onImgTouchStart(e) {
			// 	console.log("touch start")
			// 	this.viewImage = true
			// },
			// onImgTouchMove(e) {
			// 	console.log("touch move")
			// 	this.viewImage = false
			// },
			toOtherUser() {
				if (this.task.cid == global_data.cid) {
					return
				}
				if (this.avatorCid > 0) {
					uni.navigateTo({
						url:`/pages/user/other_user/other_user?cid=${this.avatorCid}`
					})
				}
			},
			onImageLoaded(e) {
				if (this.imageHeight == 0) {
					// console.log("imageload",e)
					this.imageHeight = e.detail.height
					if (this.imageHeight > this.swiperHeight) {
						this.swiperHeight = Math.min(this.imageHeight,450)
					}
				}
			},
			previewImage(index) {
				
				uni.previewImage({
					urls:this.images,
					current:index,
				})
			},
			copyContactWay() {
				if (!global_data.isLogin()) {
					return
				}
				if (this.task.contact_way?.length > 0) {					
					uni.setClipboardData({
						data:this.task.contact_way,
						success: () => {
							apihandle.toast("内容已复制")
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	page {
		// background-color: $my-color-primary;
		// background: linear-gradient( 205deg, #56FAF2 0%, #BDF6FB 100%);
	}
	
	.top-bg {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 0;
		width: 100%;
		height: 300px;
	}
	
	.headTop {
		background-color: #fff;
		// padding: 5px;
		width: 100%;
		
	}
	
	.icon-box {
		
	}
	
	.box-radius {
		border-radius: 20rpx;
		margin: 20rpx 16px;
		padding: 5px 10px;
		background-color: #F3F3F3;
		color: $uni-main-color;
		// font-size: 14px;
	}
	
	.text-title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 18px;
		color: #333333;
		line-height: 25px;
		text-align: left;
		font-style: normal;
	}
	
	.text-primary {
		// color: $my-color-primary;
		// font-size: 12px;
	}
	
	.text-subtitle {
		// font-size: 14px;
		// color: $uni-secondary-color;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 16px;
		color: #999999;
		line-height: 20px;
		text-align: justify;
		font-style: normal;
	}
	
	.cell-info {
		margin: 10px 0px;
	}
	
	.text-normal {
		// color: $uni-main-color;
		// font-size: 12px;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		line-height: 20px;
		text-align: justify;
		font-style: normal;
		font-size: 16px;
		color: #333333;
	}
	
	.copy-box {
		background: #FFFFFF;
		border-radius: 5px;
		border: 1px solid #00D26A;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 11px;
		color: #00D26A;
		line-height: 16px;
		text-align: justify;
		font-style: normal;
	}
	
	.text-share {
		color: $uni-base-color;
		font-size: 14px;
	}
	
	.text-location {
		overflow: hidden; /* 确保文本超出容器时会被截断 */
		text-overflow: ellipsis; /* 使用省略号表示文本溢出 */
		white-space: nowrap;
		max-width: 200px;
	}
	
	.text-name {
		// color: #000;
		// font-weight: bold;
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 16px;
		color: #333333;
		line-height: 22px;
		text-align: left;
		font-style: normal;
	}
	
	.text-money {
		overflow-wrap: break-word;
		color: $my-color-money;
		font-size: 16px;
		font-family: PingFangSC-Semibold;
		// font-weight: 600;
		text-align: left;
		white-space: nowrap;
		line-height: 20px;
	}
	
</style>
