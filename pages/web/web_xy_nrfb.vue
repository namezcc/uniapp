<template>
	<view>
		<web-view :src="host"></web-view>
		<!-- <web-view src="https://baidu.rudon.cn/"></web-view> -->
		
	</view>
</template>

<script>
import { WebHost } from '../../common/define_const'
	export default {
		data() {
			console.log("webHost:",WebHost)
			return {
				host:WebHost+"/bbwt_nrfb.html"
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
