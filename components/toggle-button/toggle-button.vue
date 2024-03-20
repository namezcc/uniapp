<template>
	<view @click="onStateChange" :style="[customStyle]">
		<slot v-if="state1"></slot>
		<slot name="state2" v-if="!state1"></slot>
	</view>
</template>

<script>
	export default {
		name:"toggle-button",
		props:{
			state1:{
				default:true,
			},
			customStyle:{
				default:{}
			}
		},
		data() {
			return {
			};
		},
		methods:{
			onStateChange() {
				// this.state1= !this.state1
				this.$emit("state",this.state1)
			}
		}
	}
</script>

<style>

</style>