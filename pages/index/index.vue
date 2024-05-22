<template>
	<view class="col-class" style="height: 100%;">
		<!-- <uni-nav-bar :fixed="true" left-icon="plus-filled" :color="navcolor" @clickLeft="onAddTask" :border="false" right-icon="search" @clickRight="onToSearchPage">
			<template #default>
				<view class="search-index"></view>
			</template>
		</uni-nav-bar> -->
		<!-- <uv-navbar title="" :fixed="true">
			<template #center>
			</template>
		</uv-navbar> -->
		<view :style="{'background-color': theme.topNavBar,'paddingBottom':'10px'}">			
			<myrow :customStyle="{padding: '10px 5px',backgroundColor:theme.topNavBar}">
				<uv-search :disabled="true" placeholder="搜索" :showAction="false" @click="onToSearchPage"></uv-search>
				<!-- <uni-icons type="plus" :color="navcolor" size="32" style="margin: 0px 10px;" @click="onAddTask"></uni-icons> -->
				<button class="fill-btn-primary" style="width: 60px;height: 30px;font-size: 14px;margin: 0px 10px;" @click="onAddTask">发布</button>
			</myrow>
			<myrow mainAlign="center">
				<view class="select-box" :class="{'select-color': selectType==0}" @click="switchSelectType(0)">
					线下帮帮
				</view>
				<view style="width: 20px;"></view>
				<view class="select-box" :class="{'select-color': selectType==1}" @click="switchSelectType(1)">
					线上帮帮
				</view>
			</myrow>
		</view>
		<!-- <view style="flex: 1;">
		</view> -->
			<scroll-view v-show="selectType == 0" scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh" :refresherTriggered="refreshFinish" 
			style="height: 0;flex: 1;" @scrolltolower="onLoadMore">
				<uv-list :customStyle="{backgroundColor: 'transparent'}">
					<template v-for="(task,index) in genTaskList" :key="index">
						<uv-list-item @click="toTaskInfo(task)" :clickable="true" :customStyle="{backgroundColor: 'transparent'}">
							<task-item :task="task"></task-item>
						</uv-list-item>
					</template>
					<uv-list-item :customStyle="{backgroundColor: 'transparent'}">
						<uni-load-more :status="loadState"></uni-load-more>
					</uv-list-item>
				</uv-list>
			</scroll-view>
			<scroll-view v-show="selectType == 1" scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh" :refresherTriggered="onlineRefreshFinish"
			style="height: 0;flex: 1;" @scrolltolower="onLoadMore">
				<uv-list :customStyle="{backgroundColor: 'transparent'}">
					<template v-for="(task,index) in genOnlineTaskList" :key="index">
						<uv-list-item @click="toTaskInfo(task)" :clickable="true" :customStyle="{backgroundColor: 'transparent'}">
							<task-item :task="task"></task-item>
						</uv-list-item>
					</template>
					<uv-list-item :customStyle="{backgroundColor: 'transparent'}">
						<uni-load-more :status="onlineLoadState"></uni-load-more>
					</uv-list-item>
				</uv-list>
			</scroll-view>
	</view>
</template>

<script>
	import {color as mycolor} from "@/common/theme.js"
	import httputil from "@/common/http_util.js"
	import { EnumLoadState, ErrCode, LoadState,ServerConfig, UpdateEventType } from "@/common/define_const.js"
	import store from "@/store/index.js"
	import api from "@/common/api_handle.js"
	import util_task from "@/common/util_task"
import global_data from "../../common/global_data"
import util_page from "../../common/util_page"
	
	var taskConfig = util_task.newTaskConfig()
	var taskSelectType = {
		OffLine: 0,
		OnLine: 1,
	}
	
	export default {
		data() {
			return {
				winHeight: 0,
				refreshFinish: false,
				onlineRefreshFinish: false,
				navcolor:mycolor.primary,
				theme:mycolor,
				taskList:[],
				onlineTaskList:[],
				loadState: EnumLoadState.More,
				onlineLoadState: EnumLoadState.More,
				selectType:taskSelectType.OffLine,
				onlineloaded:false,
			}
		},
		onLoad() {
			// console.log("get apiGetTaskInfo")
			uni.getSystemInfo({
			  success: (res) => {
				this.winHeight = res.windowHeight
			  }
			})
			this.refreshTaskList()
			// getlocation
			uni.getLocation({
				isHighAccuracy:true,
				success: (res) => {
					// console.log("get location ",res)
					store.commit("setLocation",{latitude:res.latitude,longitude:res.longitude})
				},
			})
			
			// uni.$on(UpdateEventType.Task,(tid)=>{
			// 	if (this.taskList.find(v=> v == tid)) {
			// 		// console.log("task update ",tid)
			// 		// this.taskList = [...this.taskList]
			// 		// this.taskList = this.taskList
			// 	}
			// })
		},
		computed: {
			genTaskList() {
				var res = [];
				for (let id of this.taskList) {
					var v = store.getters.getTaskById(id)
					if (v) {
						res.push(v)
					}
				}
				// console.log("genTaskList ",res)
				return res
			},
			genOnlineTaskList() {
				var res = [];
				for (let id of this.onlineTaskList) {
					var v = store.getters.getTaskById(id)
					if (v) {
						res.push(v)
					}
				}
				// console.log("genTaskList ",res)
				return res
			},
		},
		methods: {
			onAddTask() {
				// console.log("add task")
				// let aa = null
				// let b = aa.key
				
				if (store.getters.isLogin) {
					uni.navigateTo({
						url:"/pages/task/task_add"
						// url:"/pages/message/test_chat_page"
					})
					
				}else{					
					uni.navigateTo({
						url:"/pages/user/login"
					})
					// uni.login({
					// 	provider:"weixin",
					// 	fail:(res)=>{
					// 		console.log("login fail",res)
					// 	},
					// 	success:(res)=>{
					// 		console.log("login success",res)
					// 	}
					// })
					
					// uni.getUserInfo({
					// 	provider:"weixin",
					// 	fail:(res)=>{
					// 		console.log("getUserInfo fail",res)
					// 	},
					// 	success:(res)=>{
					// 		console.log("getUserInfo success",res)
					// 	}
					// })
					
					// uni.getUserProfile({
					// 	desc:"获取信息用于展示",
					// 	fail:(res)=>{
					// 		console.log("getUserInfo fail",res)
					// 	},
					// 	success:(res)=>{
					// 		console.log("getUserInfo success",res)
					// 	}
					// })
				}
			},
			onToSearchPage() {
				if (global_data.isLogin()) {					
					uni.navigateTo({
						url:"/pages/task/task_search"
					})
				}else{
					util_page.toLoginPageDialog()
				}
			},
			async onPullDownRefresh() {
				let stype = this.selectType
				if (stype == taskSelectType.OffLine) {
					this.refreshFinish = true
				}else{
					this.onlineRefreshFinish = true
				}
				
				await this.refreshTaskList()
				
				if (stype == taskSelectType.OffLine) {
					this.refreshFinish = false
				}else{
					this.onlineRefreshFinish = false
				}
			},
			onLoadMore() {
				if (this.selectType == taskSelectType.OffLine) {
					if (this.loadState != EnumLoadState.More) {
						return
					}
					this.loadState = EnumLoadState.Loading
				}else{
					if (this.onlineLoadState != EnumLoadState.More) {
						return
					}
					this.onlineLoadState = EnumLoadState.Loading
				}
				this.getTaskList()
			},
			async refreshTaskList() {
				taskConfig = util_task.newTaskConfig()
				await this.getTaskList()
			},
			async getTaskList() {
				let stype = this.selectType
				taskConfig.select_type = stype
				var res = await api.apiGetTaskInfo(taskConfig)
				if (res?.data.length) {
					// console.log(res)
					taskConfig = res.config
					store.commit("updateTaskData",res.data)
					if (stype == taskSelectType.OffLine) {
						this.taskList = res.data.map(v=>v.id)
						if (taskConfig.locMax > 0) {
							this.loadState = EnumLoadState.noMore
						}else{
							this.loadState = EnumLoadState.More
						}						
					} else{
						this.onlineTaskList = res.data.map(v=>v.id)
						if (taskConfig.globelMax > 0) {
							this.onlineLoadState = EnumLoadState.noMore
						}else{
							this.onlineLoadState = EnumLoadState.More
						}						
					}
				}else{
					if (stype == taskSelectType.OffLine) {
						this.loadState = EnumLoadState.noMore						
					}else{
						this.onlineLoadState = EnumLoadState.noMore						
					}
				}
			},
			toTaskInfo(task) {
				// console.log("toTaskPage ")
				uni.navigateTo({
					url:"/pages/task/task_info?taskid="+task.id,
					fail:(e) => {
						console.log("fail ",e)
					}
				})
			},
			switchSelectType(stype) {
				if (this.selectType == stype) {
					return
				}
				
				this.selectType = stype
				if (stype == taskSelectType.OnLine && this.onlineloaded == false) {
					this.onlineloaded = true
					
					this.refreshTaskList()
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
	
	.select-box {
		border-radius: 20px;
		padding: 5px 15px;
		color: $uni-base-color;
		font-size: 14px;
	}
	
	.select-color {
		background-color: $uni-success-light;
		color: $uni-main-color;
	}
	
</style>
