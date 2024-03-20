<template>
	<view >
		<!-- <expanded>			
		</expanded> -->
		<!-- <view style="width: 100%;height: 100%;">
		</view> -->
		<z-paging ref="paging" v-model="chatList" use-chat-record-mode use-virtual-list cell-height-mode="dynamic"
		@query="queryList" :hide-empty-view="true">
			<template #top>
				<uni-nav-bar :border="false" :shadow="true" :title="task.title" right-icon="more-filled" @clickRight="onMore"></uni-nav-bar>
			</template>
			<template #cell="{item,index}">					
				<view style="transform: scaleY(-1)">
					<!-- <text>{{item.content}}</text> -->
					<chat-item :chat="item" :lastChatTime="getLastChatTime(index)" :inpage="inpage"></chat-item>
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
							<uv-grid-item :index="2" :key="2" @click="onShowMember">
								<chat-icon name="成员">
									<uni-icons type="staff-filled" size="30"></uni-icons>
								</chat-icon>
							</uv-grid-item>
							<uv-grid-item :index="3" :key="3">
								<chat-icon name="完成任务">
									<uni-icons type="staff-filled" size="30"></uni-icons>
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
	import store from "@/store/index.js"
	import { ChatContentType, PageType } from '@/common/define_const';
	import util_chat from '@/common/util_chat';
	import { mapState } from "vuex"
	import utilHttp from "@/common/http_util.js"
	import util_task from '../../common/util_task';
	

	export default {
		props:{
			taskid:{
				require:true,
			}
		},
		data() {
			return {
				chatList:[],
				inpage:PageType.ChatTask,
			}
		},
		onLoad() {
			uni.$on("getTaskChat",this.onGetTaskChat)
		},
		onUnload() {
			uni.$off("getTaskChat")
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
			task() {
				return store.getters.getTaskById(this.taskid)
			}
		},
		methods: {
			queryList(pageNo,pageSize) {
				console.log("queryList")
				store.dispatch("loadMoreChat",{id:this.taskid,length:this.chatList.length}).then((res)=>{
					if (res) {
						this.$refs.paging.complete(res)
					}else{
						this.$refs.paging.complete([])
					}
				}).catch(()=>{
					this.$refs.paging.complete([])
				})
			},
			getLastChatTime(index) {
				return index+1 < this.chatList.length ? this.chatList[index+1].send_time : 0
			},
			onGetTaskChat(data) {
				console.log("emit ",data)
				
				this.$refs.paging.addChatRecordData(data.data)
				// if (data.count < 0) {
				// }else{
				// 	this.$refs.paging.complete(data.data)
				// }
			},
			onSendChatString(content) {
				this.sendChatMsg(ChatContentType.Text,content)
			},
			sendChatMsg(type,content) {
				var chat = util_chat.makeChatInfo(type,content,this.user)
				store.commit("sendTaskChat",{id:this.taskid,chat:chat})
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
			onShowMember() {
				uni.navigateTo({
					url:"/pages/task/task_member?taskid="+this.taskid,
				})
			},
			onMore() {
				uni.navigateTo({
					url:"/pages/task/task_info?taskid="+this.taskid
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";

</style>