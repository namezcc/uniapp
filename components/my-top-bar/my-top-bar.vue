<template>
	<view>
		<uni-nav-bar left-icon="back" @clickLeft="back" :fixed="true" :backgroundColor="bgcolor" 
		:border="false" :statusBar="true">
			<view class="title-box">
				<text class="text-title-top">{{title}}</text>
			</view>
		</uni-nav-bar>
	</view>
</template>

<script>
	export default {
		name:"my-top-bar",
		props:{
			title:{
				default:""
			},
			bgcolor:{
				default:""
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			back() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.title-box {
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	
	.text-title-top {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 16px;
		color: #333333;
		line-height: 22px;
		text-align: left;
		font-style: normal;
	}

</style>