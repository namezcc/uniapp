<template>
	<!-- <view style="height: 100%;">
	</view> -->
	<scroll-view class="chat-scroll" :scroll-y="scrollY" style="height: 0;flex: 1;" :scroll-top="scrollpos" @scrolltoupper="loadUpdata"
	@scrolltolower="loadBottomData" @scroll="onScroll" >
		<view class="chat-content">
			<view v-for="(item,index) in showData" :key="index" :id="`id-${index+showStart}`">
				<!-- <text>{{s}}</text> -->
				<slot :item="item" :index="index+showStart"></slot>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		name:"chat-list",
		emits: ['onLoadData'],
		props:{
			showMaxLen:{
				default:50
			},
			moveLen:{
				default:10
			},
			dataList:{
				require:true
			},
			pageSize:{
				default:20
			}
		},
		data() {
			return {
				showData:[],
				showStart:0,
				showEnd:0,
				scrollpos:0,
				contentHeight:0,
				viewHeight:0,
				nowScrollTop:0,
				canLoadUp:true,
				scrollY:true,
				pageNo:0,
				keeplen:0,
				oldtop:0,
				oldheight:0,
				scrollid:"",
			};
		},
		mounted() {
			if (this.dataList.length == 0) {
				this.$emit("onLoadData",this.pageNo+1,this.pageSize)
			}else{
				this.initData()
			}
		},
		updated() {
			console.log("datalen ",this.dataList.length)
			if (this.keeplen > 0) {
				this.keepScrollPos(()=>{
					if (this.showData.length > this.showMaxLen) {						
						this.showEnd -= this.keeplen
						// this.showData.splice(this.showData.length-len ,len)
						this.updateShowData()
					}
					this.$nextTick(()=>{
						this.getContentHeight()
						// this.scrollY = true
					})
				})
				this.keeplen = 0
			}
		},
		methods:{
			initData() {
				if (this.dataList.length >= this.showMaxLen) {
					this.showStart = this.dataList.length - this.showMaxLen
					this.showEnd = this.dataList.length
				}else{
					this.showStart = 0
					this.showEnd = this.dataList.length
				}
				// this.showData = this.dataList.slice(this.showStart,this.showEnd)
				// console.log("start end",this.showStart,this.showEnd)
				this.updateShowData()
				this.scrollToBottom()
			},
			updateShowData() {
				// this.getContentHeight()
				this.showData = this.dataList.slice(this.showStart,this.showEnd)
				// this.getContentHeight()
			},
			onScroll(e) {
				// console.log("scroll ",e)
				this.nowScrollTop = e.detail.scrollTop
				this.contentHeight = e.detail.scrollHeight
				// console.log("scroll top heigth",this.nowScrollTop,this.contentHeight)
			},
			getContentHeight() {
				const query = uni.createSelectorQuery().in(this);
				  // 选择我们想要的元素
				query.select('.chat-content').boundingClientRect(data => {
				// data是一个包含元素尺寸信息的对象，如果元素存在，其高度可以通过data.height获取
					if (data) {
					  // console.log('元素的高度：', data.height);
					  this.contentHeight = data.height;
					}
				}).exec(); // 执行查询
			},
			addItem(item) {
				let toBottom = false
				let oldlen = this.dataList.length
				this.dataList.push(...item)
				if (this.contentHeight - this.nowScrollTop < this.viewHeight+50) {
					toBottom = true
				}
				if (toBottom) {
					this.initData()
				}else{
					// if (this.showEnd == oldlen) {
					// 	this.loadBottomData()
					// }
				}
			},
			addChatRecordData(res,toBottom = false) {
				this.addItem(res,toBottom)
			},
			loadItem(vec) {
				if (vec.length < this.pageSize) {
					this.canLoadUp = false
					if (vec.length <= 0) {
						return
					}
				}else{
					this.pageNo++
				}
				this.dataList.splice(0,0,...vec)
				this.showStart += vec.length
				this.showEnd += vec.length
				this.loadUpdata()
			},
			complete(res) {
				this.loadItem(res)
			},
			removeChat() {
				this.dataList.splice(0,10)
			},
			scrollToBottom() {
				this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.chat-scroll').boundingClientRect()
				query.select('.chat-content').boundingClientRect()
				query.exec(res => {
				  const scrollViewHeight = res[0].height
				  const scrollContentHeight = res[1].height
				  this.contentHeight = scrollContentHeight
				  this.viewHeight = scrollViewHeight
				  // console.log("content view",scrollContentHeight,scrollViewHeight)
				  if (scrollContentHeight > scrollViewHeight) {
					const scrollTop = scrollContentHeight - scrollViewHeight
					this.scrollpos = scrollTop
				  }
				})
			  })
			},
			keepScrollPos(callback = null) {
				// this.scrollpos = this.nowScrollTop
				let oldtop = this.oldtop
				let oldhei = this.oldheight
				// this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this)
					query.select('.chat-content').boundingClientRect()
					query.select('.chat-scroll').boundingClientRect()
					query.exec(res => {
					  const scrollContentHeight = res[0].height
					  const viewHeight = res[1].height
					  this.viewHeight = viewHeight
					  // console.log("content view",scrollContentHeight,viewHeight)
					  if (viewHeight < scrollContentHeight) {					  	
						  let old = oldhei
						  this.contentHeight = scrollContentHeight
						  let diff = scrollContentHeight - old
						  console.log("content height old diff ",scrollContentHeight,oldhei,diff)
						  this.scrollpos = diff + oldtop
					  }
					  if (callback) {
					  	callback()
					  }
					})
				// })
			},
			loadUpdata() {
				if (this.showStart <= 0) {
					if (!this.canLoadUp) {
						return
					}
					this.$emit("onLoadData",this.pageNo+1,this.pageSize)
					return
				}
				// console.log("loadUpdata")
				// this.scrollY = false
				let len = this.showStart >= this.moveLen ? this.moveLen : this.showStart
				this.showStart -= len
				// let upvec = this.dataList.slice(this.showStart,this.showStart+len)
				this.keeplen = len
				this.oldheight = this.contentHeight
				this.oldtop = this.nowScrollTop
				// this.showData.splice(0,0,...upvec)
				// this.showData = this.dataList.slice(this.showStart,this.showEnd)
				// this.scrollid = `id-${this.showStart + len}`
				// console.log("scrollid ",this.scrollid)
				this.scrollpos++
				console.log("oldhei oldtop stop",this.oldheight,this.oldtop,this.scrollpos)
				this.updateShowData()
				// this.keepScrollPos(()=>{
				// 	if (this.showData.length > this.showMaxLen) {						
				// 		this.showEnd -= len
				// 		// this.showData.splice(this.showData.length-len ,len)
				// 		this.updateShowData()
				// 	}
				// 	this.$nextTick(()=>{
				// 		this.getContentHeight()
				// 		// this.scrollY = true
				// 	})
				// })
			},
			loadBottomData(toend = false) {
				if (this.showEnd >= this.dataList.length) {
					return
				}
				// console.log("loadBottomData")
				// this.scrollY = false
				let diff = this.dataList.length - this.showEnd
				let len = diff >= this.moveLen ? this.moveLen : diff
				let upvec = this.dataList.slice(this.showEnd,this.showEnd+len)
				this.showEnd += len
				// this.showData.push(...upvec)
				this.updateShowData()
				this.$nextTick(()=>{
					if (this.showData.length <= this.showMaxLen) {
						return
					}
					this.getContentHeight()
					let addth = this.contentHeight
					let oldtop = this.nowScrollTop
					this.showStart += len
					// this.showData.splice(0,len)
					this.updateShowData()
					if (toend) {
						return
					}
					this.$nextTick(()=>{
						this.getContentHeight()
						let mh = addth - this.contentHeight
						let np = oldtop - mh
						// console.log("addcontent oldtop newcontent newtop",addth,oldtop,this.contentHeight,np)
						// this.scrollY = true
						this.scrollpos = np
					})
				})
			}
		},
		options: {
			// multpleSlots: true,
			// styleIsolation: "shared",
			// addGlobalClass: true,
			virtualHost: true,
		}
	}
</script>

<style>
	.chat-scroll{
		
	}
	
	.chat-content {
		
	}
</style>