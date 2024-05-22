<template>
	<view>
		<z-paging ref="paging" v-model="chatList" use-chat-record-mode cell-height-mode="dynamic" bottom-bg-color="#f8f8f8"
		@query="queryList" :hide-empty-view="true">
			<!-- <template #top v-if="touser"> -->
				<!-- <uni-nav-bar :border="false" :shadow="false" :statusBar="true" left-icon="left" @clickLeft="goBack" :title="touser.name" backgroundColor="#F8F8F8">
					<myrow mainAlign="center">
						<text>{{touser.name}}</text>
						<view style="width: 10px;"></view>
						<uni-icons type="right" @click="onMore" color="#000000"></uni-icons>
					</myrow>
					<template v-slot:left>
						<uni-icons type="left" size="26"></uni-icons>
					</template>
				</uni-nav-bar> -->
				<!-- <uv-status-bar></uv-status-bar>
				<view style="padding: 5px;height: 44px;">					
					<myrow mainAlign="space-between">
						<uni-icons type="left" size="28px" color="#000000" @click="goBack"></uni-icons>
						<view>							
							<myrow>							
								<text>{{touser.name}}</text>
								<view style="width: 10px;"></view>
								<uni-icons type="right" @click="onMore" color="#000000"></uni-icons>
							</myrow>
						</view>
						<view></view>
					</myrow>
				</view> -->
			<!-- </template> -->
			<!-- <template #cell="{item,index}" :key="index">					
			</template> -->
			<view style="transform: scaleY(-1)" v-for="(item,index) in chatList" :key="index">
				<chat-item :chat="item" :lastChatTime="getLastChatTime(index)" :inpage="inpage" :showName="false"/>
			</view>
			<template #bottom>
				<chat-input @sendmsg="onSendChatString">
					<template #customBoard>
						<uv-grid :col="4" :border="false">
							<uv-grid-item :index="0" :key="0" @click="onChooseImage">
								<chat-icon name="相册">
									<uni-icons type="image" size="30"></uni-icons>
								</chat-icon>
							</uv-grid-item>
							<uv-grid-item :index="1" :key="1">
								<chat-icon name="拍摄">
									<uni-icons type="camera-filled" size="30"></uni-icons>
								</chat-icon>
							</uv-grid-item>
						</uv-grid>
					</template>
				</chat-input>
				<view class="input-color">
					<uv-safe-bottom></uv-safe-bottom>
				</view>
			</template>
			<view v-if="chatList.length == 0" style="width: 100%;">
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
	import { mapState } from "vuex"
	import util_task from '../../common/util_task';
	import store from "@/store/index.js"
	import { ChatContentType, PageType } from '@/common/define_const';
	import util_chat from '@/common/util_chat';
	import utilHttp from "@/common/http_util.js"
	
	export default {
		onLoad(d) {
			this.cid = parseInt(d.cid)
			this.fromPage = d.fromPage || 0
			store.dispatch("getOtherUser",this.cid).then((res)=>{
				this.touser = res
				uni.setNavigationBarTitle({
					title:this.touser.name
				})
			})
			uni.$on("getUserChat",this.onGetUserChat)
			uni.$on("reloadUserChat",this.reloadChat)
			store.commit("saveUserChatIndex",this.cid)
		},
		data() {
			return {
				chatList:[],
				chatlen:0,
				touser:null,
				cid:0,
				inpage:PageType.ChatUser,
				fromPage:0,
			}
		},
		onUnload() {
			uni.$off(["reloadUserChat","getUserChat"])
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
		},
		methods: {
			queryList(pageNo,pageSize) {
				// console.log("queryList user chat befor")
				store.dispatch("loadMoreUserChat",{cid:this.cid,length:this.chatlen}).then((res)=>{
					// console.log("queryList user chat ",res)
					if (res) {
						this.chatlen += res.length
						this.$refs.paging.complete(res)
					}else{
						this.$refs.paging.complete([])
					}
				})
				// .catch(()=>{
				// 	this.$refs.paging.complete([])
				// })
				
			},
			reloadChat() {
				this.chatlen = 0
				this.$refs.paging.reload()
				// console.log("reload user chat")
			},
			getLastChatTime(index) {
				return index+1 < this.chatList.length ? this.chatList[index+1].send_time : 0
			},
			onSendChatString(content) {
				this.sendChatMsg(ChatContentType.Text,content)
			},
			onGetUserChat(chat) {
				this.$refs.paging.addChatRecordData([chat])
				this.chatlen += 1
				store.commit("saveUserChatIndex",this.cid)
			},
			sendChatMsg(type,content) {
				var chat = util_chat.makeChatInfo(type,content,this.user)
				store.commit("sendUserChat",{cid:this.cid,chat:chat})
				this.$refs.paging.addChatRecordData([chat])
				this.chatlen += 1
			},
			sendImageMsg(url) {
				var msg = `|img: ${url}#0,0|`
				this.sendChatMsg(ChatContentType.Image,msg)
			},
			onChooseImage() {
				uni.chooseImage({
					count: 9,
					sourceType: ['album'],
					success: (cres) => {
						const tempFilePaths = cres.tempFilePaths;
						for (let img of tempFilePaths) {					
							utilHttp.uploadImage(img,(res)=>{
								// console.log('上传成功', res);
								// console.log('上传数据转换',JSON.parse(res.data));
								// 取到文档服务器的值
								let uploaddata = JSON.parse(res.data)
								let url = util_task.getImageUrlName(uploaddata.data)
								this.sendImageMsg(url)
							})
						}
					}
				})
			},
			onMore() {
				if (this.fromPage == PageType.User) {
					uni.navigateBack()
				}else{
					uni.navigateTo({
						url:`/pages/user/other_user/other_user?cid=${this.cid}&fromPage=${PageType.ChatUser}`
					})
				}
			},
			goBack() {
				uni.navigateBack()
			},
			testReload() {
				store.commit("reloadUserChatData")
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
	
</style>
