<template>
	<view class="" style="height: 100%;">
		<!-- <chat-list :dataList="chatList" @onLoadData="onLoadChat" ref="chatlist">
			<template v-slot="{item}">
				<text>{{item}}</text>
			</template>
		</chat-list> -->
		<!-- <myrow>
			<button @click="onAddChat">增加</button>
			<button @click="onLoadChat(true)">加载</button>
		</myrow> -->
		<z-paging ref="paging" v-model="showData" use-chat-record-mode safe-area-inset-bottom cell-height-mode="dynamic" bottom-bg-color="#f8f8f8"
				@query="queryList" >
				<!-- <template #top>
					<uni-nav-bar :border="false" :shadow="false" title="aaaaaa" right-icon="more-filled" @clickRight="onMore" backgroundColor="#F8F8F8"></uni-nav-bar>
				</template> -->
					<!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置！！！ -->
					<!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
				<!-- <template #cell="{item,index}">
					<view style="transform: scaleY(-1)">
						<view class="">
							<text>{{showItem(item)}}</text>
						</view>
					</view>
				</template> -->
				<view v-for="(item,index) in showData" :key="index" style="transform: scaleY(-1)">
					<view style="height: 100px;">
						<text>{{showItem(item)}}</text>
					</view>
				</view>
				<template #bottom>
					<chat-input @sendmsg="onSendChatString" ref="inputBar">
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
								<uv-grid-item :index="3" :key="3" @click="onAddChat">
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
	
	function initChat(len) {
		let vec = []
		for (var i = 0; i < len; i++) {
			vec.push(`chat:${i}`)
		}
		return vec
	}
	
	export default {
		data() {
			let chat = initChat(0)
			return {
				scrollpos:0,
				showMaxLen:50,
				moveLen:10,
				chatList:chat,
				showData:[],
				chatid:0,
				contentHeight:0,
				nowScrollTop:0,
				scrollY:true,
			}
		},
		methods: {
			async loadChat() {
				return []
			},
			queryList(pageNo,pageSize) {
				this.loadChat().then(()=>{
					this.$refs.paging.complete([])
				})
			},
			addItem(item,toBottom = false) {
				this.chatList.push(item)
				if (toBottom) {
					this.scrollToBottom()	
				}
			},
			loadItem(vec) {
				this.chatList.splice(0,0,...vec)
				this.keepScrollPos()
			},
			onAddChat() {
				this.chatid++
				// this.$refs.chatlist.addItem([`chat: ${this.chatid}`])
				let info = {
					msg:`chat: ${this.chatid}`,
				}
				this.$refs.paging.addChatRecordData([info])
			},
			showItem(item) {
				// console.log(item)
				return item.msg
			},
			onLoadChat(load = false) {
				if (this.chatid > 0 && !load) {
					this.$refs.chatlist.loadItem([])
					return
				}
				let vec = []
				for (var i = 0; i < 10; i++) {
					this.chatid++
					vec.push(`chat: ${this.chatid+100}`)
				}
				this.$refs.chatlist.loadItem(vec.reverse())
				// this.loadItem(vec.reverse())
			},
			onRemoveChat() {
				this.chatList.splice(0,10)
			},
			onSendChatString(content) {
				let info = {
					msg:content,
				}
				this.$refs.paging.addChatRecordData([info])
			},
			onChooseImage(){},
			onShowMember(){},
			onMore(){},
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
</style>
