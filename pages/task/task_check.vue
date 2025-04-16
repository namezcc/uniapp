<template>
	<view>
		<template v-for="(task,index) in tasklist" :key="index">
			<view @click="toTaskInfo(task)">
				<task-item :task="task"></task-item>
			</view>
		</template>
	</view>
</template>

<script>
import apihandle from '../../common/api_handle'
import { EnumLoadState, ServerConfig } from '../../common/define_const'
	export default {
		data() {
			return {
				tasklist:[],
				loadstate:EnumLoadState.More,
			}
		},
		onLoad() {
			this.loadTask()
		},
		onReachBottom() {
			this.loadTask()
		},
		methods: {
			loadTask() {
				if (this.loadstate != EnumLoadState.More) {
					return
				}
				this.loadstate = EnumLoadState.Loading
				apihandle.apiLoadCheckTask(this.tasklist.length).then((res)=>{
					if (res) {
						this.tasklist.push(...res)
						if (res.length < ServerConfig.LoadTaskNum) {
							this.loadstate = EnumLoadState.noMore
						}
					}else{
						this.loadstate = EnumLoadState.noMore
					}
				}).finally(()=>{
					if (this.loadstate == EnumLoadState.Loading) {
						this.loadstate = EnumLoadState.More
					}
				})
			},
			toTaskInfo(task) {
				uni.navigateTo({
					url:"/pages/task/task_info?taskid="+task.id,
				})
			},
		}
	}
</script>

<style>

</style>
