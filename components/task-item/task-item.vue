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
				<image style="width: 75px;height: 75px;" v-if="taskImage.length" :src="taskImage[0]" mode="aspectFit"></image>
			</myrow>
			<myrow>
				<text :style="{fontSize: '10px',color: moneyColor}" >{{taskMoney}}</text>
				<expanded></expanded>
				<text :style="{fontSize: '10px'}" >{{taskDistance}}</text>
				<uni-icons v-if="taskDistance" type="location-filled"></uni-icons>
			</myrow>
		</uni-card>
	</view>
</template>

<script>
	import utiltask from "@/common/util_task.js"
	import {color as mycolor} from "@/common/theme.js"
	import { mapState } from "vuex"
	import store from "@/store/index.js"
	
	export default {
		name:"task-item",
		props: {
			task: {
				type: Object,
				require: true,
			},
		},
		data() {
			// var task = store.getters.getTaskById(this.taskid)
			return {
				moneyColor:mycolor.primary,
			};
		},
		updated() {
			// console.log("task-item update")
		},
		computed:{
			numinfo() {
				return utiltask.getNumString(this.task)
			},
			taskImage() {
				return utiltask.getImageUrls(this.task)
			},
			taskMoney() {
				return utiltask.getMoneyString(this.task)
			},
			taskDistance() {
				if (this.task.address == null) {
					return "";
				}else{
					var loc = this.location()
					if (loc == null) {
						return this.task.address.cityname || ""
					}else{
						return utiltask.getDistanceString(this.location(),this.task.address)
					}
				}
			}
		},
		methods:{
			...mapState({
				location: state => state.user_data.location
			})
		},
		options: {
			multpleSlots: true,
			styleIsolation: "shared",
			addGlobalClass: true,
			virtualHost: true,
		}
	}
</script>

<style scoped>
	.mycard /deep/ .uni-card {
		border-radius: 10px;
	}
</style>