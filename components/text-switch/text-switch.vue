<template>
	<view style="position: relative;">
		<view v-if="open" class="bg-box" :style="{backgroundColor:bgcolor,height:bgheight}"></view>
		<text :class="textclass" :style="{marginBottom:marginBottom,zIndex:999}">{{text}}</text>
	</view>
</template>

<script>
	export default {
		name:"text-switch",
		props:{
			text:{
				type:String,
				require:true,
			},
			open:{
				type:Boolean,
				default:false,
			},
			marginBottom:{
				default:'0px'
			},
			bgcolor:{
				default:"#15fa8b"
			},
			bgheight:{
				default:"5px"
			},
			small:{
				type:Boolean,
				default:false,
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			textclass() {
				if (this.small) {
					return this.open ? 'text-open-small' : 'text-notopen'
				}
				return this.open ? 'text-open' : 'text-notopen'
			}
		}
	}
</script>

<style>
	.text-notopen, .text-open,.text-open-small {
		z-index: 2;
		position: relative;
	}
	
	.text-notopen {
		/* font-family: AlibabaPuHuiTi_2_65_Medium; */
		/* font-family: Helvetica; */
		font-size: 14px;
		color: #666666;
		line-height: 20px;
		text-align: left;
		font-style: normal;
		font-weight: 800;
	}
	
	.text-open {
		font-family: AlibabaPuHuiTi_2_105_Heavy;
		font-size: 18px;
		color: #000000;
		line-height: 25px;
		text-align: left;
		font-style: normal;
		font-weight: 800;
	}
	
	.text-open-small {
		font-family: AlibabaPuHuiTi_2_105_Heavy;
		font-size: 14px;
		color: #232122;
		line-height: 20px;
		text-align: left;
		font-style: normal;
		font-weight: 800;
	}
	
	.bg-box {
		position: absolute;
		bottom: 0px;
		right: 0px;
		height: 3px;
		width: 100%;
		z-index: 1;
	}
	
</style>