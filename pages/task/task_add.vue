<template>
	<view  class="mainCol">
		<mycol>			
			<view class="titleStyle colItem">
				<!-- border="none" -->
				<uv-input v-model="txtTitle" placeholder="任务标题" maxlength="15" inputAlign="center" shape="circle" />
			</view>
			<view class="contentStyle colItem">
				<uv-textarea v-model="txtContent" placeholder="任务内容..." count maxlength="500" height="100" ></uv-textarea>
			</view>
			<view class="colItem itemContent">
				<view style="margin: 5px;">
					<uni-file-picker v-model="imageValue" title="选择图片" limit="9" :imageStyles="imageStyle" file-mediatype="image"
					@delete="onDeleteImage" @select="onSelectImage">
						<uni-icons type="plusempty" style="color: black;"></uni-icons>
					</uni-file-picker>
				</view>
			</view>
			<view class="colItem itemContent" style="font-size: 14px;">
				<view style="margin: 5px;">
					<myrow>
						<view style="width: 120px;">
							<uv-subsection mode="subsection" :activeColor="theme.primary" :inactiveColor="theme.primary" fontSize="12" :current="currentNum" :list="['任务人数','男女人数']" @change="onClickNumItem"></uv-subsection>
						</view>
						<expanded></expanded>
						<view style="font-size: 12px;">
							<view v-show="currentNum === 0">
								<myrow>
									<view style="width: 50px;">
										<uv-input v-model="txtManNum" type="number" maxlength="3" inputAlign="center" shape="circle"></uv-input>
									</view>
									<text>人</text>
								</myrow>
							</view>
							<view v-show="currentNum === 1">
								<myrow>
									男
									<view style="width: 50px;">
										<uv-input v-model="txtManNum" type="number" maxlength="3" inputAlign="center" shape="circle"></uv-input>
									</view>
									<text>人</text>
									<view style="width: 20px;"></view>
									女
									<view style="width: 50px;">
										<uv-input v-model="txtWomanNum" type="number" maxlength="3" inputAlign="center" shape="circle"></uv-input>
									</view>
									<text>人</text>
								</myrow>
							</view>
						</view>
					</myrow>					
					<uv-line margin="5px 0px"></uv-line>
					<myrow>
						<view style="width: 120px;">
							<uv-subsection mode="subsection" :activeColor="theme.primary" :inactiveColor="theme.primary" fontSize="12" :current="currentMoney" :list="['任务奖励','男女收费']" @change="onClickMoneyItem"></uv-subsection>
						</view>
						<expanded></expanded>
						<view style="font-size: 12px;">
							<view v-show="currentMoney === 0">
								<myrow>
									<view style="width: 50px;">
										<uv-input v-model="txtManMoney" type="number" maxlength="3" inputAlign="center" shape="circle"></uv-input>
									</view>
									<text>元</text>
								</myrow>
							</view>
							<view v-show="currentMoney === 1">
								<myrow>
									男
									<view style="width: 50px;">
										<uv-input v-model="txtManMoney" type="number" maxlength="3" inputAlign="center" shape="circle"></uv-input>
									</view>
									<text>元</text>
									<view style="width: 20px;"></view>
									女
									<view style="width: 50px;">
										<uv-input v-model="txtWomanMoney" type="number" maxlength="3" inputAlign="center" shape="circle"></uv-input>
									</view>
									<text>元</text>
								</myrow>
							</view>
						</view>
					</myrow>
					<view :style="{fontSize: '10px',color: theme.secondary}">
						<text v-show="currentMoney === 0">
							*你支付给别人的报酬
						</text>
						<text v-show="currentMoney === 1">
							*别人支付给你的费用
						</text>
					</view>
					<uv-line margin="5px 0px"></uv-line>
					<myrow>
						<text>报名截止时间</text>
						<expanded></expanded>
						<text @click="openPicker">{{dateString}}</text>
						<uv-picker ref="picker" :columns="pickerColums" @confirm="onPicker" ></uv-picker>
					</myrow>
					<uv-line margin="5px 0px"></uv-line>
					<myrow>
						<text>任务地点</text>
						<expanded></expanded>
						<text @click="openMap" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;max-width: 200px;">{{locationString}}</text>
						<uni-icons type="location-filled"></uni-icons>
					</myrow>
				</view>
			</view>
			<view class="colItem" style="margin-top: 20px;">
				<button @click="submitTask" class="fill-btn-primary" >{{optName}}</button>
			</view>
		</mycol>
	</view>
</template>

<script>
	import {color as theme} from "@/common/theme.js"
	import utilHttp from "@/common/http_util.js"
	import utilTask from "@/common/util_task.js"
	import api from "@/common/api_handle.js"
	import { mapState,mapMutations } from "vuex"
	import store from "@/store/index.js"
	import util_time from "../../common/util_time"
	
	function getDateArray() {
		const datesArray = [];
		const currentDate = new Date();
		for (let i = 0; i < 30; i++) {
			const futureDate = new Date();
			futureDate.setDate(currentDate.getDate() + i);
			
			const year = futureDate.getFullYear();
			const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
			const day = futureDate.getDate().toString().padStart(2, '0');
			
			const formattedDate = `${year}-${month}-${day}`;
			datesArray.push(formattedDate);
		}
		return datesArray;
	}
	
	function getHourArray() {
		var arr = [];
		for (var i = 0; i < 24; i++) {
			arr.push(i.toString().padStart(2, '0'))
		}
		return arr
	}
	
	function getMinArray() {
		var arr = [];
		for (var i = 0; i < 60; i++) {
			arr.push(i.toString().padStart(2, '0'))
		}
		return arr
	}
	
	export default {
		data() {
			return {
				editTask:null,
				txtTitle:"",
				txtContent:"",
				txtManNum:"1",
				txtWomanNum:"0",
				txtManMoney:"0",
				txtWomanMoney:"0",
				imageValue:[],
				imageStyle: {
					borderRadius: '10px',
					margin: '10px',
					width: '70px',
					height: '70px',
					backgroundColor: 'white',
				},
				currentNum:0,
				currentMoney:0,
				theme:theme,
				pickerColums:[
					getDateArray(),getHourArray(),getMinArray()
				],
				dateSelect:[],
				dateString: "请选择日期",
				locationString: "线下任务请选择",
				location: null,
			}
		},
		onLoad(e) {
			if (e?.taskid) {				
				var t = store.getters.getTaskById(e.taskid)
				this.editTask = t
				
				this.txtTitle = t.title
				this.txtContent = t.content
				if (t.man_num < 0) {
					this.txtManNum = t.people_num.toString()
				}else{
					var womann = t.people_num - t.man_num
					this.txtManNum = t.man_num.toString()
					this.txtWomanNum = womann.toString()
					this.currentNum = 1
				}
				
				this.txtManMoney = t.money.toString()
				this.txtWomanMoney = t.womanMoney.toString()
				
				this.currentMoney = t.money_type
				
				if (t.end_time > 0) {
					this.dateString = util_time.formatTime(t.end_time)
				}
				if (t.address) {
					this.locationString = t.address.name || t.address.address
					this.location = t.address
				}
				
				if (t.images?.length) {
					var img = []
					for (let url of t.images) {
						let x = {
							url:url,
							extname: '',
							name: url,
						}
						img.push(x)
					}
					this.imageValue = img
				}
			}
		},
		computed:{
			optName() {
				return this.editTask == null ? "发布任务" : "确认修改"
			}
		},
		methods: {
			...mapState({
				user: state => state.user_data.user,
				userlocation: state => state.user_data.location,
			}),
			...mapMutations(["setLocation"]),
			onSelectImage(e) {
				console.log("select image ",e)
				const tempFilePaths = e.tempFilePaths;
				for (let img of tempFilePaths) {					
					utilHttp.uploadImage(img,(res)=>{
						console.log('上传成功', res);
						// console.log('上传数据转换',JSON.parse(res.data));
						// 取到文档服务器的值
						let uploaddata = JSON.parse(res.data)
						let x = {}
						x.url = utilTask.getImageUrlName(uploaddata.data)
						x.extname = ''
						x.name = uploaddata.data
						this.imageValue.push(x)
					})
				}
			},
			onDeleteImage(e) {
				console.log("delete image ",e)
			},
			onClickNumItem(index) {
				if (this.currentNum !== index) {
					this.currentNum = index
				}
			},
			onClickMoneyItem(index) {
				if (this.currentMoney !== index) {
					this.currentMoney = index
				}
			},
			openPicker() {
				this.$refs.picker.open()
			},
			onPicker(e) {
				console.log(e)
				this.dateSelect = e.value
				this.dateString = `${e.value[0]} ${e.value[1]}:${e.value[2]}:00`
			},
			toChooseLocation(latitude,longitude) {
				uni.chooseLocation({
					latitude:latitude,
					longitude:longitude,
					success: (res) => {
						console.log(res)
						this.locationString = res.name || res.address
						this.location = {
							address:res.address,
							name:res.name,
							latitude:res.latitude,
							longitude:res.longitude,
							Location: `${res.longitude},${res.latitude}`,
						}
					},
					fail: (res) => {
						console.log("fail",res)
					}
				})
			},
			openMap() {
				var longitude = 120.12;
				var latitude = 30.16;
				if (this.userlocation) {
					longitude = this.userlocation.longitude
					latitude = this.userlocation.latitude
					this.toChooseLocation(latitude,longitude)
				}else{					
					uni.getLocation({
						success: (res) => {
							// console.log("get location ",res)
							longitude = res.longitude
							latitude = res.latitude
							this.setLocation({latitude:latitude,longitude:longitude})
						},
						complete:() => {
							this.toChooseLocation(latitude,longitude)
						}
					})
				}
			},
			checkSubmit() {
				if (this.txtTitle.length <= 0) {
					api.toast("标题不能为空")
					return false;
				}
				if (this.txtContent.length <= 0) {
					api.toast("内容不能为空")
					return false;
				}
				
				var stamp = Date.parse(this.dateString) || 0
				if (stamp <= Date.now()) {
					api.toast("报名截止时间不能小于当前时间")
					return false;
				}
				
				var total = parseInt(this.txtManNum) + parseInt(this.txtWomanNum)
				if (total <= 0 || total > 100) {
					api.toast("总人数限制 1~100 人")
					return false;
				}
				return true;
			},
			genTaskInfo() {
				var user = this.user()
				var mann = parseInt(this.txtManNum)
				var womann = parseInt(this.txtWomanNum)
				var total = 0
				if (this.currentNum == 0) {
					// 不分性别
					total = mann
					mann = -1
				}else{
					total = mann + womann
				}
				
				var endtime = Date.parse(this.dateString)/1000
				var task = {
					creator_name: user.name,
					title: this.txtTitle,
					content: this.txtContent,
					money_type: this.currentMoney,
					money: parseInt(this.txtManMoney),
					womanMoney: parseInt(this.txtWomanMoney),
					people_num: total,
					man_num: mann,
					end_time: endtime,
					images: this.imageValue.map((v)=> v.url),
				}
				if (this.location) {
					task.address = this.location
				}
				return task
			},
			isSameTask(t1,t2) {
				var check = ["title","content","money_type","money","womanMoney","people_num","man_num",
				"end_time"];
				for (let f of check) {
					if (t1[f] != t2[f]) {
						return false
					}
				}
				// images
				if (t1.images.length != t2.images.length) {
					return false
				}
				for (var i = 0; i < t1.images.length; i++) {
					if (t1.images[i] != t2.images[i]) {
						return false
					}
				}
				// address
				if (t1.address && t2.address) {
					for (let k in t1.address) {
						if (t1.address[k] != t2.address[k]) {
							return false
						}
					}
				}else if(t1.address == null && t2.address == null) {
					return true
				}else{
					return false
				}
				return true
			},
			submitTask() {
				if (!this.checkSubmit()) {
					return
				}
				var task = this.genTaskInfo()
				if (this.editTask == null) {
					api.apiCreateTask(task).then((res)=>{
						// console.log("submit success ",task);
						api.toast("发布成功")
						uni.navigateBack({})
					})
				}else{
					if (this.editTask.images == null) {
						this.editTask.images = []
					}
					task.id = this.editTask.id
					if (this.isSameTask(task,this.editTask)) {
						uni.navigateBack({})
						return
					}
					api.apiUpdateTask(task).then((res)=>{
						if (res) {							
							api.toast("修改成功")
							store.commit("updateTaskOne",res)
							uni.navigateBack({})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/my.scss";
	
	.mainCol {
		margin: 10px;
	}
	
	.titleStyle {
		border-radius: 20px;
		/* margin: 10px; */
		background-color: white;
		width: 100%;
	}
	
	.colItem {
		margin-bottom: 10px;
		width: 100%;
	}
	
	.itemContent {
		border-radius: 10px;
		background-color: white;
	}
	
	.contentStyle {
		width: 100%;
		/* margin: 10px; */
	}
	
	// .fill-btn-primary {
	// 	width: 100%;
	// 	font-size: 15px;
	// 	border-radius: 30px;
	// 	background-color: $my-color-primary;
	// 	color: white;	
	// }

</style>
