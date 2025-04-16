<template>
	<view class="col-class" style="height: 100%;">
		<view class="top-box"></view>
		<view class="top-part" :style="{'paddingBottom':'0px'}">			
			<uv-status-bar></uv-status-bar>
			<myrow :customStyle="{padding: '10px 18px'}">
				<view @click="switchSelectType(0)">
					<text-switch text="线下帮帮" :open="selectType==0" bgheight="8px"></text-switch>
				</view>
				<view style="width: 26px;"></view>
				<view @click="switchSelectType(1)">
					<text-switch text="线上帮帮" :open="selectType==1" bgheight="8px"></text-switch>
				</view>
				<view style="width: 26px;"></view>
				<view @click="toHelpPage">
					<text-switch text="使用帮助" :open="false" bgheight="8px" ></text-switch>
				</view>
			</myrow>
			<myrow :customStyle="{padding: '10px 18px'}">
				<uv-search :disabled="true" placeholder="搜索" bgColor="#fff" :showAction="false" @click="onToSearchPage"></uv-search>
				<!-- <button class="fill-btn-primary" style="width: 60px;height: 30px;font-size: 14px;margin-left:10px;" @click="onAddTask">发布</button> -->
			</myrow>
			<!-- <myrow mainAlign="center">
				<view class="select-box" :class="{'select-color': selectType==0}" @click="switchSelectType(0)">
					线下帮帮
				</view>
				<view style="width: 20px;"></view>
				<view class="select-box" :class="{'select-color': selectType==1}" @click="switchSelectType(1)">
					线上帮帮
				</view>
				<view style="width: 20px;"></view>
				<view class="select-box" @click="toHelpPage">
					使用帮助
				</view>
			</myrow> -->
		</view>
		<uni-popup ref="actionPop" type="center" >
			<view class="help-main">
				<view class="help-box" @click="onSelectPubType(1)">
					<myrow mainAlign="center">
						<image style="max-width: 18px;max-height: 18px;" src="@/static/icon_help.png"></image>
						<view style="margin-left: 14px;">
							寻求帮助
						</view>
					</myrow>
				</view>
				<view class="help-box" @click="onSelectPubType(0)">
					<myrow mainAlign="center">
						<image style="max-width: 18px;max-height: 18px;" src="@/static/icon_active.png"></image>
						<view style="margin-left: 14px;">
							活动组局
						</view>
					</myrow>
				</view>
				<view class="help-box" style="margin-bottom: 0px;" @click="onSelectPubType(2)">
					<myrow mainAlign="center">
						<image style="max-width: 18px;max-height: 18px;" src="@/static/icon_service.png"></image>
						<view style="margin-left: 14px;">
							提供服务
						</view>
					</myrow>
				</view>
			</view>
		</uni-popup>
		<uv-action-sheet ref="actionShare" :actions="taskTypeList" title="选择类型" cancelText="取消"
		round="10" @select="onSelectShare"></uv-action-sheet>
		<!-- <view style="flex: 1;">
		</view> -->
			<scroll-view v-show="selectType == 0" scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh" :refresherTriggered="refreshFinish" 
			style="height: 0;flex: 1;" class="scroll-view" @scrolltolower="onLoadMore">
				<view class="">
					<myrow mainAlign="center" :customStyle="{margin: '10px'}">
						<image style="width: 153px;height: 90px;" :src="srchost+'src/index_bg.png'"></image>
					</myrow>
					<view class="option-box" style="margin: 5px 0px 0px 0px;padding: 10px 0px 10px 0px;">				
						<myrow>
							<view class="" style="margin: 0px 21px;" @click="switchCond(0)">
								<text-switch text="全部" :open="condIndex==0" :small="true"/>
							</view>
							<view class="" @click="switchCond(1)">
								<text-switch text="有奖励" :open="condIndex==1" :small="true"/>
							</view>
							<!-- <view class="cond-box" :class="{'cond-open': haveMoney}" @click="switchCond(1)">
								有奖励
							</view> -->
						</myrow>
					</view>
					<view class="view-main">					
						<uv-list :customStyle="{backgroundColor: 'transparent'}">
							<template v-for="(task,index) in genTaskList" :key="index">
								<uv-list-item @click="toTaskInfo(task)" :clickable="true" :customStyle="{backgroundColor: 'transparent'}">
									<task-item :task="task"></task-item>
								</uv-list-item>
							</template>
							<uv-list-item :customStyle="{backgroundColor: 'transparent'}">
								<uni-load-more :status="loadState"></uni-load-more>
							</uv-list-item>
						</uv-list>
					</view>
				</view>
			</scroll-view>
			<scroll-view v-show="selectType == 1" scroll-y="true" :refresherEnabled="true" @refresherrefresh="onPullDownRefresh" :refresherTriggered="onlineRefreshFinish"
			style="height: 0;flex: 1;" class="scroll-view" @scrolltolower="onLoadMore">
				<view class="">
					<myrow mainAlign="center" :customStyle="{margin: '10px'}">
						<image style="width: 153px;height: 90px;" :src="srchost+'src/index_bg.png'"></image>
					</myrow>
					<view class="option-box" style="margin: 5px 0px 0px 0px;padding: 10px 0px 10px 0px;">
						<myrow>
							<view class="" style="margin: 0px 21px;" @click="switchCond(0)">
								<text-switch text="全部" :open="condIndexOnline==0" :small="true"/>
							</view>
							<view class="" @click="switchCond(1)">
								<text-switch text="有奖励" :open="condIndexOnline==1" :small="true"/>
							</view>
							<!-- <view class="cond-box" :class="{'cond-open': haveMoney}" @click="switchCond(1)">
								有奖励
							</view> -->
						</myrow>
					</view>
					<view class="view-main">	
						<uv-list :customStyle="{backgroundColor: 'transparent'}">
							<template v-for="(task,index) in genOnlineTaskList" :key="index">
								<uv-list-item @click="toTaskInfo(task)" :clickable="true" :customStyle="{backgroundColor: 'transparent'}">
									<task-item :task="task"></task-item>
								</uv-list-item>
							</template>
							<uv-list-item :customStyle="{backgroundColor: 'transparent'}">
								<uni-load-more :status="onlineLoadState"></uni-load-more>
							</uv-list-item>
						</uv-list>
					</view>
				</view>
			</scroll-view>
			<button class=" fixed-button" @click="onAddTask">
				<myrow mainAlign="center">
					<uni-icons type="paperplane-filled" :color="theme.primary" size="22"></uni-icons>
					<text class="button-text" style="margin-left: 6px;">我要发布</text>
				</myrow>
			</button>
	</view>
</template>

<script>
	import {color as mycolor} from "@/common/theme.js"
	import httputil from "@/common/http_util.js"
	import { EnumLoadState, ErrCode, LoadState,ServerConfig, SrcHost, UpdateEventType } from "@/common/define_const.js"
	import store from "@/store/index.js"
	import api from "@/common/api_handle.js"
	import util_task from "@/common/util_task"
import global_data from "../../common/global_data"
import util_page from "../../common/util_page"
	
	var taskConfig = util_task.newTaskConfig()
	var taskSelectType = {
		OffLine: 0,
		OnLine: 1,
	}
	
	export default {
		data() {
			return {
				winHeight: 0,
				refreshFinish: false,
				onlineRefreshFinish: false,
				navcolor:mycolor.primary,
				theme:mycolor,
				taskList:[],
				onlineTaskList:[],
				loadState: EnumLoadState.More,
				onlineLoadState: EnumLoadState.More,
				selectType:taskSelectType.OffLine,
				condIndex:0,
				condIndexOnline:0,
				onlineloaded:false,
				condMoney:false,
				condMoneyOnline:false,
				srchost:SrcHost,
				taskTypeList:[
					{name:"活动组局",value:0},
					{name:"寻求帮助",value:1},
					{name:"提供服务",value:2},
				]
			}
		},
		onLoad() {
			console.log("get apiGetTaskInfo")
			uni.getSystemInfo({
			  success: (res) => {
				this.winHeight = res.windowHeight
			  }
			})
			
			console.log("index onload")
			uni.$on("onGetUserData",()=>{
				this.onGetUserData()
			})
			
			this.refreshTaskList()
			// getlocation
			// uni.getLocation({
			// 	isHighAccuracy:true,
			// 	success: (res) => {
			// 		// console.log("get location ",res)
			// 		store.commit("setLocation",{latitude:res.latitude,longitude:res.longitude})
			// 	},
			// })
			
			uni.getFuzzyLocation({
				success:(res)=>{
					console.log("get location ",res)
					store.commit("setLocation",{latitude:res.latitude,longitude:res.longitude})
				},
				fail:(res)=>{
					console.log("get location fail",res)
				}
			})
			
			// uni.$on(UpdateEventType.Task,(tid)=>{
			// 	if (this.taskList.find(v=> v == tid)) {
			// 		// console.log("task update ",tid)
			// 		// this.taskList = [...this.taskList]
			// 		// this.taskList = this.taskList
			// 	}
			// })
			
			
		},
		computed: {
			genTaskList() {
				var res = [];
				for (let id of this.taskList) {
					var v = store.getters.getTaskById(id)
					if (v) {
						res.push(v)
					}
				}
				// console.log("genTaskList ",res)
				return res
			},
			genOnlineTaskList() {
				var res = [];
				for (let id of this.onlineTaskList) {
					var v = store.getters.getTaskById(id)
					if (v) {
						res.push(v)
					}
				}
				// console.log("genTaskList ",res)
				return res
			},
			haveMoney() {
				return this.selectType == taskSelectType.OffLine ? this.condMoney : this.condMoneyOnline
			}
		},
		onShareAppMessage(res) {
			return {
				title:"帮帮委托",
				path:"/pages/index/index",
				// imageUrl:image,
			}
		},
		onShareTimeline(res) {
			// console.log("onShareTimeline:",res)
			return {
				title:"帮帮委托",
				query:""
				// imageUrl:image,
			}
		},
		methods: {
			onAddTask() {
				// console.log("add task")
				// let aa = null
				// let b = aa.key
				
				if (store.getters.isLogin) {
					// uni.navigateTo({
					// 	url:"/pages/task/task_add"
					// 	// url:"/pages/message/test_chat_page"
					// 	// url:"/pages/web/web_xy_nrfb"
					// })
					// this.$refs.actionShare.open()
					this.$refs.actionPop.open('center')
					
				}else{					
					uni.navigateTo({
						url:"/pages/user/login"
					})
					// uni.login({
					// 	provider:"weixin",
					// 	fail:(res)=>{
					// 		console.log("login fail",res)
					// 	},
					// 	success:(res)=>{
					// 		console.log("login success",res)
					// 	}
					// })
					
					// uni.getUserInfo({
					// 	provider:"weixin",
					// 	fail:(res)=>{
					// 		console.log("getUserInfo fail",res)
					// 	},
					// 	success:(res)=>{
					// 		console.log("getUserInfo success",res)
					// 	}
					// })
					
					// uni.getUserProfile({
					// 	desc:"获取信息用于展示",
					// 	fail:(res)=>{
					// 		console.log("getUserInfo fail",res)
					// 	},
					// 	success:(res)=>{
					// 		console.log("getUserInfo success",res)
					// 	}
					// })
				}
			},
			onSelectShare(e) {
				console.log("select share:",e.value)
				uni.navigateTo({
					url:"/pages/task/task_add?tasktype="+e.value
					// url:"/pages/message/test_chat_page"
					// url:"/pages/web/web_xy_nrfb"
				})
			},
			onSelectPubType(val) {
				this.$refs.actionPop.close()
				uni.navigateTo({
					url:"/pages/task/task_add?tasktype="+val
				})
			},
			onToSearchPage() {
				if (global_data.isLogin()) {					
					uni.navigateTo({
						url:"/pages/task/task_search"
					})
				}else{
					util_page.toLoginPageDialog()
				}
			},
			async onPullDownRefresh() {
				let stype = this.selectType
				if (stype == taskSelectType.OffLine) {
					this.refreshFinish = true
				}else{
					this.onlineRefreshFinish = true
				}
				
				await this.refreshTaskList()
				
				if (stype == taskSelectType.OffLine) {
					this.refreshFinish = false
				}else{
					this.onlineRefreshFinish = false
				}
			},
			onLoadMore() {
				if (this.selectType == taskSelectType.OffLine) {
					if (this.loadState != EnumLoadState.More) {
						return
					}
					this.loadState = EnumLoadState.Loading
				}else{
					if (this.onlineLoadState != EnumLoadState.More) {
						return
					}
					this.onlineLoadState = EnumLoadState.Loading
				}
				this.getTaskList(false)
			},
			async refreshTaskList() {
				taskConfig = util_task.newTaskConfig()
				await this.getTaskList(true)
			},
			async getTaskList(ref) {
				let stype = this.selectType
				taskConfig.select_type = stype
				let condmoney = stype == taskSelectType.OffLine ? this.condMoney : this.condMoneyOnline
				taskConfig.haveMoney = condmoney ? 1 : 0;
				var res = await api.apiGetTaskInfo(taskConfig)
				if (res?.data.length) {
					// console.log(res)
					taskConfig = res.config
					store.commit("updateTaskData",res.data)
					let ndata = res.data.map(v=>v.id)
					if (stype == taskSelectType.OffLine) {
						if (ref) {
							this.taskList = ndata
						}else{
							this.taskList.push(...ndata)
						}
						if (taskConfig.locMax > 0) {
							this.loadState = EnumLoadState.noMore
						}else{
							this.loadState = EnumLoadState.More
						}						
					} else{
						if (ref) {
							this.onlineTaskList = ndata
						}else{
							this.onlineTaskList.push(...ndata)
						}
						if (taskConfig.globelMax > 0) {
							this.onlineLoadState = EnumLoadState.noMore
						}else{
							this.onlineLoadState = EnumLoadState.More
						}						
					}
				}else{
					if (stype == taskSelectType.OffLine) {
						if (ref) {
							this.taskList = []
						}
						this.loadState = EnumLoadState.noMore						
					}else{
						if (ref) {
							this.onlineTaskList = []
						}
						this.onlineLoadState = EnumLoadState.noMore						
					}
				}
			},
			toTaskInfo(task) {
				// console.log("toTaskPage ")
				uni.navigateTo({
					url:"/pages/task/task_info?taskid="+task.id,
					fail:(e) => {
						console.log("fail ",e)
					}
				})
			},
			switchSelectType(stype) {
				if (this.selectType == stype) {
					return
				}
				
				this.selectType = stype
				if (stype == taskSelectType.OnLine && this.onlineloaded == false) {
					this.onlineloaded = true
					
					this.refreshTaskList()
				}
			},
			switchCond(stype) {
				if (this.selectType == taskSelectType.OffLine) {
					if (stype == this.condIndex) {
						return
					}
					this.condIndex = stype
					
					this.condMoney = stype == 1
				}else{
					if (stype == this.condIndexOnline) {
						return
					}
					this.condIndexOnline = stype
					
					this.condMoneyOnline = stype == 1
				}
				this.refreshTaskList()
			},
			toHelpPage() {
				uni.navigateTo({
					url:"/pages/setting/help_page"
				})
			},
			onGetUserData() {
				console.log("onGetUserData")
				// uni.getUserProfile({
				// 	desc:"设置微信昵称和头像",
				// 	success: (sures) => {
				// 		console.log("get wexin user",sures)
				// 	},
				// 	fail: (err) => {
				// 		console.log("get weixin info fail",err)
				// 	}
				// })
				uni.navigateTo({
					url:"/pages/edit/edit_page?tip=1",
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	.top-box {
		background: linear-gradient( 205deg, #56FAF2 0%, #BDF6FB 100%);
		position: fixed;
		top: 0px;
		width: 100%;
		height: 300px;
		z-index: 1;
	}
	
	.top-part {
		background-color: transparent;
		z-index: 2;
	}
	
	.option-box {
		background: linear-gradient( 180deg, #FFFFFF 0%, #F7F7F7 100%);
		border-radius: 13px 13px 0px 0px;
		position: sticky;
		top: 0;
		z-index: 4;
	}
	
	.scroll-view {
		z-index: 3;
	}
	
	.view-main {
		background-color: #f5f5f5;
		min-height: 100px;
	}
	
	.select-box {
		border-radius: 20px;
		padding: 5px 15px;
		color: $uni-base-color;
		font-size: 14px;
	}
	
	.select-color {
		background-color: $uni-success-light;
		color: $uni-main-color;
	}
	
	.cond-box {
		border-radius: 20px;
		padding: 3px 8px;
		color: $uni-base-color;
		font-size: 12px;
		background-color: #ddd;
	}
	
	.cond-close {
		background-color: #ccc;
	}
	
	.cond-open {
		background-color: #d8fdff;
		color: $uni-main-color;
	}
	
	.txt-help {
		color: $uni-main-color;
	}
	
	// .help-box {
	// 	border-radius: 20px;
	// 	padding: 3px 8px;
	// 	background-color: $uni-success-light;
	// }
	
	.fixed-button {
		position: fixed;
		display: flex; /* 开启flex布局 */
		justify-content: center; /* 水平居中对齐 */
		align-items: center; /* 垂直居中对齐 */
		left: 50%;
		transform: translateX(-50%);
		bottom: 36px;
		border-radius: 23px;
		background-color: $my-color-btn-primary;
		color: $my-color-text-primary;
		// height: 40px;
		// padding: 1px 10px;
		// width: 200px;
		width: 172px;
		height: 46px;
		z-index: 100;
	}
	
	.button-text {
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 14px;
		line-height: 20px;
		text-shadow: 0px 2px 4px rgba(0,0,0,0.1);
		text-align: left;
		font-style: normal;
	}
	
	.help-main {
		background-color: #fff;
		border-radius: 18px;
		padding: 20px 40px;
	}
	
	.help-box {
		width: 200px;
		height: 45px;
		border-radius: 9px;
		background: #222222;
		margin: 0px 0px 26px 0px;
		display: flex; /* 开启flex布局 */
		justify-content: center; /* 水平居中对齐 */
		align-items: center; /* 垂直居中对齐 */
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 16px;
		color: #1EFE8F;
		line-height: 22px;
		text-align: left;
		font-style: normal;
		// height: 80px;
	}
	
</style>
