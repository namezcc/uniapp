<template>
	<view class="content">
		<z-paging v-if="firstLoaded || isCurrentPage" ref="paging" v-model="dataList" @query="queryList"
		 :default-page-size="pageSize" :fixed="customClick" :hide-empty-view="true">
			<uni-list>				
				<view v-for="(cid,index) in dataList" :key="index">
					<slot :item="cid">						
						<uni-swipe-action @touchmove.stop>
							<uni-swipe-action-item :right-options="option" @click="onDeleteChat(index)">
								<user-chat-list-item :cid="cid"></user-chat-list-item>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</slot>
				</view>
			</uni-list>
			<view v-if="this.firstLoaded && dataList.length == 0" style="width: 100%;">
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
	import { ServerConfig } from '@/common/define_const';
	import apihandle from '@/common/api_handle';
	import store from '../../store';
import { color } from '../../common/theme';
	
	export default {
		name:"page-user-chat",
		created() {
			uni.$on("user_chat_list",(res)=>{
				// console.log("user_chat_list ",res)
				this.$refs.paging.addChatRecordData([res]);
			})
			
			uni.$on("reloadUserChatData",()=>{
				this.$refs.paging.reload();
				this.reload = true
			})
		},
		beforeDestroy() {
			uni.$off(["user_chat_list","reloadUserChatData"])
		},
		data() {
			return {
				dataList: [],
				// 当前组件是否已经加载过了
				firstLoaded: false,
				// 是否滚动到当前页
				isCurrentPage: false,
				pageSize: ServerConfig.LoadTaskNum,
				option:[{
					text:"删除",
					style: {
						backgroundColor: '#f56c6c'
					}
				}]
			};
		},
		props:{
			// 当前组件的index，也就是当前组件是swiper中的第几个
			tabIndex: {
				default: 0
			},
			// 当前swiper切换到第几个index
			currentIndex: {
				default: 0,
			},
			customClick:{
				default:false
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if(newVal === this.tabIndex){
						// 懒加载，当滑动到当前的item时，才去加载
						if(!this.firstLoaded){
							// 这里需要延迟渲染z-paging的原因是为了避免在一些平台上立即渲染可能引发的底层报错问题
							this.$nextTick(() => {
								setTimeout(() => {
									this.isCurrentPage = true;
								}, 100);
							})
						}
					}
				},
				immediate: true
			},
		},
		methods:{
			queryList(pageNo,pageSize) {
				let ref = this.usecash ? false : pageNo == 1
				store.dispatch("loadUserChatList",{ref:ref,usecash:this.usecash}).then((res)=>{
					if (res) {
						this.$refs.paging.complete(res)
						if (this.reload == true) {
							this.reload = false
							uni.$emit("reloadUserChat")
						}
					}else{
						this.$refs.paging.complete([])
					}
					this.firstLoaded = true
				})
				this.usecash = false
			},
			onDeleteChat(index) {
				uni.showActionSheet({
					title:"删除聊天记录?",
					alertText:"删除聊天记录?",
					itemList:["删除"],
					itemColor: color.warn,
					success:()=> {
						console.log("delete chat ",index)
						let cid = this.dataList[index]
						store.commit("deleteUserChat",cid)
						this.usecash = true
						this.$refs.paging?.reload()						
					},
					fail() {
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		height: 100%;
	}
</style>