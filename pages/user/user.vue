<template>
	<view class="col-class" style="height: 100%;background-color: #fff;">
		<!-- <scroll-view scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh2" :refresherTriggered="refreshFinish" style="height: 0;flex: 1;"> -->
			<view class="top-bg top-background-color"></view>
			<view class="card-head" style="margin-top: -30px;">
				<myrow>
					<view style="margin: -30px 0px 10px 14px;">
						<avatar :radius="68" :src="user.icon" outline="3px"></avatar>
					</view>
					<text class="text-name main" style="margin: 8px 8px;">{{username}}</text>
					<!-- <uv-icon :name="sexicon" :color="sexColor" :bold="true"></uv-icon> -->
					<sex-icon :sex="sex" :size="16"></sex-icon>
					<!-- <mycol itemAlign="flex-start">
					</mycol> -->
					<expanded></expanded>
					<view :class="haveIdcard ? 'box-name-check' : 'box-name-uncheck'">
						<myrow>
							<image v-if="haveIdcard " src="@/static/name_check.png" style="width: 10px;height: 12px;margin: 1px 3px 0px 0px;" ></image>
							<image v-else src="@/static/name_uncheck.png" style="width: 10px;height: 12px;margin: 1px 3px 0px 0px;" ></image>
							<!-- <uni-icons v-else type="closeempty" color="#e43d33" size="20"></uni-icons> -->
							<text class="txt-idcard" v-if="haveIdcard">已实名</text>
							<text class="txt-idcard txt-idcard-edit" v-else @click="toIdcardPage">未实名</text>
							<!-- <uni-icons type="checkbox-filled" color="#18bc37" v-if="haveIdcard" size="20"></uni-icons> -->
						</myrow>
					</view>
					<!-- <mycol>
					</mycol> -->
						<!-- <view style="height: 25px;"></view> -->
					<view style="width: 14px;"></view>
				</myrow>
			</view>
			<view class="card">
				<myrow>
					<image src="@/static/icon_credit.png" style="width: 12px;height: 16px;margin-right: 3px;"></image>
					<text class="txt-idcard">信用分</text>
				</myrow>
				<view style="padding-top: 10px;">
					<!-- <uni-section title="信用分" type="line" sub-title="收到点赞可以提升信用分">	
					</uni-section> -->
					<myrow mainAlign="center">
						<text :class="creditClass">{{creditScore}}</text>
					</myrow>
					<myrow mainAlign="center">
						<text class="txt-idcard">{{creditDetail}}</text>
					</myrow>
					<myrow mainAlign="center">
						<text class="txt-idcard" style="margin-top: 5px;">收到点赞可以提升信用分</text>
					</myrow>
				</view>
			</view>
			<view style="margin: 5px 10px;">
				<myrow mainAlign="space-around">
					<view class="card-item">						
						<chat-icon name="编辑资料" @iconClick="toEditPage">
							<!-- <uni-icons type="compose" size="24"></uni-icons> -->
							<image src="@/static/icon_edit.png" class="icon-img" mode="aspectFit"></image>
							<template v-slot:icontext>
								<text class="icon-text">编辑资料</text>
							</template>
						</chat-icon>
					</view>
					<view class="card-item">
						<chat-icon name="设置" @iconClick="toSettingPage">
							<!-- <uni-icons type="gear-filled" size="24"></uni-icons> -->
							<image src="@/static/icon_set.png" class="icon-img" mode="aspectFit"></image>
							<template v-slot:icontext>
								<text class="icon-text">设置</text>
							</template>
						</chat-icon>
					</view>
					<view class="card-item">
						<chat-icon name="建议" @iconClick="toSuggestPage">
							<!-- <uni-icons type="email" size="24"></uni-icons> -->
							<image src="@/static/icon_suggest.png" class="icon-img" mode="aspectFit"></image>
							<template v-slot:icontext>
								<text class="icon-text">建议</text>
							</template>
						</chat-icon>
					</view>
					<view class="card-item" v-if="isManager">
						<chat-icon name="审核" @iconClick="toCheckTask">
							<!-- <uni-icons type="email" size="24"></uni-icons> -->
							<image src="@/static/icon_suggest.png" class="icon-img" mode="aspectFit"></image>
							<template v-slot:icontext>
								<text class="icon-text">审核</text>
							</template>
						</chat-icon>
					</view>
					
					<!-- <button class="user-btn" @click="toEditPage">编辑资料</button> -->
					<!-- <button class="user-btn" @click="toSettingPage">设置</button> -->
				</myrow>
			</view>
		<!-- </scroll-view> -->
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import store from "@/store/index.js"
import apihandle from "../../common/api_handle"
import { EnumSex } from "../../common/define_const"
import global_data from "../../common/global_data"
import util_page from "../../common/util_page"
import util_common from "../../common/util_common"
	
	export default {
		data() {
			return {
				refreshFinish:false,
			}
		},
		onShow() {
			setTimeout(()=>{				
				if (this.user.cid <= 0) {
					util_page.toLoginPageDialog()
				}
			},100)
		},
		onPullDownRefresh() {
			this.onPullDownRefresh2()
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
			username() {
				return this.user.name || "未登录"
			},
			sex() {
				return this.user.sex
			},
			sexicon() {
				return this.user.sex == EnumSex.WOMAN ? "woman" : "man"
			},
			sexColor() {
				return this.user.sex == EnumSex.WOMAN ? "pink" : "royalblue"
			},
			creditScore() {
				return util_common.getCreditShowScore(this.user.credit_score)
			},
			creditClass() {
				return this.user.credit_score >= 0 ? "score-good" : "score-bad"
			},
			creditDetail() {
				return this.user.credit_score >= 0 ? "信用良好" : "信用分过低请注意"
			},
			haveIdcard() {
				return this.user.age > 0
			},
			isManager() {
				return this.user.phone == "15757181904"
			},
		},
		methods: {
			onPullDownRefresh2() {
				this.refreshFinish = true
				if (!global_data.isLogin()) {
					setTimeout(()=>{
						this.refreshFinish = false
						uni.stopPullDownRefresh()
					},500)
					return
				}
				apihandle.apiGetUserInfo().then((res)=>{
					if (res) {
						store.commit("setUser",res)
					}
					this.refreshFinish = false
				}).finally(()=>{
					uni.stopPullDownRefresh()
				})
			},
			toEditPage() {
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				uni.navigateTo({
					url:"/pages/edit/edit_page"
				})
			},
			toSettingPage() {
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				uni.navigateTo({
					url:"/pages/setting/setting_page"
				})
			},
			toSuggestPage() {
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				uni.navigateTo({
					url:"/pages/setting/suggest_page"
				})
			},
			toIdcardPage() {
				if (!global_data.isLogin()) {
					util_page.toLoginPageDialog()
					return
				}
				util_page.toIdCardPage()
			},
			toCheckTask() {
				uni.navigateTo({
					url:"/pages/task/task_check"
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	.top-bg {
		background-color: $my-color-primary;
		width: 100%;
		height: 150px;
	}
	
	.text-name {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 18px;
		color: #333333;
		line-height: 25px;
		text-align: left;
		font-style: normal;
	}
	
	.box-name-check {
		padding: 3px 10px;
		background-color: #000;
		border-radius: 11px;
	}
	
	.box-name-uncheck {
		padding: 3px 10px;
		background-color: #BBBBBB;
		border-radius: 11px;
	}
	
	.user-btn {
		/* width: 200rpx; */
		/* height: 50rpx; */
		font-size: 28rpx;
		display: flex;
		margin-top: 30rpx;
		justify-content: center;
		border-radius: 25px;	
		border: 3rpx solid #333;
	}
	
	.uni-section {
		border-radius: 10px;
	}
	
	.main {
		color: $uni-main-color;
	}
	
	.card-head {
		border-radius: 26px 26px 0px 0px;
		background-color: #fff;
	}
	
	.card {
		border-radius: 6px;
		background-color: #000;
		margin: 14px;
		padding: 13px 13px 30px 13px;
	}

	.card-set {
		color: $uni-base-color;
		font-size: 14px;
		// background-color: #f8f8f8;
	}
	
	.card-item {
		margin: 10px 5px;
	}
	
	.score-good {
		// color: $uni-success;
		color: $my-color-primary;
		font-size: 28px;
	}
	
	.score-bad {
		color: $uni-warning;
		font-size: 28px;
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
	
	.icon-img {
		max-width: 32px;
		max-height: 31px;
	}
	
	.icon-text {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 12px;
		color: #333333;
		line-height: 17px;
		text-align: left;
		font-style: normal;
	}
	
	.txt-idcard-edit {
		text-decoration: underline solid #fff 0.5px;
		text-underline-offset: 3px;
		color: #FFFFFF;
	}
</style>
