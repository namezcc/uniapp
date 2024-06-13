<template>
	<view>
		<text class="myfont" :style="[customStyle]">{{icon}}</text>
	</view>
</template>

<script>
	import icons from './icons';
	
	export default {
		name:"myicon",
		props:{
			name:{
				require:true,
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
			icon() {
				var code = icons['myicon-'+this.name]
				return unescape(`%u${code}`)
			}
		}
	}
</script>

<style>
	@font-face {
	  font-family: "iconfont"; /* Project id 2878519 */
	  src:url('/style/font/iconfont.ttf') format('truetype');
	}
	
	.myfont {
		font-family: iconfont;
		font-size: 16px;
		color: #606266;
	}

</style>