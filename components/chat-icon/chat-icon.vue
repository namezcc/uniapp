<template>
	<view>		
		<view class="col-class" style="align-items: center;">
			<view class="chat-icon class-ceter"  @click="onClick">
				<slot></slot>
			</view>
			<view style="height: 10px;"></view>
			<slot name="icontext">
				<text>{{name}}</text>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"chat-icon",
		emits:["iconClick"],
		props:{
			name:{
				default:""
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			onClick() {
				this.$emit("iconClick")
			}
		},
		options: {
			// multpleSlots: true,
			// styleIsolation: "shared",
			// addGlobalClass: true,
			virtualHost: true,
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	.chat-icon {
		height: 50px;
		width: 50px;
		background-color: white;
		border-radius: 10px;
	}
</style>