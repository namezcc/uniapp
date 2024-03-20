<template>
	<view class="mycard" style="width: 100%;">
		<uni-card margin="5px">
			<template v-slot:title>
				<view style="margin-top: 10px">
					<myrow>
						<avatar :src="task.creator_icon"/>
						<text>{{task.creator_name}}</text>
						<expanded/>
						<text>{{numinfo}}</text>
					</myrow>
				</view>
				<view style="margin-top: 10px;">
					<uv-line></uv-line>
				</view>
			</template>
			<myrow itemAlign="flex-start" :wrap="false">
				<text style="white-space: pre-wrap">{{task.title}}</text>
				<expanded></expanded>
			</myrow>
			<myrow>
				<text :style="{fontSize: '10px',color: theme.primary}" >{{taskMoney}}</text>
				<expanded></expanded>
				
			</myrow>
		</uni-card>
	</view>
</template>

<script>
	import utiltask from "@/common/util_task.js"
	import {color as theme} from "@/common/theme.js"
	
	export default {
		name:"task-chat-item",
		props: {
			task: {
				type: Object,
				require: true,
			},
		},
		data() {
			return {
				theme:theme,
			};
		},
		computed:{
			numinfo() {
				return utiltask.getNumString(this.task)
			},
			taskMoney() {
				return utiltask.getMoneyString(this.task)
			},
		},
		options: {
			multpleSlots: true,
			styleIsolation: "shared",
			addGlobalClass: true,
			virtualHost: true,
		}
	}
</script>

<style>
	.mycard /deep/ .uni-card {
		border-radius: 10px;
	}
</style>