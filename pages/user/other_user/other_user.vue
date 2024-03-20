<template>
	<view v-if="user">
		<uv-popup ref="popup" mode="bottom" round="10px" :bgColor="theme.content_grey_deep">
			<view style="height: 200px;padding: 10px;">
				<uv-grid :col="4" :border="false">
					<uv-grid-item @click="toReportPage">
						<chat-icon name="举报">
							<uv-icon name="warning-fill"></uv-icon>
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
		<view>
			<myrow>
				<avatar :src="user.icon" :radius="50"></avatar>
				<text>{{user.name}}</text>
				<expanded></expanded>
				<button @click="openPopup">
					<uni-icons type="more-filled"></uni-icons>
				</button>
			</myrow>
		</view>
		<view>
			<myrow>
				<expanded></expanded>
				<button @click="toChatPage">私聊</button>
			</myrow>
		</view>
	</view>
</template>

<script>
	import store from '@/store';
	import { PageType } from '../../../common/define_const';
	import {color as theme} from "@/common/theme.js"
import apihandle from '../../../common/api_handle';
	
	export default {
		onLoad(d) {
			this.cid = parseInt(d.cid)
			store.dispatch("getOtherUser",d.cid).then((res)=>{
				this.user = res
			})
			this.fromPage = d.fromPage || 0
		},
		data() {
			return {
				user:null,
				fromPage:0,
				cid:0,
				theme:theme,
			}
		},
		computed:{
			inBlackList() {
				return store.getters.inBlackList(this.cid)
			},
		},
		methods: {
			toChatPage() {
				console.log("toChatPage")
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
				uni.navigateTo({
					url:`/pages/report/report_user_page?cid=${this.cid}`
				})
			},
			onAddBlackList() {
				this.$refs.popup.close()
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
			}
		}
	}
</script>

<style>

</style>
