<template>
	<view>
		<web-view :src="host"></web-view>
	</view>
</template>

<script>
	import { HostBase } from '../../common/define_const'
	export default {
		data() {
			return {
				host:HostBase+"/web/bbwt_yh.html"
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
