<template>
	<view class="content">
		<z-paging v-if="firstLoaded || isCurrentPage" ref="paging" v-model="dataList" @query="queryList" 
		 :default-page-size="pageSize" :fixed="customClick" >
			<view v-for="(task,index) in dataList" @click="toChatPage(task)" :key="index">
				<task-chat-item :task="task"></task-chat-item>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { ServerConfig } from '@/common/define_const';
	import apihandle from '@/common/api_handle';
import store from '../../store';
	
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
		methods:{
			queryList(pageNo,pageSize) {
				store.dispatch("loadTaskJoin",{skip:(pageNo-1)*pageSize,ref:false}).then((res)=>{
					if (res) {
						this.$refs.paging.complete(res)
					}else{
						this.$refs.paging.complete([])
					}
				})
			},
			toChatPage(task) {
				if (this.customClick) {
					this.$emit("clickTask",task)
					return
				}
				// console.log("toChatPage")
				uni.navigateTo({
					url:"/pages/message/task_chat_page?taskid="+task.id,
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