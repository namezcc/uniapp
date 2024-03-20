<template>
	<view>
		<view class="class-ceter">
			<view class="avator-box" @click="onChooseIcon">
				<avatar :src="user.icon" :radius="65"></avatar>
				<uni-icons type="camera" class="camera-icon" :size="30"></uni-icons>
			</view>
		</view>
		<uv-cell-group>
			<uv-cell title="昵称" :isLink="true" @click="toEditName" :value="user.name"></uv-cell>
			<uv-cell title="性别" :isLink="true" @click="toEditSex" :value="sex"></uv-cell>
		</uv-cell-group>
	</view>
</template>

<script>
	import { mapState } from "vuex"
import { EnumSex } from "../../common/define_const"
	
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
			sex() {
				return this.user.sex == EnumSex.MAN ? "男" :"女"
			}
		},
		methods: {
			onChooseIcon() {
				// console.log("onChooseIcon")
				uni.chooseImage({
					count:1,
					sourceType: ['album'],
					success: (cres) => {
						const tempFilePaths = cres.tempFilePaths;
						uni.navigateTo({
							url:`/pages/edit/icon_crop?src=${tempFilePaths[0]}`
						})
					}
				})
			},
			toEditName() {
				// console.log("user ",this.user)
				uni.navigateTo({
					url:"/pages/edit/edit_name_page?name="+this.user.name
				})
			},
			toEditSex() {
				uni.navigateTo({
					url:"/pages/edit/edit_sex_page"
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
	
	.avator-box {
		position: relative;
		height: 70px;
		width: 70px;
	}
	
	.camera-icon {
		position: absolute;
		right: 0;
		bottom: 0;
	}
	
</style>
