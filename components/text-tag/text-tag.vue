<template>
	<view :class="['boxTag',bgclass]" :style="{color:color,backgroundColor:bgcolor,fontSize:size}">
		{{text}}
	</view>
</template>

<script>
	/**
	 * @property {string} theme = [success|warning|error|grey] 类型
	 */
	
	export default {
		name:"text-tag",
		props:{
			text:{
				type:String,
				require:true,
			},
			theme:{
				type:String,
				default:''
			},
			color:{
				type:String,
				default:''
			},
			bgcolor:{
				type:String,
				default:''
			},
			size:{
				type:String,
				default:'12px'
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			bgclass() {
				switch (this.theme){
					case 'success':
						return "boxSuccess";
					case 'warning':
						return "boxWarning";
					case 'error':
						return "boxError";
					case 'grey':
						return "boxGrey";
					default:
						return "";
				}
			}
		}
	}
</script>

<style lang="scss">
	.boxTag {
		padding: 0px 5px;
		// background-color: #f9e6e4;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		// color: #d54431;
		// width: 44rpx;
		// height: 44rpx;
		border-radius: 3px;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		line-height: 17px;
		
	}
	
	.boxGrey {
		background-color: $uni-info-light;
		color: $uni-info;
	}
	
	.boxSuccess {
		background-color: $uni-success-light;
		color: $uni-success;
	}
	
	.boxWarning {
		background-color: $uni-warning-light;
		color: $uni-warning;
	}
	
	.boxError {
		background-color: $uni-error-light;
		color: $uni-error;
	}
</style>