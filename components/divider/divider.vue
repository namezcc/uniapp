<template>
	<view class="divider" :style="{borderBottom:line}">
	</view>
</template>

<script>
	export default {
		name:"divider",
		props:{
			width:{
				default:1,
			},
			lcolor:{
				default:"#ccc",
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			line() {
				return this.width+'px'+ " solid "+ this.lcolor;
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
	.divider {
		border-bottom: 1px solid #ccc;
	}
</style>