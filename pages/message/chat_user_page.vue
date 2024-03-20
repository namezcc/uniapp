<template>
	<view>
		<z-paging ref="paging" v-model="chatList" use-chat-record-mode use-virtual-list cell-height-mode="dynamic"
		@query="queryList" :hide-empty-view="true">
			<template #top v-if="touser">
				<uni-nav-bar :border="false" :shadow="false" :title="touser.name" right-icon="more-filled" @clickRight="onMore"></uni-nav-bar>
			</template>
			<template #cell="{item,index}">					
				<view style="transform: scaleY(-1)">
					<chat-item :chat="item" :lastChatTime="getLastChatTime(index)" :inpage="inpage"/>
				</view>
			</template>
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
			</template>
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
			store.dispatch("getOtherUser",d.cid).then((res)=>{
				this.touser = res
			})
		},
		data() {
			return {
				chatList:[],
				touser:null,
				cid:0,
				inpage:PageType.ChatUser,
				fromPage:0,
			}
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
		},
		methods: {
			queryList(pageNo,pageSize) {
				// console.log("queryList user chat befor")
				store.dispatch("loadMoreUserChat",{cid:this.cid,length:this.chatList.length}).then((res)=>{
					// console.log("queryList user chat ",res)
					if (res) {
						this.$refs.paging.complete(res)
					}else{
						this.$refs.paging.complete([])
					}
				})
				// .catch(()=>{
				// 	this.$refs.paging.complete([])
				// })
			},
			getLastChatTime(index) {
				return index+1 < this.chatList.length ? this.chatList[index+1].send_time : 0
			},
			onSendChatString(content) {
				this.sendChatMsg(ChatContentType.Text,content)
			},
			sendChatMsg(type,content) {
				var chat = util_chat.makeChatInfo(type,content,this.user)
				store.commit("sendUserChat",{cid:this.cid,chat:chat})
				this.$refs.paging.addChatRecordData([chat])
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
			}
		}
	}
</script>

<style>

</style>
