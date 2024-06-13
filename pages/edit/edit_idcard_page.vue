<template>
	<view class="main-contain">
		<mycol :customStyle="{width:'100%',padding:'0px 20px'}">
			<view style="width: 100%;">				
				<view style="height: 30px;"></view>
				<text>真实姓名</text>
				<uv-input border="bottom" placeholder="姓名" v-model="name"></uv-input>
				<view style="height: 30px;"></view>
				<text>身份证号</text>
				<uv-input border="bottom" placeholder="身份证号" v-model="idcard" type="idcard"></uv-input>
			</view>
			<expanded></expanded>
			<button class="fill-btn-primary" @click="submit">提交</button>
			<view style="height: 30px;"></view>
		</mycol>
	</view>
</template>

<script>
import apihandle from '../../common/api_handle'
import store from '../../store';

	function validateChineseID(id) {
		// 正则表达式匹配身份证号码格式
		var reg = /^\d{17}[\dXx]$/;
		
		if (!reg.test(id)) {
			return false;
		}
		
		// 加权因子
		var weight = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
		// 校验码
		var checkCode = ['1','0','X','9','8','7','6','5','4','3','2'];
		
		var sum = 0;
		for (var i = 0; i < 17; i++) {
			sum += parseInt(id[i]) * weight[i];
		}
		
		var mod = sum % 11;
		
		if (checkCode[mod] === id[17].toUpperCase()) {
			return true;
		} else {
			return false;
		}
	}
	export default {
		data() {
			return {
				name:"",
				idcard:"",
			}
		},
		methods: {
			submit() {
				if (this.name.length == 0) {
					apihandle.toast("姓名不能为空")
					return
				}
				
				if (!validateChineseID(this.idcard)) {
					apihandle.toast("身份证输入错误")
					return
				}
				
				store.dispatch("checkIdcard",{idcard:this.idcard,name:this.name}).then((res)=>{
					if (res) {
						uni.navigateBack()
						apihandle.toast("身份验证成功")
					}else{
						apihandle.toast("身份验证失败,请检查姓名和身份证号")
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	.main-contain {
		// padding: 10px 20px;
		color: $uni-base-color;
		width: 100%;
		height: 100%;
	}
	
</style>
