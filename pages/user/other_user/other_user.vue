<template>
	<view style="height: 100%;">
		<my-top-bar :bgcolor="barBgColor"></my-top-bar>
		<view class="top-bg top-background-color"></view>
		<view v-if="user" class="col-class" style="background-color: #fff;position: relative;top: 114px;">
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
			<!-- <view style="height: 80px;"></view> -->
			<view class="user-card" style="margin-bottom: 10px;">
				<myrow :customStyle="{padding:'0px 20px'}">
					<view style="margin-top: -30px;">
						<avatar :src="user.icon" :radius="68" outline="3px"></avatar>
					</view>
					<text class="txt-name" style="margin: 8px;">{{user.name}}</text>
					<!-- <uv-icon :name="sexicon" :color="sexColor" :bold="true"></uv-icon> -->
					<sex-icon :sex="sex" :size="15"></sex-icon>
					<expanded></expanded>
					<uni-icons size="18px" type="more-filled" @click="showMoreAction"></uni-icons>
				</myrow>
			</view>
			<view class="card" style="padding: 10px 10px 22px 10px;background-color: #000;">
				<myrow>
					<image src="@/static/icon_credit.png" style="width: 12px;height: 16px;margin-right: 3px;"></image>
					<text class="txt-idcard">信用分</text>
				</myrow>
				<view class="" style="margin-top: 10px;">
					<myrow mainAlign="center">
						<text :class="creditScore>=100 ? 'score-good':'score-bad'">{{creditScore}}</text>
					</myrow>
					<myrow mainAlign="center">
						<uni-icons :type="iconType(true)" :color="iconColor(true)" size="34" @click="setCreditType(true)"></uni-icons>
						<view style="width: 30px;"></view>
						<uni-icons :type="iconType(false)" :color="iconColor(false)" size="34" @click="setCreditType(false)"></uni-icons>
					</myrow>
				</view>
			</view>
			<!-- <uni-section title="他的发布" type="line">
			</uni-section> -->
			<myrow>
				<view style="width: 13px;"></view>
				<text-switch text="他的发布" :open="true" bgheight="10px"></text-switch>
			</myrow>
			<view style="margin-bottom: 10px;width: 100%;"></view>
			<view v-if="tasklist.length == 0">
				<myrow mainAlign="center">
					<view style="width: 200px;">
						<uv-divider text="" :dot="true"></uv-divider>
					</view>
				</myrow>
			</view>
			<template v-for="(task,index) in tasklist" :key="index">
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
				barBgColor:"transparent",
			}
		},
		onPageScroll(e) {
			// e.scrollTop 是页面在垂直方向已滚动的距离
			console.log("onPageScroll")
			if (e.scrollTop > 50) {
				// 当滚动超过100px时，修改导航栏颜色为黑色
				this.barBgColor = '#fff';
			} else {
				// 当滚动距离小于等于100px时，恢复导航栏颜色为白色
				this.barBgColor = 'transparent';
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
			sex() {
				return this.user?.sex || EnumSex.WOMAN
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
					return this.ctype == CreditType.Good ? "#e43d33" : "#fff"
				}else{
					return this.ctype == CreditType.Bad ? "#fff" : "#fff"
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
						// res = res.reverse()
						
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
	@import "@/style/my.scss";
	
	page {
		background-color: #fff;
	}
	
	.top-bg {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 0;
		width: 100%;
		height: 300px;
	}
	
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
	
	.user-card {
		border-radius: 26px 26px 0px 0px;
		background-color: #fff;
		margin-top: -30px;
	}
	
	.card {
		border-radius: 6px;
		background-color: #fff;
		margin: 10px;
	}
	
	.txt-name {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 18px;
		color: #333333;
		line-height: 25px;
		text-align: left;
		font-style: normal;
	}
	
	.txt-credit {
		color: $my-color-primary;
	}
	
	.txt-idcard {
		// font-size: 14px;
		// color: $uni-main-color;
		// margin-right: 3px;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 12px;
		color: $my-color-primary;
		line-height: 17px;
		text-align: left;
		font-style: normal;
	}
	
	.score-good,.score-bad {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 28px;
		line-height: 40px;
		text-align: left;
		font-style: normal;
	}
	
	.score-good {
		color: #15FA8B;
	}
	
	.score-bad {
		color: $uni-warning;
	}
	
	.credit-icon {
		
	}
</style>
