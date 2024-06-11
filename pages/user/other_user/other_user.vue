<template>
	<view v-if="user" class="col-class">
		<uv-popup ref="popup" mode="bottom" round="10px" :bgColor="theme.content_grey_deep">
			<view style="height: 200px;padding: 10px;">
				<uv-grid :col="4" :border="false">
					<uv-grid-item @click="toReportPage">
						<chat-icon name="举报">
							<uv-icon name="warning-fill" size="24"></uv-icon>
						</chat-icon>
					</uv-grid-item>
					<uv-grid-item @click="onAddBlackList">
						<chat-icon :name="inBlackList? '取消拉黑' : '拉黑'">
							<uni-icons type="trash-filled" size="30"></uni-icons>
						</chat-icon>
					</uv-grid-item>
				</uv-grid>
			</view>
		</uv-popup>
		<view class="card" style="padding: 10px;">
			<myrow itemAlign="flex-start">
				<avatar :src="user.icon" :radius="50"></avatar>
				<view class="" style="margin-left: 10rpx;">					
					<mycol itemAlign="flex-start">
						<text class="main" style="margin-bottom: 8px;">{{user.name}}</text>
						<uv-icon :name="sexicon" :color="sexColor" :bold="true"></uv-icon>
					</mycol>
				</view>
				<expanded></expanded>
				<uni-icons size="18px" type="more-filled" @click="showMoreAction"></uni-icons>
			</myrow>
			<view class="" style="margin-top: 10px;">
				<uni-section title="信用分" type="line">
					<myrow mainAlign="center">
						<text :class="creditScore>=0 ? 'score-good':'score-bad'">{{creditScore}}</text>
					</myrow>
					<!-- <template v-slot:right>
						<button style="margin: 0px 10px;height: 30px;padding: 0px 8px;" :class="inBlackList? 'fill-btn-primary-disabled': 'fill-btn-primary'" @click="toChatPage">私聊</button>
					</template> -->
				</uni-section>
				
				<myrow mainAlign="center">
					<uni-icons :type="iconType(true)" :color="iconColor(true)" size="34" @click="setCreditType(true)"></uni-icons>
					<view style="width: 30px;"></view>
					<uni-icons :type="iconType(false)" :color="iconColor(false)" size="34" @click="setCreditType(false)"></uni-icons>
				</myrow>
			</view>
		</view>
		<uni-section title="他的发布" type="line">
		</uni-section>
		<view v-if="tasklist.length == 0">
			<myrow mainAlign="center">
				<view style="width: 200px;">
					<uv-divider text="" :dot="true"></uv-divider>
				</view>
			</myrow>
		</view>
		<template v-for="task in tasklist">
			<view @click="toTaskInfo(task)">
				<task-item :task="task"></task-item>
			</view>
		</template>
		<!-- <view style="height: 100%;">
			<view style="background-color: #fff;border-radius: 20px 20px 0px 0px;">
				<myrow mainAlign="center">
					<text>他的发布</text>
				</myrow>
			</view>
		</view> -->
	</view>
</template>

<script>
	import store from '@/store';
	import { CreditType, EnumLoadState, PageType, ServerConfig } from '../../../common/define_const';
	import {color as theme} from "@/common/theme.js"
import apihandle from '../../../common/api_handle';
import { EnumSex } from "@/common/define_const";
import util_common from '../../../common/util_common';
import { mapState } from "vuex"
import util_page from '../../../common/util_page';
import global_data from '../../../common/global_data';
	
	export default {
		onLoad(d) {
			this.cid = parseInt(d.cid)
			store.dispatch("getOtherUser",this.cid).then((res)=>{
				this.user = res
			})
			if (global_data.isLogin()) {				
				store.dispatch("getUserCreditType",this.cid).then((res)=>{
					if (res != null) {
						this.ctype = res
					}
				})
			}
			this.fromPage = d.fromPage || 0
			
			this.loadTask()
		},
		data() {
			return {
				user:null,
				fromPage:0,
				cid:0,
				theme:theme,
				ctype:0,
				tasklist:[],
				loadstate:EnumLoadState.More,
			}
		},
		onReachBottom() {
			// console.log("onReachBottom")
			this.loadTask()
		},
		computed:{
			...mapState({
				selfuser: state => state.user_data.user,
			}),
			inBlackList() {
				return store.getters.inBlackList(this.cid)
			},
			sexicon() {
				return this.user?.sex == EnumSex.WOMAN ? "woman" : "man"
			},
			sexColor() {
				return this.user?.sex == EnumSex.WOMAN ? "pink" : "royalblue"
			},
			creditScore() {
				return util_common.getCreditShowScore(this.user?.credit_score || 0)
			}
		},
		methods: {
			iconType(isgood) {
				if (isgood) {
					return this.ctype == CreditType.Good ? "hand-up-filled" : "hand-up"
				}else{
					return this.ctype == CreditType.Bad ? "hand-down-filled" : "hand-down"
				}
			},
			iconColor(isgood) {
				if (isgood) {
					return this.ctype == CreditType.Good ? "#e43d33" : ""
				}else{
					return this.ctype == CreditType.Bad ? "#8f939c" : ""
				}
			},
			toChatPage() {
				// console.log("toChatPage")
				if (this.inBlackList) {
					return
				}
				if (this.selfuser.age <= 0) {
					apihandle.toast("请先进行实名验证")
					util_page.toIdCardPage()
					return
				}
				if (this.fromPage == PageType.ChatUser) {
					uni.navigateBack()
				}else{
					uni.navigateTo({
						url:`/pages/message/chat_user_page?cid=${this.cid}&fromPage=${PageType.User}`
					})
				}
			},
			openPopup() {
				this.$refs.popup.open()
			},
			toReportPage() {
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				uni.navigateTo({
					url:`/pages/report/report_user_page?cid=${this.cid}`
				})
			},
			onAddBlackList() {
				this.$refs.popup.close()
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				if (this.inBlackList) {
					uni.showModal({
						title:`将"${this.user.name}"取消拉黑`,
						// content:"对方将无法加入你的任务,也不会收到拉黑通知.",
						fail() {
						},
						success: (res) => {
							if (res.confirm) {								
								store.commit("removeBlackList",this.cid)
								apihandle.toast("已解除")
							}
						}
					})
				} else{					
					uni.showModal({
						title:`将"${this.user.name}"拉黑`,
						content:"对方将无法加入你的任务,也不会收到拉黑通知.",
						fail() {
						},
						success: (res) => {
							if (res.confirm) {								
								store.commit("addBlackList",this.cid)
								apihandle.toast("已拉黑")
							}
						}
					})
				}
			},
			setCreditType(isgood) {
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				let v = CreditType.None
				if (isgood) {
					v = this.ctype == CreditType.Good ? CreditType.None : CreditType.Good
				}else{
					v = this.ctype == CreditType.Bad ? CreditType.None : CreditType.Bad
				}
				if (v == this.ctype) {
					return
				}
				// let score = v - this.ctype
				this.ctype = v
				// this.user.credit_score += score
				store.commit("setOtherUserCredit",{cid:this.cid,ctype:v})
			},
			loadTask() {
				if (!global_data.isLogin()) {
					return
				}
				if (this.loadstate != EnumLoadState.More) {
					return
				}
				
				this.loadstate = EnumLoadState.Loading
				apihandle.apiLoadOtherTaskInfo(this.cid,this.tasklist.length).then((res)=>{
					if (res) {
						res = res.reverse()
						
						store.commit("updateTaskData",res)
						
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
				// console.log("toTaskPage ")
				uni.navigateTo({
					url:"/pages/task/task_info?taskid="+task.id,
					fail:(e) => {
						console.log("fail ",e)
					}
				})
			},
			showMoreAction() {
				let str = this.inBlackList ? '取消拉黑' : '拉黑'
				uni.showActionSheet({
					itemList:["举报",str],
					success: (i) => {
						switch (i.tapIndex){
							case 0:
								this.toReportPage()
								break;
							case 1:
								this.onAddBlackList()
								break;
							default:
								break;
						}
					},
					fail() {
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
	
	.user-btn {
		/* width: 200rpx; */
		/* height: 50rpx; */
		font-size: 28rpx;
		display: flex;
		/* margin-top: 30rpx; */
		justify-content: center;
		border-radius: 25px;	
		border: 3rpx solid #7d7d7d;
	}
	
	.main {
		color: $uni-main-color;
	}
	
	.card {
		border-radius: 10px;
		background-color: #fff;
		margin: 10px;
	}
	
	.txt-credit {
		color: $my-color-primary;
	}
	
	.score-good {
		color: $uni-success;
		font-size: 28px;
	}
	
	.score-bad {
		color: $uni-warning;
		font-size: 28px;
	}
	
	.credit-icon {
		
	}
</style>
