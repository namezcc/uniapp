<template>
	<view :class="['boxTag',bgclass]">
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
				default:'success'
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
						return "boxSuccess";
				}
			}
		}
	}
</script>

<style lang="scss">
	.boxTag {
		padding: 0rpx 10rpx;
		// background-color: #f9e6e4;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		// color: #d54431;
		// width: 44rpx;
		// height: 44rpx;
		border-radius: 6rpx;
		
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