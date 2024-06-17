<template>
	<view>
		<web-view :src="host"></web-view>
	</view>
</template>

<script>
	import { WebHost } from '../../common/define_const'
	export default {
		data() {
			return {
				host:WebHost+"/bbwt_yh.html"
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
