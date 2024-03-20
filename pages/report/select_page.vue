<template>
	<view class="col-class">
		<view style="height: 100%;margin: 0px 10px;">
			<radio-group @change="onRadioChange">
				<label v-for="(s,index) in selectData" :key="index">
					<myrow :customStyle="{margin:'10px 0px'}">
						<text>{{s}}</text>
						<expanded></expanded>
						<radio :value="index.toString()" :checked="index==current" :activeBackgroundColor="theme.warn"/>
					</myrow>
					<uv-line v-if="index!=(selectData.length-1)"></uv-line>
				</label>
			</radio-group>
		</view>
		<view style="margin: 10px;">
			<button class="fill-btn-primary" @click="onChoose">确定</button>
		</view>
		<uv-safe-bottom></uv-safe-bottom>
	</view>
</template>

<script>
import { ReportTaskName, ReportUserName } from '../../common/define_const'
	import {color as theme} from "@/common/theme.js"
	
	export default {
		data() {
			return {
				selectData:[],
				current:0,
				theme:theme,
			}
		},
		onLoad(e) {
			if (e.type == 0) {
				this.selectData = ReportTaskName
			}else if (e.type == 1) {
				this.selectData = ReportUserName
			}
		},
		methods: {
			onRadioChange(e) {
				// console.log(e)
				this.current = parseInt(e.detail.value)
			},
			onChoose() {
				const ev = this.getOpenerEventChannel();
				ev.emit("selectData",this.current)
				uni.navigateBack({})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
</style>
