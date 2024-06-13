<template>
	<view>
		<template v-if="isText">
			<view class="msg-content" :style="{backgroundColor:textColor}">
				<!-- <rich-text :nodes="emojiText">
				</rich-text>	 -->			
				<text>{{chat.content}}</text>
			</view>
		</template>
		<template v-if="isImage">
			<view class="">
				<image :src="imageUrl" mode="aspectFit" class="msg-image" @click="previewImage(imageUrl)"></image>
			</view>
		</template>
		<template v-if="isTask">
			<view class="msg-task">
				<uni-card :title="`任务:${taskInfo.title}`" @click="toTaskInfoPage(taskInfo.id)">
					<myrow mainAlign="center">
						<text>点击查看详情</text>
					</myrow>
				</uni-card>
			</view>
		</template>
	</view>
</template>

<script>
	import { ChatContentType } from '../../common/define_const';
	import util_emoji from '../../common/util_emoji';
	import util_string from '../../common/util_string';
	import util_task from '../../common/util_task';
import store from '../../store';
	
	
	export default {
		name:"chat-item-content",
		props:{
			chat:{
				require:true
			},
			self:{
				default:true
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			isText() {
				return this.chat.content_type == ChatContentType.Text
			},
			isImage() {
				return this.chat.content_type == ChatContentType.Image
			},
			isTask() {
				return this.chat.content_type == ChatContentType.Task
			},
			textColor() {
				return this.self ? '#00d861':"#fff"
			},
			emojiText() {
				var vec = util_string.splitByMarkers(this.chat.content,'[',']',true)
				var res = []
				let lasts = ""
				
				for (let s of vec) {
					let emoji = util_emoji.getEmoji(s)
					if (emoji != null) {
						if (lasts != "") {
							res.push({
								type:'text',
								text:lasts,
							})
							lasts = ""
						}
						res.push({
							type:'node',
							name:'img',
							attrs:{
								class:"emoji",
								height:"20px",
								width:"20px",
								src:util_task.getImageUrlName(`emoji/${s}.png`)
							}
						})
					}else{
						lasts += s
					}
				}
				if (lasts != "") {
					res.push({
						type:'text',
						text:lasts,
					})
				}
				return [{
					name:'div',
					attrs:{
						class:"msg-text",
					},
					children:res
				}]
			},
			imageUrl() {
				let c = this.chat.content.replace("|img: ","")
				let vec = c.split("#")
				// console.log("chat image url ",vec[0],c)
				return vec[0]
			},
			taskInfo() {
				let c = this.chat.content.replace("|task ","").replace("|","")
				let vec = c.split("#")
				return {id:vec[0],title:vec[1]}
			}
		},
		methods:{
			toTaskInfoPage(id) {
				// console.log("to task ",id)
				uni.navigateTo({
					url:"/pages/task/task_info?taskid="+id
				})
				// var task = store.getters.getTaskById(id)
				// if (task) {
				// }else{
				// 	store.dispatch("loadTaskOne",id).then((res)=>{
				// 		if (res) {
				// 			uni.navigateTo({
				// 				url:"/pages/task/task_info?taskid="+id
				// 			})
				// 		}
				// 	})
				// }
			},
			previewImage(url) {
				uni.previewImage({
					urls:[url]
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/style/my.scss";
	
	.msg-content {
		// margin: 0 16rpx;
		flex-direction: row;
		align-items: center;
		max-width: 375rpx;
		width: fit-content;
		border-radius: 10rpx;
		padding: 10rpx;
	}
	
	.emoji {
		width: 20px;
		height: 20px;
	}
	
	.msg-text {
		font-size: 30rpx;
		justify-content: space-between;
		// max-width: 250rpx;
		/* #ifndef APP-NVUE */
		word-break: break-all;
		user-select: text;
		cursor: text;
		/* #endif */
	}
	
	.msg-image {
		// display: flex;
		max-height: 200rpx;
		max-width: 200rpx;
		// width: fit-content;
		
		// min-width: 50rpx;
		// height: fit-content;
		// width: 375rpx;
	}
	
	.msg-task {
		max-width: 650rpx;
	}
		
</style>