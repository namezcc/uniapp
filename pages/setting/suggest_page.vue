<template>
	<view class="col-class">
		<view style="height: 100%;margin: 0px 10px;">
			<view style="margin: 10px 0px;">
				<text>建议内容</text>
			</view>
			<view>
				<uv-textarea v-model="txtContent" placeholder="欢迎您留下宝贵的建议..." count maxlength="200" height="100" ></uv-textarea>
			</view>
			<view style="margin: 10px 0px;">
				<text>图片</text>
			</view>
			<view style="margin: 5px;">
				<uni-file-picker :auto-upload="false" v-model="imageValue" title="选择图片" limit="3" :imageStyles="imageStyle" file-mediatype="image"
				@delete="onDeleteImage" @select="onSelectImage">
					<uni-icons type="plusempty" style="color: black;"></uni-icons>
				</uni-file-picker>
			</view>
		</view>
		<view style="margin: 10px;">
			<button class="fill-btn-primary" @click="onSubmit">提交</button>
		</view>
		<uv-safe-bottom></uv-safe-bottom>
	</view>
</template>

<script>
	import utilHttp from "@/common/http_util.js"
	import utilTask from "@/common/util_task.js"
	import apihandle from '../../common/api_handle'
import global_data from "../../common/global_data"
import util_common from "../../common/util_common"
	
	export default {
		data() {
			return {
				txtContent:"",
				imageValue:[],
				imageStyle: {
					borderRadius: '10px',
					margin: '10px',
					width: '70px',
					height: '70px',
					backgroundColor: 'white',
				},
				tempImages:[],
			}
		},
		methods: {
			onSelectImage(e) {
				// console.log("select image ",e)
				const tempFilePaths = e.tempFilePaths;
				
				for (var i = 0; i < tempFilePaths.length; i++) {
					let img = tempFilePaths[i]
					var fileName = e.tempFiles[i].name;
					util_common.uploadFile(img,fileName,(res)=>{
						if (res) {
							let x = {}
							x.url = res
							x.extname = ''
							x.name = fileName
							this.imageValue.push(x)
						}else{
							apihandle.toast("图片上传失败")
						}
					})
				}
				// this.tempImages = util_common.getTempFileList(e)
				// console.log("select image ",this.tempImages)
				// console.log("select imageValue ",this.imageValue)
				// for (let img of tempFilePaths) {					
					// utilHttp.uploadImage(img,(res)=>{
					// 	// console.log('上传成功', res);
					// 	// console.log('上传数据转换',JSON.parse(res.data));
					// 	// 取到文档服务器的值
					// 	let uploaddata = JSON.parse(res.data)
					// 	let x = {}
					// 	x.url = utilTask.getImageUrlName(uploaddata.data)
					// 	x.extname = ''
					// 	x.name = uploaddata.data
					// 	this.imageValue.push(x)
					// })
				// }
			},
			onDeleteImage(e) {
				// console.log("delete image ",e)
			},
			onSubmit() {
				if (this.txtContent.length == 0) {
					apihandle.toast("建议内容不能为空")
					return
				}
				
				let data = {
					cid:global_data.cid,
					content:this.txtContent,
					images:this.imageValue.map((v)=>v.url)
				}
				apihandle.apiUserSuggest(data).then((res)=>{
					uni.showModal({
						title:"提交成功",
						content:"感谢您的提交,我们会及时查看",
						success: (res) => {
							uni.navigateBack({})
						},
						fail: () => {
							uni.navigateBack({})
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
	
</style>
