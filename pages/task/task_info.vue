<template>
	<view v-if="task" class="col-class">
		<uv-popup ref="popup" mode="bottom" round="10px" :bgColor="theme.content_grey_deep">
			<view style="height: 200px;padding: 10px;">
				<uv-grid :col="4" :border="false">
					<uv-grid-item>
						<chat-icon name="取消">
							<uni-icons type="trash-filled" size="30"></uni-icons>
						</chat-icon>
					</uv-grid-item>
					<uv-grid-item @click="toReportPage">
						<chat-icon name="举报">
							<uv-icon name="warning-fill"></uv-icon>
						</chat-icon>
					</uv-grid-item>
				</uv-grid>
			</view>
		</uv-popup>
		<myrow :customStyle="{backgroundColor: '#fff',padding:'5px'}">
			<avatar :src="task.creator_icon"/>
			<text>{{task.creator_name}}</text>
			<expanded></expanded>
			<uni-icons style="margin: 5px;" :type="starType" size="24" @click="onStarClick" :color="starColor"></uni-icons>
			<text :style="{margin: '5px',color:theme.primary}" v-if="selfTask" @click="toEditPage">编辑</text>
			<uni-icons style="margin: 5px;" type="more-filled" @click="openPopup"></uni-icons>
		</myrow>
		<scroll-view scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh" :refresher-triggered="refreshFinish"
		 class="expanded">
		<!-- style="height: 100%;" -->
			<swiper :indicator-dots="true" :autoplay="false" v-if="images.length" style="height: 300px;background-color: #fff;">
				<template v-for="(u,index) in images" :key="index">
					<swiper-item style="height: 300px;">
						<image :src="u" mode="aspectFit" style="height: 300px;width: 100%;"></image>
					</swiper-item>
				</template>
			</swiper>
			<view class="box-radius">
				<uni-title :title="task.title" type="h2"></uni-title>
				<!-- <text class="task-title">{{task.title}}</text> -->
				<view style="font-size: 15px;">
					<text>{{task.content}}</text>
				</view>
			</view>
			<!-- <uv-line></uv-line> -->
			<view class="box-radius">
				<uv-cell-group>
					<uv-cell :title="moneyTitle" >
						<template v-slot:value>
							<text class="text-primary">{{moneyString}}</text>
						</template>
					</uv-cell>
					<uv-cell title="已报名" @click="toMemberPage">
						<template v-slot:value>
							<text class="text-normal">{{numString}}</text>
							<uni-icons type="right"></uni-icons>
						</template>
					</uv-cell>
					<uv-cell title="报名截止时间" >
						<template v-slot:value>
							<text class="text-primary">{{timeString}}</text>
						</template>
					</uv-cell>
					<uv-cell title="发布时间" >
						<template v-slot:value>
							<text class="text-normal">{{task.createAt}}</text>
						</template>
					</uv-cell>
					<uv-cell title="任务地点" @click="toMapLocation">
						<template v-slot:value>
							<text class="text-normal">{{location}}</text>
							<uni-icons type="right"></uni-icons>
						</template>
					</uv-cell>
				</uv-cell-group>
			</view>
		</scroll-view>
		<myrow :customStyle="{backgroundColor: '#fff',padding:'5px'}" :wrap="false">
			<!-- <uni-icons type=""></uni-icons> -->
			<uv-icon name="share" size="26" :customStyle="{marginLeft: '10px',marginRight: '10px'}" @click="showShare"></uv-icon>
			<button @click="optAction" class="fill-btn-primary" >{{optName}}</button>
		</myrow>
		<view class="bg-color-white">
			<uv-safe-bottom></uv-safe-bottom>
		</view>
	</view>
	
</template>

<script>
	import store from "@/store/index.js"
	import util_task from "@/common/util_task"
	import { ErrCode, TaskMoneyType, UpdateEventType, UserFinishState } from "../../common/define_const"
	import apihandle from "@/common/api_handle"
	import { mapState,mapGetters } from "vuex"
	import {color as theme} from "@/common/theme.js"
	import user_data from "../../store/modules/user_data"
	
	var optState = {
		join:0,
		quit:1,
		finish:2,
		full:3,
	}
	
	export default {
		data() {
			return {
				taskid:null,
				refreshFinish: false,
				theme:theme,
			}
		},
		onLoad(e) {
			// this.task = store.getters.getTaskById(e.taskid)
			this.taskid = e.taskid
			
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
			task() {
				return store.getters.getTaskById(this.taskid)
			},
			selfTask() {
				return this.task.cid == this.user.cid
			},
			starType() {
				return this.inInterestTask(this.taskid) ? "star-filled" : "star"
			},
			starColor() {
				return this.inInterestTask(this.taskid) ? theme.primary :"#333333"
			},
			images() {
				return util_task.getImageUrls(this.task)
			},
			moneyTitle() {
				return this.task.money_type == TaskMoneyType.Reward ? "可获得报酬" : "需要支付给发布者"
			},
			moneyString() {
				return util_task.getMoneyString(this.task)
			},
			numString() {
				return util_task.getNumString(this.task)
			},
			timeString() {
				return util_task.getEndTime(this.task)
			},
			location() {
				// console.log("location ",this.task.address)
				return this.task.address?.name || "无"
			},
			getOptState() {
				var task = this.task
				var user = this.user
				var userjoin = util_task.getJoinByCid(user.cid,task)
				if (userjoin) {
					if (userjoin.state != UserFinishState.none) {
						return optState.finish
					}else{
						return optState.quit
					}
				}else{
					if (util_task.canJoin(task,user.sex)) {
						return optState.join
					}else{
						return optState.full
					}
				}
			},
			optName() {
				var state = this.getOptState
				if (state == optState.join) {
					return "报名"
				}else if(state == optState.quit){
					return "退出"
				}else if(state == optState.finish){
					return "已完成"
				}else if(state == optState.full){
					return "已满"
				}
			}
		},
		methods: {
			onPullDownRefresh() {
				this.refreshFinish = true
				// console.log("onRefreshTask")
				store.dispatch("loadTaskOne",this.taskid).then((res)=>{
					this.refreshFinish = false
				})
			},
			onStarClick() {
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
				// console.log("toMemberPage")
				uni.navigateTo({
					url:"/pages/task/task_member?taskid="+this.taskid,
					fail:(e) => {
						console.log("fail ",e)
					}
				})
			},
			toMapLocation() {
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
				uni.navigateTo({
					url:"/pages/task/task_add?taskid="+this.taskid,
				})
			},
			optAction() {
				var state = this.getOptState
				if (state == optState.join) {
					apihandle.apiJoinTask(this.task.id).then((res)=>{
						if (res) {
							this.task.join = res.join
							store.commit("updateTaskOne",this.task)
							apihandle.toast("报名成功")
						}
					})
				}else if (state == optState.quit) {
					apihandle.apiQuitTask(this.task.id).then((res)=>{
						if (res) {
							this.task.join = res.join
							store.commit("updateTaskOne",this.task)
							apihandle.toast("已退出")
						}
					})
				}
			},
			openPopup() {
				this.$refs.popup.open()
			},
			showShare() {
				uni.showActionSheet({
					itemList:["已报名","我的发布","私聊"],
					success: (i) => {
						console.log("share ",i.tapIndex)
						let url = ""
						switch (i.tapIndex){
							case 0:
								url = "/pages/task/task_share?join=1"
								break;
							case 1:
								url = "/pages/task/task_share?join=0"
								break;
							case 2:
								url = "/pages/task/task_share_user?id="+this.taskid
								break;
						}
						uni.navigateTo({
							url:url
						})
					},
					fail() {
					}
				})
			},
			toReportPage() {
				uni.navigateTo({
					url:`/pages/report/report_task_page?cid=${this.user.cid}&taskid=${this.taskid}`
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
	
	.headTop {
		background-color: #fff;
		// padding: 5px;
		width: 100%;
		
	}
	
	.box-radius {
		// border-radius: 10px;
		// margin: 5px;
		padding: 10px;
		background-color: #fff;
	}
	
	.task-title{
		font-size: 20px;
		font-weight:  500;
	}
	
	.text-primary {
		color: $my-color-primary;
		font-size: 12px;
	}
	
	.text-normal {
		// color: $my-color-primary;
		font-size: 12px;
	}
	
	
	
</style>
