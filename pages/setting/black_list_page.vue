<template>
	<view>
		<view v-if="blackList">
			<uni-list>
				<uni-list-item v-for="mem in blackList" @click="toUserInfoPage(mem)" :clickable="true">
					<template v-slot:header>
						<myrow>							
							<avatar :src="mem.icon"></avatar>
							<text>{{mem.name}}</text>
						</myrow>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
		<view v-if="blackList==null || blackList.length == 0" style="width: 100%;">
			<myrow mainAlign="center">					
				<view style="width: 200px;">
					<uv-divider text="" :dot="true"></uv-divider>
				</view>
			</myrow>
		</view>
	</view>
</template>

<script>
	import store from "@/store/index.js"
	
	export default {
		data() {
			return {
				blackList:null
			}
		},
		onLoad() {
			store.dispatch("getBlackListUser").then((res)=>{
				this.blackList = res
			})
		},
		methods: {
			toUserInfoPage(mem) {
				// console.log("toUserInfoPage")
				uni.navigateTo({
					url:`/pages/user/other_user/other_user?cid=${mem.cid}`
				})
			}
		}
	}
</script>

<style>

</style>
