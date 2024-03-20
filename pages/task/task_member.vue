<template>
	<view>
		<scroll-view scroll-y="true" style="height: 100%;">
			<uni-list v-if="task && task.join">
				<uni-list-item v-for="(mem,index) in task.join.data" @click="toUserInfoPage(mem)" :clickable="true" :key="index">
					<template v-slot:header>
						<myrow>							
							<avatar :src="mem.icon" :sex="mem.sex"></avatar>
							<text>{{mem.name}}</text>
							<expanded></expanded>
							<button @click.stop="kickPeople(mem)" type="warn" v-if="optKick(mem)" size="mini" >踢出</button>
							<button disabled="true" v-if="optFinish(mem)" size="mini">已完成</button>
						</myrow>
					</template>
				</uni-list-item>
			</uni-list>
		</scroll-view>
		<view>
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog type="error" cancelText="取消" confirmText="确定" :content="kickmsg" title="踢人" @confirm="confirmKick"
					@close="kickCancle"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import { UserFinishState } from "@/common/define_const"
	import store from "@/store/index.js"
import apihandle from "../../common/api_handle"
	
	var MemOpt = {
		Finish:0,
		None:1,
		Kick:2,
	}
	
	export default {
		data() {
			return {
				task:null,
				kickmsg:"",
			}
		},
		onLoad(e) {
			this.task = store.getters.getTaskById(e.taskid)
		},
		computed:{
			...mapState({
				cid: state => state.user_data.user.cid,
			}),
		},
		methods: {
			optState(mem) {
				if (mem.state != UserFinishState.none) {
					return MemOpt.Finish
				}
				if (mem.cid == this.cid) {
					return MemOpt.None
				}else{
					return MemOpt.Kick
				}
			},
			optKick(mem) {
				return this.optState(mem) == MemOpt.Kick
			},
			optFinish(mem) {
				return this.optState(mem) == MemOpt.Finish
			},
			kickPeople(mem) {
				// console.log("kick people")
				this.kickmsg = `确定踢掉 ${mem.name} 吗?`
				this.kickCid = mem.cid
				this.$refs.alertDialog.open()
			},
			kickCancle() {
				this.kickCid = null
			},
			confirmKick() {
				console.log("kick people confirm ",this.kickCid)
				apihandle.apiKickTask(this.task.id,this.kickCid).then((res)=>{
					this.kickCid = null
					if (res) {
						this.task.join = res.join
						store.commit("updateTaskOne",this.task)
						apihandle.toast("操作成功")
					}
				})
			},
			toUserInfoPage(mem) {
				// console.log("toUserInfoPage")
				uni.navigateTo({
					url:`/pages/user/other_user/other_user?cid=${mem.cid}`
				})
			}
		},
		
	}
</script>

<style>
	.kick-btn {
		padding:10px;
		height: 30px;
		display: flex;
		align-items: center;
	}
</style>
