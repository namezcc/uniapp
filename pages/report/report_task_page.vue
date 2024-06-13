<template>
	<view class="col-class">
		<view style="height: 100%;margin: 0px 10px;">
			<view @click="toSelectPage">				
				<myrow>
					<text>举报理由</text>
					<expanded></expanded>
					<text>{{reportName}}</text>
					<uni-icons type="right"></uni-icons>
				</myrow>
			</view>
			<view style="margin: 10px 0px;">
				<text>举报描述</text>
			</view>
			<view>
				<uv-textarea v-model="txtContent" placeholder="详细描述举报原因" count maxlength="200" height="100" ></uv-textarea>
			</view>
			<view style="margin: 10px 0px;">
				<text>图片证据</text>
			</view>
			<view style="margin: 5px;">
				<uni-file-picker v-model="imageValue" title="选择图片" limit="3" :imageStyles="imageStyle" file-mediatype="image"
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
import { ReportTaskName, ReportTaskType } from '../../common/define_const'
import utilHttp from "@/common/http_util.js"
import utilTask from "@/common/util_task.js"
import apihandle from '../../common/api_handle'
import util_common from '../../common/util_common'

	export default {
		data() {
			return {
				reportType:ReportTaskType.fanzui,
				reportName:ReportTaskName[0],
				txtContent:"",
				imageValue:[],
				imageStyle: {
					borderRadius: '10px',
					margin: '10px',
					width: '70px',
					height: '70px',
					backgroundColor: 'white',
				},
			}
		},
		onLoad(e) {
			this.cid = e.cid
			this.taskid = e.taskid
		},
		methods: {
			toSelectPage() {
				uni.navigateTo({
					url:"/pages/report/select_page?type=0",
					events:{
						selectData:(res)=>{
							// console.log("select data ",res)
							this.reportType = res
							this.reportName = ReportTaskName[res]
						}
					}
				})
			},
			onSelectImage(e) {
				// console.log("select image ",e)
				let flist = util_common.getTempFileList(e)
				util_common.uploadFileList(flist).then((vec)=>{
					for (let v of vec) {
						let x = {}
						x.url = v
						x.extname = ''
						x.name = ''
						this.imageValue.push(x)
					}
				})
				// const tempFilePaths = e.tempFilePaths;
				// for (let img of tempFilePaths) {					
				// 	utilHttp.uploadImage(img,(res)=>{
				// 		// console.log('上传成功', res);
				// 		// console.log('上传数据转换',JSON.parse(res.data));
				// 		// 取到文档服务器的值
				// 		let uploaddata = JSON.parse(res.data)
				// 		let x = {}
				// 		x.url = utilTask.getImageUrlName(uploaddata.data)
				// 		x.extname = ''
				// 		x.name = uploaddata.data
				// 		this.imageValue.push(x)
				// 	})
				// }
			},
			onDeleteImage(e) {
				// console.log("delete image ",e)
			},
			onSubmit() {
				if (this.txtContent.length == 0) {
					apihandle.toast("描述不能为空")
					return
				}
				
				let data = {
					taskid:this.taskid,
					type:this.reportType,
					content:this.txtContent,
					images:this.imageValue.map((v)=>v.url)
				}
				apihandle.apiReportTask(data).then((res)=>{
					apihandle.toast("举报成功")
					uni.navigateBack({})
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
</style>
