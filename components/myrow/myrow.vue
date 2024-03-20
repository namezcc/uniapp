<template>
	<view class="row" :style="[{flexDirection: direction, justifyContent: mainAlign,alignItems: itemAlign,flexWrap: needWrap
	}, customStyle]">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"myrow",
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
			wrap:{
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
		computed:{
			direction() {
				return this.reverse?"row-reverse":"row";
			},
			needWrap() {
				return this.wrap? "wrap":"nowrap";
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

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		box-sizing: border-box;
	}
</style>