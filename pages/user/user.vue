<template>
	<view class="col-class" style="height: 100%;">
		<!-- <scroll-view scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh2" :refresherTriggered="refreshFinish" style="height: 0;flex: 1;"> -->
			<view class="card">				
				<myrow>
					<view style="margin: 10px;">
						<avatar :radius="50" :src="user.icon"></avatar>
					</view>
					<mycol itemAlign="flex-start">
						<text class="main" style="margin-bottom: 8px;">{{username}}</text>
						<uv-icon :name="sexicon" :color="sexColor" :bold="true"></uv-icon>
					</mycol>
					<expanded></expanded>
					<mycol>
						<myrow>
							<text class="txt-idcard" v-if="haveIdcard">已实名</text>
							<text class="txt-idcard txt-idcard-edit" v-else @click="toIdcardPage">未实名</text>
							<uni-icons type="checkbox-filled" color="#18bc37" v-if="haveIdcard" size="20"></uni-icons>
							<uni-icons v-else type="closeempty" color="#e43d33" size="20"></uni-icons>
						</myrow>
						<view style="height: 25px;"></view>
					</mycol>
					<view style="width: 10px;"></view>
				</myrow>
			</view>
			<view class="card card-set">
				<view style="padding-bottom: 10px;">
					<uni-section title="信用分" type="line" sub-title="收到点赞可以提升信用分">	
						<myrow mainAlign="center">
							<text :class="creditClass">{{creditScore}}</text>
						</myrow>
					</uni-section>
					<myrow mainAlign="center">
						<text style="font-size: 12px;color: #999;">{{creditDetail}}</text>
					</myrow>
				</view>
			</view>
			<view class="card card-set">
				<myrow>
					<view class="card-item">						
						<chat-icon name="编辑资料" @iconClick="toEditPage">
							<uni-icons type="compose" size="24"></uni-icons>
						</chat-icon>
					</view>
					<view class="card-item">
						<chat-icon name="设置" @iconClick="toSettingPage">
							<uni-icons type="gear-filled" size="24"></uni-icons>
						</chat-icon>
					</view>
					<view class="card-item">
						<chat-icon name="建议" @iconClick="toSuggestPage">
							<uni-icons type="email" size="24"></uni-icons>
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
				return this.user.credit_score >= 0 ? "*信用良好请继续保持" : "*信用分低于基准值请注意"
			},
			haveIdcard() {
				return this.user.age > 0
			}
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
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
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
	
	.card {
		border-radius: 10px;
		background-color: #fff;
		margin: 10px;
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
		color: $uni-success;
		font-size: 28px;
	}
	
	.score-bad {
		color: $uni-warning;
		font-size: 28px;
	}
	
	.txt-idcard {
		font-size: 14px;
		color: $uni-main-color;
		margin-right: 3px;
	}
	
	.txt-idcard-edit {
		text-decoration: underline;
	}
</style>
