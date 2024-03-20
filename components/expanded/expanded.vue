<template>
	<view class="class-ceter" :style="[{'-webkit-flex': 1,flex: 1},customStyle]">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"expanded",
		props:{
			customStyle:{
				default:{}
			}
		},
		data() {
			return {
				
			};
		},
		options: {
			multpleSlots: true,
			styleIsolation: "shared",
			addGlobalClass: true,
			virtualHost: true,
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";

</style>