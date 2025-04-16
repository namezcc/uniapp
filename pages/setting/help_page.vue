<template>
	<view class="col-class">
		<view class="top-main">
			<mycol>
				<expanded></expanded>
				<myrow mainAlign="center">
					<view style="">
						<image style="width: 117px;height: 51px;margin-bottom: -40px;margin-left: -40px;" :src="srchost+'src/help_txt.png'"></image>
					</view>
				</myrow>
				<myrow mainAlign="center">
					<view>
						<image style="width: 143px;height: 157px;" :src="srchost+'src/help_img.png'"></image>
					</view>
				</myrow>
			</mycol>
			<!-- <view style="position: absolute;bottom: 25px;width: 100%;">
			</view> -->
		</view>
		<view class="help-main">
			<view class="col-class" style="width: 100%;align-items: center;margin-top: 54px;">				
				<view class="help-box">
					<myrow mainAlign="center">
						<image style="max-width: 27px;max-height: 27px;" src="@/static/icon_active.png"></image>
						<view style="margin-left: 14px;">
							活动组局
						</view>
					</myrow>
				</view>
				<view class="help-box">
					<myrow mainAlign="center">
						<image style="max-width: 27px;max-height: 27px;" src="@/static/icon_help.png"></image>
						<view style="margin-left: 14px;">
							寻求帮助
						</view>
					</myrow>
				</view>
				<view class="help-box">
					<myrow mainAlign="center">
						<image style="max-width: 27px;max-height: 27px;" src="@/static/icon_sports.png"></image>
						<view style="margin-left: 14px;">
							运动搭子
						</view>
					</myrow>
				</view>
				<view class="help-box">
					<myrow mainAlign="center">
						<image style="max-width: 27px;max-height: 27px;" src="@/static/icon_service.png"></image>
						<view style="margin-left: 14px;">
							提供服务
						</view>
					</myrow>
				</view>
				<!-- <view class="help-box">
					任何委托
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
import { SrcHost } from '../../common/define_const'
	export default {
		data() {
			return {
				srchost:SrcHost,
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	page {
		background-color: #fff;
	}
	
	.top-main {
		// position: relative;
		background-color: $my-color-primary;
		// height: 180px;
		width: 100%;
	}
	
	.help-main {
		background-color: #fff;
		border-radius: 26px 26px 0px 0px;
		// flex: 1;
		margin-top: -30px;
		z-index: 5;
	}
	
	.help-box {
		width: 231px;
		height: 56px;
		border-radius: 9px;
		background: #222222;
		margin: 0px 0px 26px 0px;
		// font-size: 30px;
		display: flex; /* 开启flex布局 */
		justify-content: center; /* 水平居中对齐 */
		align-items: center; /* 垂直居中对齐 */
		// color: #3a3a3a;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 16px;
		color: #1EFE8F;
		line-height: 22px;
		text-align: left;
		font-style: normal;
		// height: 80px;
	}

</style>
