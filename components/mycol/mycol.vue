<template>
	<view class="col" :style="[{flexDirection: direction, justifyContent: mainAlign,alignItems: itemAlign},customStyle]">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"mycol",
		props:{
			reverse:{
				default:false,
			},
			mainAlign:{
				default:"flex-start",
			},
			itemAlign:{
				default:"center",
			},
			customStyle:{
				default:{}
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			direction() {
				return this.reverse?"column-reverse":"column";
			}
		},
		options: {
			multpleSlots: true,
			styleIsolation: "shared",
			addGlobalClass: true,
			virtualHost: true,
		}
	}
</script>

<style>
	.col {
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
		height: 100%;
	}
</style>