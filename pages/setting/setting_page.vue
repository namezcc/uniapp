<template>
	<view>
		<uv-cell-group>
			<uv-cell title="黑名单" :isLink="true" @click="toBlackList"/>
		</uv-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toBlackList() {
				uni.navigateTo({
					url:"/pages/setting/black_list_page"
				})
			}
		}
	}
</script>

<style>

</style>
