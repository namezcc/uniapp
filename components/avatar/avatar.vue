<template>
	<view :style="[avatorBox]">
		<uv-avatar :src="urls" :size="radius" @click="toUserPage"></uv-avatar>
		<view class="sex-icon">
			<uv-icon v-if="sex!=null" :name="iconname" :color="sexcolor" :bold="true"></uv-icon>
		</view>
	</view>
</template>

<script>
import { EnumSex, PageType } from '../../common/define_const';
	import util_common from "@/common/util_common.js"

	export default {
		name:"avatar",
		props:{
			radius:{
				default:40,
			},
			src:{
				require:true,
			},
			sex:{
				default:null,
			},
			inpage:{
				default:0,
			},
			tocid:{
				default:0,
			}
		},
		data() {
			return {
				aurl:"/static/icon/head_0_h.png",
				iconname: this.sex == EnumSex.WOMAN ? "woman" : "man",
				sexcolor: this.sex == EnumSex.WOMAN ? "pink" : "royalblue",
			};
		},
		computed:{
			urls() {
				return util_common.getIconUrl(this.src)
			},
			avatorBox() {
				return this.sex !== null ? {
					position: 'relative',
					height: (this.radius+5)+'px',
					width: (this.radius+5)+'px',
				} : {}
			}
		},
		methods:{
			toUserPage() {
				if (this.tocid == 0) {
					return
				}
				if (this.inpage == PageType.User) {
					uni.navigateBack()
				}else{					
					uni.navigateTo({
						url:`/pages/user/other_user/other_user?cid=${this.tocid}&fromPage=${this.inpage}`
					})
				}
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
	.sex-icon {
		position: absolute;
		right: 0;
		bottom: 0;
	}
	
	.avatar-circle {
		border-radius: 50%;
	}
</style>