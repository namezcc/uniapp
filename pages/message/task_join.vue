<template>
	<!-- <z-paging-swiper>
		<template #top>
			<uv-tabs ref="tabs" :list="tabList" :current="current" @change="tabsChange" :scrollable="false" 
			:customStyle="{'background-color': '#fff'}" :lineColor="theme.primary"/>
		</template>
		<swiper class="swiper" :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
			<swiper-item class="swiper-item" :key="0">
				<page-task-join :tabIndex="0" :currentIndex="current"/>
			</swiper-item>
			<swiper-item class="swiper-item" :key="1">
				<page-task-my :tabIndex="1" :currentIndex="current" />
			</swiper-item>
			<swiper-item class="swiper-item" :key="2">
				<page-user-chat :tabIndex="2" :currentIndex="current"/>
			</swiper-item>
			<swiper-item class="swiper-item" :key="3">
				<page-interest-task :tabIndex="3" :currentIndex="current"/>
			</swiper-item>
		</swiper>
	</z-paging-swiper> -->
	<view class="col-class">
		<!-- <uv-tabs ref="tabs" :list="tabList" :current="current" @change="tabsChange" :scrollable="false"
		:customStyle="{'background-color': theme.topNavBar}" :lineColor="theme.warn_primary"/> -->
		<view style="padding-top: 5px;padding-bottom: 17px;background-color: #fff;">			
			<myrow>
				<view style="margin-left: 14px;margin-right: 36px;" @click="tabsChange(0)">
					<text-switch text="已报名" :open="current==0" bgheight="8px" :small="true"></text-switch>
				</view>
				<view style="margin-right: 36px;" @click="tabsChange(1)">
					<text-switch text="我的" :open="current==1" bgheight="8px" :small="true"></text-switch>
				</view>
				<view @click="tabsChange(2)">
					<text-switch text="兴趣" :open="current==2" bgheight="8px" :small="true"></text-switch>
				</view>
			</myrow>
		</view>
		<!-- <view class="expanded">
			
		</view> -->
		
		<view class="" style="flex: 1;">			
			<page-task-join :customClick="false" v-show="current == 0" :tabIndex="0" :currentIndex="current"/>
			<page-task-my :customClick="false" v-show="current == 1" :tabIndex="1" :currentIndex="current" />
			<!-- <page-user-chat :customClick="false" v-show="current == 2" :tabIndex="2" :currentIndex="current"/> -->
			<page-interest-task :customClick="false" v-show="current == 2" :tabIndex="2" :currentIndex="current"/>
		</view>
	</view>
</template>

<script>
	import {color as theme} from "@/common/theme.js"
	import { mapGetters } from "vuex"
import util_page from "../../common/util_page"
	
	export default {
		data() {
			return {
				theme:theme,
				title: 'join',
				current:0,
				tabList: [
					{name:"已报名"},
					{name:"我的"},
					// {name:"私聊"},
					{name:"兴趣"},
				],
			}
		},
		onLoad() {
			if (!this.isLogin) {
				util_page.toLoginPageDialog()
			}
		},
		computed:{
			...mapGetters(["isLogin"])
		},
		methods: {
			tabsChange(index) {
				// console.log("tabsChange ", index)
				// this.current = index.index;
				this.current = index;
			},
			// swiper滑动中
			swiperTransition(e) {
				// this.$refs.tabs.setDx(e.detail.dx);
			},
			// swiper滑动结束
			swiperAnimationfinish(e) {
				this.current = e.detail.current;
				// this.$refs.tabs.unlockDx();
			},
			// 如果要通知当前展示的z-paging刷新，请调用此方法
			reloadCurrentList() {
				// this.$refs.listItem[this.current].reload();
				
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	page {
		background-color: #F3F3F3;
	}
	
	.swiper {
		height: 100%;
	}
	
	
</style>
