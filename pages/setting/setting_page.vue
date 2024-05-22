<template>
		<mycol>			
			<view style="padding: 0px 10px;width: 100%;box-sizing: border-box;">				
				<view class="card">			
					<uv-cell-group :border="false">
						<uv-cell title="黑名单" :isLink="true" :border="false" @click="toBlackList"/>
					</uv-cell-group>
				</view>
			</view>
			<!-- <view style="margin: 0px 10px;">				
			</view> -->
			<expanded></expanded>
			<view>
				<text :style="{'font-size': '14px',color: theme.primary_low}" @click="quitLogin">退出登录</text>
			</view>
			<view style="height: 50px;"></view>
		</mycol>
	<!-- <view style="width: 100%;height: 100%;">
		
	</view> -->
</template>

<script>
import { color } from '../../common/theme'
import store from '../../store'
	
	
	export default {
		data() {
			return {
				theme:color,
			}
		},
		methods: {
			toBlackList() {
				uni.navigateTo({
					url:"/pages/setting/black_list_page"
				})
			},
			quitLogin() {
				// console.log("quit login")
				// 退出登录
				uni.showModal({
					title:"退出登录",
					content:"是否退出登录",
					fail:()=> {
						
					},
					success:(res)=>{
						if (res.confirm) {
							store.commit("logout")
							uni.navigateBack()
						}
					},
					confirmColor:color.primary
				})
			}
		}
	}
</script>

<style>
	.card {
		border-radius: 10px;
		background-color: #fff;
		/* margin: 0px 10px; */
		/* box-sizing: border-box; */
		width: 100%;
		/* padding: 0px 10px; */
	}

</style>
