<template>
	<view :style="[avatorBox]">
		<view class="avatar-circle" :style="{padding:outline,backgroundColor:'#fff'}">
			<uv-avatar :src="src" :size="radius" @click="toUserPage"></uv-avatar>
		</view>
		<view class="sex-icon">
			<uv-icon v-if="sex!=null" :name="iconname" :color="sexcolor" :bold="true"></uv-icon>
		</view>
	</view>
</template>

<script>
import { EnumSex, PageType } from '../../common/define_const';
	import util_common from "@/common/util_common.js"
	import store from '@/store';
import global_data from '../../common/global_data';

	export default {
		name:"avatar",
		props:{
			radius:{
				default:40,
			},
			src:{
				default:"",
			},
			sex:{
				default:null,
			},
			inpage:{
				default:0,
			},
			tocid:{
				default:0,
			},
			usercid:{
				default:0,
			},
			outline:{
				default:'0px',
			}
		},
		// watch:{
		// 	src:(newv,oldv)=>{
		// 		console.log("avatar url change",newv,oldv)
		// 	}
		// },
		// mounted() {
			// if (this.usercid > 0) {
			// 	// 加载玩家数据
			// 	store.dispatch("getOtherUser",this.usercid).then((res)=>{
			// 		if (res) {
			// 			this.userurl = res.icon
			// 			// console.log("user icon ",res.icon)
			// 		}
			// 	})
			// }
			// console.log("user icon data",this.src)
		// },
		data() {
			return {
				iconname: this.sex == EnumSex.WOMAN ? "woman" : "man",
				sexcolor: this.sex == EnumSex.WOMAN ? "pink" : "royalblue",
				// userurl:this.src,
			};
		},
		computed:{
			// urls() {
			// 	return this.userurl || this.src
			// },
			avatorBox() {
				return this.sex !== null ? {
					position: 'relative',
					height: (this.radius+5)+'px',
					width: (this.radius+5)+'px',
				} : {}
			},
			bgsize() {
				return this.radius+5
			}
		},
		methods:{
			toUserPage() {
				if (this.tocid == 0 || this.tocid == global_data.cid) {
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