<template>
	<view class="content">
		<z-paging v-if="firstLoaded || isCurrentPage" ref="paging" v-model="dataList" @query="queryList" 
		 :default-page-size="pageSize" :fixed="customClick" :hide-empty-view="true">
			<view v-for="(task,index) in dataList" @click="toTaskInfo(task)" :key="index">
				<task-chat-item :task="task" @clickClose="deleteTaskJoin(task)"></task-chat-item>
			</view>
			<view v-if="this.firstLoaded && dataList.length == 0" style="width: 100%;">
				<myrow mainAlign="center">					
					<view style="width: 200px;">
						<uv-divider text="" :dot="true"></uv-divider>
					</view>
				</myrow>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { ServerConfig } from '@/common/define_const';
	import apihandle from '@/common/api_handle';
import store from '../../store';
import util_task from '../../common/util_task';
import global_data from '../../common/global_data';
	
	//:paging-style="{top:'0px',bottom:'0px'}"
	export default {
		name:"page-task-join",
		emits:["clickTask"],
		data() {
			return {
				dataList: [],
				// 当前组件是否已经加载过了
				firstLoaded: false,
				// 是否滚动到当前页
				isCurrentPage: false,
				pageSize: ServerConfig.LoadTaskNum,
			};
		},
		props:{
			// 当前组件的index，也就是当前组件是swiper中的第几个
			tabIndex: {
				default: 0
			},
			// 当前swiper切换到第几个index
			currentIndex: {
				default: 0,
			},
			customClick:{
				default:false
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if(newVal === this.tabIndex){
						// 懒加载，当滑动到当前的item时，才去加载
						if(!this.firstLoaded){
							// 这里需要延迟渲染z-paging的原因是为了避免在一些平台上立即渲染可能引发的底层报错问题
							this.$nextTick(() => {
								setTimeout(() => {
									this.isCurrentPage = true;
								}, 100);
							})
						}
					}
				},
				immediate: true
			},
		},
		created() {
			uni.$on("onDeleteTaskJoin",this.onDeleteTaskJoin)
		},
		beforeDestroy() {
			uni.$off("onDeleteTaskJoin")
		},
		methods:{
			queryList(pageNo,pageSize) {
				store.dispatch("loadTaskJoin",{skip:(pageNo-1)*pageSize,ref:pageNo==1,usecash:this.usecash}).then((res)=>{
					if (res) {
						this.$refs.paging.complete(res)
					}else{
						this.$refs.paging.complete([])
					}
					this.firstLoaded = true
				})
				this.usecash = false
			},
			toChatPage(task) {
				if (task.cid != global_data.cid && task.state == util_task.TaskServerState.Illegal) {
					apihandle.toast("任务已下架")
					return
				}
				if (this.customClick) {
					this.$emit("clickTask",task)
					return
				}
				// console.log("toChatPage")
				if (util_task.getJoinByCid(global_data.cid,task) != null) {					
					uni.navigateTo({
						url:"/pages/message/task_chat_page?taskid="+task.id,
					})
				}else{
					// 被踢
					uni.navigateTo({
						url:"/pages/task/task_info?taskid="+task.id,
					})
				}
			},
			toTaskInfo(task) {
				if (task.cid != global_data.cid && task.state == util_task.TaskServerState.Illegal) {
					apihandle.toast("任务已下架")
					return
				}
				uni.navigateTo({
					url:"/pages/task/task_info?taskid="+task.id,
				})
			},
			onDeleteTaskJoin() {
				this.usecash = true
				this.$refs.paging?.reload()
			},
			deleteTaskJoin(task) {
				uni.showModal({
					title:"从列表里删除",
					content:`确认删除: ${task.title} 吗?`,
					success: (res) => {
						if (res.confirm) {
							console.log("delete join")
							store.commit("deleteJoinTask",task.id)
						}
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		height: 100%;
	}
</style>