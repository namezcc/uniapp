<template>
	<view>
		<web-view :src="host"></web-view>
		<!-- <web-view src="https://baidu.rudon.cn/"></web-view> -->
		
	</view>
</template>

<script>
import { HostBase } from '../../common/define_const'
	export default {
		data() {
			return {
				host:HostBase+"/web/bbwt_nrfb.html"
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
