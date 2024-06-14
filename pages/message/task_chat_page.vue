<template>
	<view class="" style="height: 100%;">
		<!-- <expanded>			
		</expanded> -->
		<!-- <view style="width: 100%;height: 100%;">
		:hide-empty-view="true"
		</view> -->
		<z-paging ref="paging" v-model="chatList" use-chat-record-mode safe-area-inset-bottom cell-height-mode="dynamic" bottom-bg-color="#f8f8f8"
		@query="queryList" @keyboardHeightChange="keyboardHeightChange" @hidedKeyboard="hidedKeyboard" :hide-empty-view="true">
			<template #top>
				<!-- <uni-nav-bar :border="false" :shadow="false" :title="task.title" right-icon="more-filled" @clickRight="onMore" backgroundColor="#F8F8F8"></uni-nav-bar> -->
				<view style="padding: 5px 10px;background-color: #F8F8F8;">
					<myrow mainAlign="space-between">
						<view style="">							
							<myrow>								
								<avatar :src="taskicon" :usercid="task.cid" :tocid="task.cid" :inpage="inpage"></avatar>
								<text style="text-overflow: ellipsis;">{{userName}}</text>
							</myrow>
						</view>
						<!-- <view class="class-ceter">
							
						</view> -->
						<!-- <expanded>
						</expanded> -->
						<view style="" @click="onMore">
							<myrow mainAlign="flex-end">
								<text>({{taskPeopleNum}})</text>
								<uni-icons style="margin: 0px 5px;" type="right" size="28px"></uni-icons>
							</myrow>
						</view>
					</myrow>
				</view>
			</template>
			<!-- <template #cell="{item,index}">
			</template> -->
			<view style="transform: scaleY(-1)" v-for="(item,index) in chatList" :key="index">
				<chat-item :chat="item" :lastChatTime="getLastChatTime(index)" :inpage="inpage"></chat-item>
			</view>
			<template #bottom>
				<chat-input @sendmsg="onSendChatString" ref="inputBar">
					<template #customBoard>
						<uv-grid :col="4" :border="false">
							<uv-grid-item :index="0" :key="0" @click="onChooseImage">
								<chat-icon name="图片">
									<uni-icons type="image" size="30"></uni-icons>
								</chat-icon>
							</uv-grid-item>
							<uv-grid-item :index="2" :key="2" @click="onShowMember">
								<chat-icon name="成员">
									<uni-icons type="staff-filled" size="30"></uni-icons>
								</chat-icon>
							</uv-grid-item>
						</uv-grid>
					</template>
				</chat-input>
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
	import store from "@/store/index.js"
	import { ChatContentType, PageType } from '@/common/define_const';
	import util_chat from '@/common/util_chat';
	import { mapState } from "vuex"
	import utilHttp from "@/common/http_util.js"
	import util_task from '../../common/util_task';
import apihandle from "../../common/api_handle";
import util_common from "../../common/util_common";
	

	export default {
		props:{
			taskid:{
				require:true,
			}
		},
		data() {
			return {
				chatList:[],
				chatlen:0,
				inpage:PageType.ChatTask,
				taskicon:"",
				taskuser:null,
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title:this.task.title,
			})
			
			uni.$on("getTaskChat",this.onGetTaskChat)
			uni.$on("reloadTaskChatData",this.onReloadData)
			uni.$on("onKickOutTask",this.onTaskBeKick)
			
			store.commit("saveTaskChatIndex",this.taskid)
			
			store.dispatch("getOtherUser",this.task.cid).then((res)=>{
				if (res) {
					this.taskuser = res
					this.taskicon = res.icon
					// console.log("user icon ",res.icon)
				}
			})
		},
		onUnload() {
			uni.$off(["getTaskChat","reloadTaskChatData","onKickOutTask"])
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
			task() {
				return store.getters.getTaskById(this.taskid) || {}
			},
			taskPeopleNum() {
				let num = util_task.getJoinNum(this.task)
				return (num[0]+num[1])+"/"+this.task.people_num
			},
			userName() {
				return this.taskuser?.name || ""
			}
		},
		methods: {
			queryList(pageNo,pageSize) {
				// console.log("queryList")
				store.dispatch("loadMoreChat",{id:this.taskid,length:this.chatlen}).then((res)=>{
					if (res) {
						// res.reverse()
						this.chatlen += res.length
						this.$refs.paging.complete(res)
					}else{
						this.$refs.paging.complete([])
					}
				}).catch(()=>{
					this.$refs.paging.complete([])
				})
			},
			keyboardHeightChange(res) {
				if (res.height > 0) {
					this.$refs.inputBar.onInputFocus();
				}
			}, 
			// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
			hidedKeyboard() {
				this.$refs.inputBar.onInputFocus();
			},
			getLastChatTime(index) {
				// console.log("index:",index,this.chatList[index])
				return index+1 < this.chatList.length ? this.chatList[index+1].send_time : 0
				// return index-1 >= 0 ? this.chatList[index-1].send_time : 0
			},
			onGetTaskChat(data) {
				// console.log("emit ",data)
				
				this.$refs.paging.addChatRecordData(data.data[0])
				this.chatlen += 1
				store.commit("saveTaskChatIndex",this.taskid)
				// if (data.count < 0) {
				// }else{
				// 	this.$refs.paging.complete(data.data)
				// }
			},
			onReloadData() {
				if (store.getters.getTaskById(this.taskid) == null) {
					uni.switchTab({
						url: '/pages/message/task_join'
					});
					return
				}
				this.chatlen = 0
				this.$refs.paging.reload()
				// console.log("reload task chat")
			},
			onTaskBeKick(id) {
				if (id == this.taskid) {
					uni.switchTab({
						url: '/pages/message/task_join'
					});
				}
			},
			onSendChatString(content) {
				if (this.task.delete > 0) {
					apihandle.toast("任务已解散")
					return
				}
				this.sendChatMsg(ChatContentType.Text,content)
			},
			sendChatMsg(type,content) {
				var chat = util_chat.makeChatInfo(type,content,this.user)
				store.commit("sendTaskChat",{id:this.taskid,chat:chat})
				this.$refs.paging.addChatRecordData(chat)
				this.chatlen += 1
			},
			sendImageMsg(url) {
				var msg = `|img: ${url}#0,0|`
				this.sendChatMsg(ChatContentType.Image,msg)
			},
			onChooseImage() {
				if (this.task.delete > 0) {
					apihandle.toast("任务已解散")
					return
				}
				uni.chooseImage({
					count: 9,
					sourceType: ['album'],
					success: (cres) => {
						// const tempFilePaths = cres.tempFilePaths;
						let flist = util_common.getTempFileList(cres)
						uni.showLoading({
							title:"发送中..."
						})
						util_common.uploadFileList(flist).then((vec)=>{
							for (let url of vec) {
								this.sendImageMsg(url)
							}
							uni.hideLoading()
						})
						// for (let img of tempFilePaths) {					
						// 	utilHttp.uploadImage(img,(res)=>{
						// 		// console.log('上传成功', res);
						// 		// console.log('上传数据转换',JSON.parse(res.data));
						// 		// 取到文档服务器的值
						// 		let uploaddata = JSON.parse(res.data)
						// 		let url = util_task.getImageUrlName(uploaddata.data)
						// 		this.sendImageMsg(url)
						// 	})
						// }
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
			},
			testReload() {
				store.commit("reloadTaskChatData")
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";

</style>