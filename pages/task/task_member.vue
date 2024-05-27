<template>
	<view>
		<scroll-view scroll-y="true" style="height: 100%;">
			<uni-list v-if="task && task.join">
				<uni-list-item v-for="(mem,index) in member" @click="toUserInfoPage(mem)" :clickable="true" :key="index">
					<template v-slot:header>
						<myrow>							
							<avatar :src="mem.icon" :sex="mem.sex"></avatar>
							<view style="width: 5px;"></view>
							<mycol itemAlign="flex-start">								
								<text style="margin-bottom: 8px;">{{mem.name}}</text>
								<text-tag :text="creditScore(mem)"></text-tag>
							</mycol>
							<expanded></expanded>
							<button style="margin-right: 10px;" @click.stop="contactPeople(mem)" type="primary" v-if="optContact(index)" size="mini" >联系</button>
							<button @click.stop="kickPeople(mem)" type="warn" v-if="optKick(index)" size="mini" >踢出</button>
							<button disabled="true" v-if="optFinish(index)" size="mini">已完成</button>
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
import util_common from "../../common/util_common"
import util_task from "../../common/util_task"
	
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
				member:[],
			}
		},
		onLoad(e) {
			this.task = store.getters.getTaskById(e.taskid)
			let cidvec = util_task.getTaskJoinCidvec(this.task)
			store.dispatch("getOtherUserListOrCash",cidvec).then((res)=>{
				this.member = res
			})
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
			optContact(index) {
				let mem = this.task.join.data[index]
				if (mem.cid != this.cid) {
					if (this.task?.cid == this.cid) {
						return true
					}
				}
				return false
			},
			optKick(index) {
				if (this.task?.cid != this.cid) {
					return false
				}
				let mem = this.task.join.data[index]
				return this.optState(mem) == MemOpt.Kick
			},
			optFinish(index) {
				let mem = this.task.join.data[index]
				return this.optState(mem) == MemOpt.Finish
			},
			kickPeople(mem) {
				// console.log("kick people")
				this.kickmsg = `确定踢掉 ${mem.name} 吗?`
				this.kickCid = mem.cid
				this.$refs.alertDialog.open()
			},
			contactPeople(mem) {
				// console.log("contact ",mem)
				uni.showModal({
					content:mem.phone,
					cancelText:"复制",
					confirmText:"拨打电话",
					cancelColor:"#07c160",
					confirmColor:"#007aff",
					success: (res) => {
						if (res.confirm) {
							// 拨打电话
							uni.makePhoneCall({
								phoneNumber:mem.phone,
							})
						}else{
							uni.setClipboardData({
								data:mem.phone,
								success: () => {
									apihandle.toast("内容已复制")
								}
							})
						}
					}
				})
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
				if (this.cid == mem.cid) {
					return
				}
				uni.navigateTo({
					url:`/pages/user/other_user/other_user?cid=${mem.cid}`
				})
			},
			creditScore(mem) {
				return '信用分 '+ util_common.getCreditShowScore(mem.credit_score)
			},
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
