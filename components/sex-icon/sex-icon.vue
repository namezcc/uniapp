<template>
	<view class="sex-box" :class="sexclass">
		<uv-icon :name="iconname" color="#fff" :size="size" :bold="true"></uv-icon>
	</view>
</template>

<script>
import { EnumSex } from '../../common/define_const';
	export default {
		name:"sex-icon",
		props:{
			sex:{
				default:EnumSex.MAN,
			},
			size:{
				default:10
			}
		},
		data() {
			return {
				// iconname: this.sex == EnumSex.WOMAN ? "woman" : "man",
				// sexcolor: this.sex == EnumSex.WOMAN ? "pink" : "royalblue",
				// sexclass: this.sex == EnumSex.WOMAN ? "sex-woman" : "sex-man",
			};
		},
		computed:{
			iconname() {
				return this.sex == EnumSex.WOMAN ? "woman" : "man"
			},
			sexclass() {
				return this.sex == EnumSex.WOMAN ? "sex-woman" : "sex-man"
			}
		}
	}
</script>

<style>
	
	.sex-box {
		border-radius: 50%;
		padding: 2px;
		display: flex; /* 开启flex布局 */
		justify-content: center; /* 水平居中对齐 */
		align-items: center; /* 垂直居中对齐 */
	}
	
	.sex-man {
		background-color: #0fa2fc;
	}
	
	.sex-woman {
		background-color: #fd5b9c;
	}

</style>