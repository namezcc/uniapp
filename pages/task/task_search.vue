<template>
	<view style="height: 100%;" class="col-class">
		<view :style="{padding: '5px 5px',backgroundColor:theme.topNavBar}">
			<uv-search :focus="true" placeholder="搜索任务" :showAction="true" action-text="取消" @custom="back" v-model="searchText" @search="onSearchTask"></uv-search>
		</view>
		<scroll-view scroll-y="true" style="height: 100%;">
			<uv-list :customStyle="{backgroundColor: 'transparent'}">
				<template v-for="(task,index) in genTaskList" :key="index">
					<uv-list-item @click="toTaskInfo(task)" :clickable="true" :customStyle="{backgroundColor: 'transparent'}">
						<task-item :task="task"></task-item>
					</uv-list-item>
				</template>
				<uv-list-item v-if="taskList.length" :customStyle="{backgroundColor: 'transparent'}">
					<uni-load-more :status="loadState"></uni-load-more>
				</uv-list-item>
			</uv-list>
			<view class="class-ceter text-search">
				<text v-if="searchNone">没有搜索到相关内容</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { EnumLoadState, ServerConfig } from '../../common/define_const'
	import api from "@/common/api_handle.js"
	import util_task from '../../common/util_task'
	import store from "@/store/index.js"
	import {color as mycolor} from "@/common/theme.js"
	
	var config = util_task.newTaskConfig()
	
	export default {
		data() {
			return {
				loadState: EnumLoadState.More,
				theme:mycolor,
				searchText: "",
				taskList:[],
				searchNone: false,
			}
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
				return res
			}
		},
		methods: {
			back() {
				uni.navigateBack({})
			},
			onSearchTask() {
				if (this.searchText.length <= 0) {
					return
				}
				config = util_task.newTaskConfig()
				config.search = this.searchText
				this.loadState = EnumLoadState.Loading
				api.apiSearchTask(config).then((res)=>{
					if (res?.data.length) {
						this.searchNone = false
						config = res.config
						store.commit("updateTaskData",res.data)
						if (config.globelMax > 0 && config.locMax > 0) {
							this.loadState = EnumLoadState.noMore
						}else{
							this.loadState = EnumLoadState.More
						}
						
						this.taskList = res.data.map(v=>v.id)
					}else{
						this.taskList = []
						this.searchNone = true
						this.loadState = EnumLoadState.noMore
					}
				})
				
			},
			toTaskInfo(task) {
				// console.log("toTaskPage ",task)
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
	
	page {
		height: 100%;
	}
	
	.text-search {
		color: $uni-base-color;
		margin-top: 30px;
	}
</style>
