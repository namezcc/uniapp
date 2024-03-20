<template>
	<z-paging-swiper>
		<template #top>
			<uv-tabs ref="tabs" :list="tabList" :current="current" @change="tabsChange" :scrollable="false" 
			:customStyle="{'background-color': '#fff'}" :lineColor="theme.primary"/>
			<!-- <z-tabs ref="tabs" :list="tabList" :current="current" @change="" /> -->
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
	</z-paging-swiper>
</template>

<script>
	import {color as theme} from "@/common/theme.js"
	
	export default {
		data() {
			return {
				theme:theme,
				title: 'join',
				current:0,
				tabList: [
					{name:"已报名"},
					{name:"我的"},
					{name:"私聊"},
					{name:"兴趣"},
				],
			}
		},
		methods: {
			tabsChange(index) {
				// console.log("tabsChange ", index)
				this.current = index.index;
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

<style>
	.swiper {
		height: 100%;
	}
</style>
