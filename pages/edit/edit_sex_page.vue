<template>
	<view style="margin: 10px;background-color: white;border-radius: 10px;">
		<view class="choose-row" @click="onChooseSex(1)">
			<myrow>
				<text>男</text>
				<expanded></expanded>
				<uni-icons v-if="isMan" type="checkmarkempty" :color="theme.primary"></uni-icons>
			</myrow>
		</view>
		<uv-line></uv-line>
		<view class="choose-row" @click="onChooseSex(0)">
			<myrow>
				<text>女</text>
				<expanded></expanded>
				<uni-icons v-if="isWoman" type="checkmarkempty" :color="theme.primary"></uni-icons>
			</myrow>
		</view>
	</view>
</template>

<script>
	import {color as theme} from "@/common/theme.js"
import { EnumSex } from "../../common/define_const"
import { mapState } from "vuex"
import apihandle from "../../common/api_handle"
import store from "../../store"
	
	
	export default {
		data() {
			return {
				sex:EnumSex.MAN,
				theme:theme,
			}
		},
		onLoad() {
			this.sex = this.user.sex
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
			}),
			isMan() {
				return this.sex == EnumSex.MAN
			},
			isWoman() {
				return this.sex == EnumSex.WOMAN
			}
		},
		methods: {
			onChooseSex(sex) {
				if (sex == this.sex) {
					return
				}
				this.sex = sex
				// console.log("sex ",sex)
				apihandle.apiEditSex(sex).then((res)=>{
					if (res) {
						store.commit("setUserSex",sex)
					}
				})
			}
		}
	}
</script>

<style>
	.choose-row {
		margin: 10px;
	}
</style>
