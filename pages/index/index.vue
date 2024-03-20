<template>
	<view class="col-class">
		<uni-nav-bar :fixed="true" left-icon="plus-filled" :color="navcolor" @clickLeft="onAddTask" :border="false" right-icon="search" @clickRight="onToSearchPage"></uni-nav-bar>
		<scroll-view scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh" :refresherTriggered="refreshFinish" 
		style="height: 100%;" @scrolltolower="onLoadMore">
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
	</view>
</template>

<script>
	import {color as mycolor} from "@/common/theme.js"
	import httputil from "@/common/http_util.js"
	import { EnumLoadState, ErrCode, LoadState,ServerConfig, UpdateEventType } from "@/common/define_const.js"
	import store from "@/store/index.js"
	import api from "@/common/api_handle.js"
	import util_task from "@/common/util_task"
	
	var taskConfig = util_task.newTaskConfig()
	
	export default {
		data() {
			return {
				winHeight: 0,
				refreshFinish: false,
				navcolor:mycolor.primary,
				taskList:[],
				loadState: EnumLoadState.More
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
				console.log("genTaskList ",res)
				return res
			}
		},
		methods: {
			onAddTask() {
				// console.log("add task")
				if (store.getters.isLogin) {
					uni.navigateTo({
						url:"/pages/task/task_add"
					})
				}else{					
					uni.navigateTo({
						url:"/pages/user/login"
					})
				}
			},
			onToSearchPage() {
				uni.navigateTo({
					url:"/pages/task/task_search"
				})
			},
			async onPullDownRefresh() {
				this.refreshFinish = true
				await this.refreshTaskList()
				this.refreshFinish = false
			},
			onLoadMore() {
				if (this.loadState != EnumLoadState.More) {
					return
				}
				this.loadState = EnumLoadState.Loading
				this.getTaskList()
			},
			async refreshTaskList() {
				taskConfig = util_task.newTaskConfig()
				await this.getTaskList()
			},
			async getTaskList() {
				var res = await api.apiGetTaskInfo(taskConfig)
				if (res?.data.length) {
					// console.log(res)
					taskConfig = res.config
					store.commit("updateTaskData",res.data)
					this.taskList = res.data.map(v=>v.id)
					if (taskConfig.globelMax > 0 && taskConfig.locMax > 0) {
						this.loadState = EnumLoadState.noMore
					}else{
						this.loadState = EnumLoadState.More
					}
				}else{
					this.taskList = []
					this.loadState = EnumLoadState.noMore
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
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
	
</style>
