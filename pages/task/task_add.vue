<template>
	<view  class="mainCol main-text">
		<mycol>			
			<view class="titleStyle colItem">
				<uv-input v-model="txtTitle" border="none" placeholder="标题" maxlength="30" fontSize="16" inputAlign="start" />
			</view>
			<view class="contentStyle colItem">
				<myrow>
					<image src="@/static/icon_tip.png" style="width: 37px;height: 26px;margin-left: 9px;"></image>
					<text class="tip-text" style="margin-left: 8px;">{{taskTypeString}}</text>
				</myrow>
					<uv-textarea v-model="txtContent" border="none" placeholder="详细内容..." count maxlength="1000" height="100" ></uv-textarea>
				<!-- <view class="">
				</view> -->
			</view>
			<view class="colItem itemContent">
				<view class="contentPadding">
					<uni-file-picker v-model="imageValue" title="选择图片" limit="9" :imageStyles="imageStyle" file-mediatype="image"
					@delete="onDeleteImage" @select="onSelectImage" :sizeType="['compressed']" >
						<uni-icons type="plusempty" style="color: black;"></uni-icons>
					</uni-file-picker>
				</view>
			</view>
			<view class="colItem itemContent">
				<view class="contentPadding">
					<!-- <uni-data-checkbox v-model="currentNum" :localdata="sexNum" mode="tag" selectedColor="#87d694"></uni-data-checkbox> -->
					<myrow>
						<template v-for="(item,index) in sexNum" :key="index">
							<view :class="currentNum == index ? 'num-select':'num-unselect'" @click="onClickNumItem(index)">
								<text>{{item.text}}</text>
							</view>
						</template>
					</myrow>
					<view class="lineMargin"></view>
					<myrow>
						<view>
							<!-- <uv-subsection mode="subsection" :activeColor="theme.primary" :inactiveColor="theme.primary" fontSize="12" :current="currentNum" :list="['任务人数','男女人数']" @change="onClickNumItem"></uv-subsection> -->
							<!-- <picker :value="currentNum" :range="numtype" @change="onClickNumItem">
								<view>
									<text>{{numtype[currentNum]}}</text>
									<uni-icons type="right"></uni-icons>
								</view>
							</picker> -->
							人数
						</view>
						<expanded></expanded>
						<view>
							<view v-show="currentNum !== 1">
								<myrow>
									<!-- <view :style="{width: inputWidth+'px'}">
									</view> -->
									<uv-input v-model="txtManNum" type="number" maxlength="3" inputAlign="center" shape="circle" border="none" :customStyle="inputStyle"></uv-input>
									<text>人</text>
								</myrow>
							</view>
							<view v-show="currentNum === 1">
								<myrow>
									男
									<!-- <view :style="{width: inputWidth+'px'}">
									</view> -->
									<uv-input v-model="txtManNum" type="number" maxlength="3" inputAlign="center" shape="circle" border="none" :customStyle="inputStyle"></uv-input>
									<text>人</text>
									<view style="width: 20px;"></view>
									女
									<!-- <view :style="{width: inputWidth+'px'}">
									</view> -->
									<uv-input v-model="txtWomanNum" type="number" maxlength="3" inputAlign="center" shape="circle" border="none" :customStyle="inputStyle"></uv-input>
									<text>人</text>
								</myrow>
							</view>
						</view>
					</myrow>					
					<!-- <uv-line margin="5px 0px"></uv-line> -->
					<view class="lineMargin"></view>
					<myrow>
						<view style="width: 120px;">
							<!-- <uv-subsection mode="subsection" :activeColor="theme.primary" :inactiveColor="theme.primary" fontSize="12" :current="currentMoney" :list="['任务奖励','男女收费']" @change="onClickMoneyItem"></uv-subsection> -->
							<picker :value="currentMoney" :range="moneyType" @change="onClickMoneyItem">
								<myrow>
									<text style="margin-right: 3px;">{{moneyType[currentMoney]}}</text>
									<!-- <uni-icons type="down"></uni-icons> -->
									<uv-icon name="arrow-down"></uv-icon>
								</myrow>
							</picker>
						</view>
						<expanded></expanded>
						<view>
							<view v-show="currentMoney === 0">
								<myrow>
									<!-- <view :style="{width: inputWidth+'px'}">
									</view> -->
									<uv-input v-model="txtManMoney" type="number" maxlength="10" inputAlign="center" shape="circle" border="none" :customStyle="inputStyle"></uv-input>
									<text>元</text>
								</myrow>
							</view>
							<view v-show="currentMoney === 1">
								<myrow>
									男
									<!-- <view :style="{width: inputWidth+'px'}">
									</view> -->
									<uv-input v-model="txtManMoney" type="number" maxlength="10" inputAlign="center" shape="circle" border="none" :customStyle="inputStyle"></uv-input>
									<text>元</text>
									<view style="width: 20px;"></view>
									女
									<!-- <view :style="{width: inputWidth+'px'}">
									</view> -->
									<uv-input v-model="txtWomanMoney" type="number" maxlength="10" inputAlign="center" shape="circle" border="none" :customStyle="inputStyle"></uv-input>
									<text>元</text>
								</myrow>
							</view>
						</view>
					</myrow>
					<view class="sub-text">
						<text v-show="currentMoney === 0">
							你支付给别人的报酬
						</text>
						<text v-show="currentMoney === 1">
							别人支付给你的费用
						</text>
					</view>
					<view class="lineMargin"></view>
					<myrow>
						<text>联系方式</text>
						<expanded></expanded>
						<input v-model="contact_way" placeholder-class="sub-text" placeholder="填写联系你的方式" class="contact-input" maxlength="30" />
					</myrow>
				</view>
			</view>
			<view class="colItem itemContent">
				<view class="contentPadding">
					<myrow>
						<text>报名截止时间</text>
						<expanded></expanded>
						<text :class="timeClass" @click="openPicker(1)">{{taskJoinEndTime}}</text>
						<uv-picker ref="picker" :columns="pickerColums" @confirm="onPicker" ></uv-picker>
					</myrow>
					<view v-if="tasktype != 1">						
						<view class="lineMargin"></view>
						<myrow>
							<!-- <checkbox-group @change="onSetTaskTime">
								<label>
									<text>开始结束时间</text>
									<checkbox value="1" :color="theme.primary" :border-color="theme.primary" />
								</label>
							</checkbox-group> -->
							<text>开始结束时间</text>
							<expanded></expanded>
							<switch style="transform:scale(0.7)" :checked="haveTaskTime" :color="theme.primary_low" @change="onSetTaskTime"></switch>
						</myrow>
					</view>
					<view class="lineMargin"></view>
					<myrow v-if="haveTaskTime" mainAlign="center" >
						<view class="timeContent" @click="openPicker(2)">
							{{taskStartTime}}
						</view>
						<text style="margin: 10px;">至</text>
						<view class="timeContent" @click="openPicker(3)">
							{{taskEndTime}}
						</view>
					</myrow>
					<view class="lineMargin"></view>
					<myrow>
						<text>地点</text>
						<expanded></expanded>
						<text @click="openMap" :class="locationClass" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;max-width: 200px;">{{locationStr}}</text>
						<uni-icons type="location-filled"></uni-icons>
					</myrow>
					<view class="lineMargin"></view>
					<myrow>
						<text>年龄限制</text>
						<expanded></expanded>
						<text @click="openAgePicker">{{ageLimit}}</text>
						<uni-icons type="right"></uni-icons>
						<uv-picker ref="agepicker" :columns="pickerAgeColums" :defaultIndex="pickerAgeDefault" @confirm="onPickerAge" ></uv-picker>
					</myrow>
					<view class="lineMargin"></view>
					<myrow>
						<text>信用分</text>
						<expanded></expanded>
						<view style="width: 200px;">
							<uv-slider v-model="credit_score" min="50" max="150" activeColor="#000" block-color="#000"></uv-slider>
						</view>
						<text class="text-score">{{creditScore}}</text>
					</myrow>
					<view class="lineMargin"></view>
					<myrow>
						<text>是否公开</text>
						<expanded></expanded>
						<switch style="transform:scale(0.7)" :checked="taskOpen" :color="theme.primary_low" @change="onTaskOpen"></switch>
					</myrow>
				</view>
			</view>
			<myrow mainAlign="center">
				<label>
					<checkbox style="transform:scale(0.7)" activeBackgroundColor="#000" :iconColor="theme.primary" value="1" :checked="agree" @click="setAgree" />
					<text class="agree-txt" @click.stop="toPageNrfb">《帮帮内容发布规范》</text>
				</label>
				<!-- <expanded></expanded> -->
			</myrow>
			<view class="colItem" style="margin-top: 20px;">
				<button @click="submitTask" class="fill-btn-primary" style="font-size: 16px;width: 172px" >
					<myrow mainAlign="center">
						<uni-icons type="paperplane-filled" :color="theme.primary" size="22"></uni-icons>
						<text style="margin-left: 6px;">{{optName}}</text>
					</myrow>
				</button>
			</view>
			<uv-safe-bottom></uv-safe-bottom>
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
import util_page from "../../common/util_page"
import util_common from "../../common/util_common"
import { AgeType, TaskType } from "../../common/define_const"
	
	let useDateArray = [];
	
	function getDateArray() {
		const datesArray = [];
		const currentDate = new Date();
		for (let i = 0; i < 90; i++) {
			const futureDate = new Date();
			futureDate.setDate(currentDate.getDate() + i);
			
			const year = futureDate.getFullYear();
			const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
			const day = futureDate.getDate().toString().padStart(2, '0');
			const week = util_time.weekString[futureDate.getDay()]
			
			const formattedDate = `周${week} ${month}月${day}日`;
			datesArray.push(formattedDate);
			useDateArray.push(`${year}-${month}-${day}`)
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
	
	function getAgeArray() {
		let arr = [];
		for (var i = 18; i <= 65; i++) {
			arr.push(i.toString())
		}
		arr.push("不限")
		return arr
	}
	
	let pickType = {
		joinEndTime:1,
		taskStart:2,
		taskEnd:3,
	}
	
	let nowPickType = pickType.joinEndTime
	
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
				inputWidth:60,
				imageValue:[],
				imageStyle: {
					borderRadius: '10px',
					margin: '10px',
					width: '70px',
					height: '70px',
					backgroundColor: 'white',
				},
				inputStyle:{
					width: '65px',
					height: '28px',
					background: '#F8F8F8',
					borderRadius: '14px',
					border: '1px solid #D4D4D4',
				},
				currentNum:0,
				currentMoney:0,
				theme:theme,
				pickerColums:[
					getDateArray(),getHourArray(),getMinArray()
				],
				dateSelect:[],
				// dateString: "请选择日期",
				locationString: "",
				location: null,
				joinEndTime:0,
				numtype:["男女不限","自定义","限女生","限男生"],
				sexNum:[
					{text:"男女不限",value:0},
					{text:"自定义",value:1},
					{text:"限女生",value:2},
					{text:"限男生",value:3},
				],
				moneyType:["奖励","收费"],
				haveTaskTime:false,
				startTime:0,
				endTime:0,
				taskOpen:true,
				credit_score:80,
				agree:true,
				contact_way:"",
				pickerAgeColums:[getAgeArray(),getAgeArray()],
				agemin:18,
				agemax:AgeType.Max,
				pickerAgeDefault:[0,AgeType.Max-18],
				tasktype:TaskType.Active,
			}
		},
		onLoad(e) {
			// uni.setNavigationBarColor({
			// 	backgroundColor:theme.primary,
			// 	frontColor:"#ffffff",
			// })
			
			if (e.tasktype != null) {
				this.tasktype = parseInt(e.tasktype)
			}
			
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
				
				this.joinEndTime = t.end_time
				this.startTime = t.task_start_time || 0
				this.endTime = t.task_end_time || 0
				this.haveTaskTime = this.startTime > 0 && this.endTime > 0
				this.taskOpen = !(t.nonpublic == true)
				this.credit_score = t.credit_score || 0
				this.contact_way = t.contact_way || ""
				this.agemin = t.agemin || 18
				this.agemax = t.agemax || 65
				this.tasktype = t.tasktype || TaskType.Active
				
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
			
			switch (this.tasktype){
				case TaskType.Active:
					this.currentMoney = 1
					break;
				case TaskType.Help:
					break;
				case TaskType.Service:
					this.currentMoney = 1
					break;
				default:
					break;
			}
		},
		computed:{
			...mapState({
				user: state => state.user_data.user,
				userlocation: state => state.user_data.location,
			}),
			taskTypeString(){
				switch (this.tasktype){
					case TaskType.Active:
						return "活动组局"
					case TaskType.Help:
						return "寻求帮助"
					case TaskType.Service:
						return "提供服务"
					default:
						break;
				}
				return ""
			},
			optName() {
				return this.editTask == null ? "立即发布" : "确认修改"
			},
			timeClass() {
				if (this.joinEndTime == 0) {
					return "sub-text"
				}else{
					return ""
				}
			},
			taskJoinEndTime() {
				if (this.joinEndTime == 0) {
					return "请选择日期"
				}else{
					return util_time.formatTaskWeekTime(this.joinEndTime,{day:true,week:true})
				}
			},
			taskStartTime() {
				if (this.startTime == 0) {
					return "请选择"
				}else{
					return util_time.formatTaskWeekTime(this.startTime,{day:true,week:true})
				}
			},
			taskEndTime() {
				if (this.endTime == 0) {
					return "请选择"
				}else{
					return util_time.formatTaskWeekTime(this.endTime,{day:true,week:true})
				}
			},
			creditScore() {
				return `≥ ${this.credit_score} 分`
			},
			ageLimit() {
				let min = this.agemin >= AgeType.Max ? AgeType.Min : this.agemin
				let max = this.agemax >= AgeType.Max ? "不限" : `${this.agemax}岁`
				return `${min} - ${max}`
			},
			locationStr() {
				return this.locationString == "" ? "线下请选择地点" :this.locationString
			},
			locationClass() {
				return this.locationString == "" ? "sub-text" : ""
			},
		},
		methods: {
			...mapMutations(["setLocation"]),
			onSelectImage(e) {
				console.log("select image ",e)
				// const tempFilePaths = e.tempFilePaths;
				// for (let img of tempFilePaths) {					
				// 	utilHttp.uploadImage(img,(res)=>{
				// 		console.log('上传成功', res);
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
			},
			onDeleteImage(e) {
				console.log("delete image ",e)
			},
			onClickNumItem(index) {
				// console.log("moneyitem ",e)
				// let index = e.detail.value
				if (this.currentNum !== index) {
					this.currentNum = index
				}
			},
			onClickMoneyItem(e) {
				console.log("moneyitem ",e)
				let index = parseInt(e.detail.value)
				if (this.currentMoney !== index) {
					this.currentMoney = index
				}
			},
			openPicker(picktype) {
				nowPickType = picktype
				this.$refs.picker.open()
			},
			openAgePicker() {
				this.$refs.agepicker.open()
			},
			onPicker(e) {
				// console.log(e)
				//this.dateSelect = e.index
				let stamp = util_time.getSecond(`${useDateArray[e.indexs[0]]} ${e.value[1]}:${e.value[2]}:00`)
				if (nowPickType == pickType.joinEndTime) {
					this.joinEndTime = stamp
					// this.dateString = `${e.value[0]} ${e.value[1]}:${e.value[2]}`
				}else if(nowPickType == pickType.taskStart) {
					this.startTime = stamp
				}else {
					this.endTime = stamp
				}
			},
			onPickerAge(e) {
				// console.log(e)
				//this.dateSelect = e.index
				this.agemin = Math.min(e.indexs[0],e.indexs[1]) + AgeType.Min
				this.agemax = Math.max(e.indexs[0],e.indexs[1]) + AgeType.Min
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
					// uni.getLocation({
					// 	success: (res) => {
					// 		// console.log("get location ",res)
					// 		longitude = res.longitude
					// 		latitude = res.latitude
					// 		this.setLocation({latitude:latitude,longitude:longitude})
					// 	},
					// 	complete:() => {
					// 		this.toChooseLocation(latitude,longitude)
					// 	}
					// })
					
					uni.getFuzzyLocation({
						complete:() => {
							this.toChooseLocation(latitude,longitude)
						},
						success:(res)=>{
							console.log("get location ",res)
							longitude = res.longitude
							latitude = res.latitude
							this.setLocation({latitude:latitude,longitude:longitude})
							store.commit("setLocation",{latitude:res.latitude,longitude:res.longitude})
						}
					})
				}
			},
			checkSubmit() {
				if (this.txtTitle.length <= 0) {
					api.toast("标题不能为空")
					return false;
				}
				// if (this.txtContent.length <= 0) {
				// 	api.toast("内容不能为空")
				// 	return false;
				// }
				
				if (!this.agree) {
					api.toast("请先阅读并勾选帮帮内容发布规范")
					return
				}
				
				let now = util_time.getSecond()
				if (this.joinEndTime <= now) {
					api.toast("报名截止时间不能小于当前时间")
					return false;
				}
				
				if (this.haveTaskTime) {
					if (this.startTime <= now) {
						api.toast("开始时间不能小于当前时间")
						return false
					}
					if (this.endTime < this.startTime) {
						api.toast("结束时间不能小于开始时间")
						return false
					}
					if (this.endTime <= this.joinEndTime) {
						api.toast("结束时间不能小于报名截止时间")
						return false
					}
				}
				if (util_common.toInt(this.txtManMoney) < 0 || util_common.toInt(this.txtWomanMoney) < 0) {
					api.toast("金额不能小于0")
					return false
				}
				
				let mann = util_common.toInt(this.txtManNum)
				let womann = util_common.toInt(this.txtWomanNum)
				if (mann < 0 || womann < 0) {
					api.toast("人数不能小于0")
					return
				}
				
				var total = mann + womann
				if (total <= 0 || total > 100) {
					api.toast("总人数限制 1~100 人")
					return false;
				}
				return true;
			},
			genTaskInfo() {
				var user = this.user
				var mann = util_common.toInt(this.txtManNum)
				var womann = util_common.toInt(this.txtWomanNum)
				var total = 0
				if (this.currentNum == 0) {
					// 不分性别
					total = mann
					mann = -1
				}else if(this.currentNum == 2) {
					womann = mann
					mann = 0
					total = mann + womann
				}else{
					total = mann + womann
				}
				
				var task = {
					creator_name: user.name,
					title: this.txtTitle,
					content: this.txtContent,
					money_type: this.currentMoney,
					money: util_common.toInt(this.txtManMoney),
					womanMoney: util_common.toInt(this.txtWomanMoney),
					people_num: total,
					man_num: mann,
					end_time: this.joinEndTime,
					task_start_time:this.haveTaskTime ? this.startTime :0,
					task_end_time:this.haveTaskTime ? this.endTime :0,
					images: this.imageValue.map((v)=> v.url),
					nonpublic:this.taskOpen ? 0 : 1,
					credit_score:this.credit_score,
					contact_way:this.contact_way,
					agemin: this.agemin,
					agemax: this.agemax,
					tasktype: this.tasktype,
				}
				if (this.location) {
					task.address = this.location
				}
				return task
			},
			isSameTask(t1,t2) {
				var check = ["title","content","money_type","money","womanMoney","people_num","man_num","contact_way",
				"end_time","task_start_time","task_end_time","credit_score","nonpublic"];
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
				
				if (this.user.age <= 0) {
					api.toast("请先进行实名验证")
					util_page.toIdCardPage()
					return
				}
				
				var task = this.genTaskInfo()
				if (this.editTask == null) {
					uni.showLoading({
						title:"发布中..."
					})
					api.apiCreateTask(task).then((res)=>{
						// console.log("submit success ",task);
						
						// api.toast("发布成功")
						// uni.navigateBack({})
						if (res) {
							this.submitRes("发布成功")
						}else{
							this.submitRes("发布失败,请重试")
						}
					}).finally(()=>{
						uni.hideLoading()
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
					uni.showLoading({
						title:"发布中..."
					})
					api.apiUpdateTask(task).then((res)=>{
						if (res) {
							this.submitRes("发布成功")
							res.join = this.editTask.join
							store.commit("updateTaskOne",res)
						}else{
							this.submitRes("发布失败,请重试")
						}
					}).finally(()=>{
						uni.hideLoading()
					})
				}
			},
			submitRes(title,back = true) {
				uni.showModal({
					title:title,
					// content:"感谢您的提交,我们会及时查看",
					success: (res) => {
						if (res.confirm && back) {
							uni.navigateBack({})
						}
					},
					fail: () => {
						// uni.navigateBack({})
					}
				})
			},
			onSetTaskTime(e) {
				// console.log("checkbox",e)
				this.haveTaskTime = e.detail.value
			},
			onTaskOpen(e) {
				// console.log("open ",e)
				this.taskOpen = e.detail.value
			},
			setAgree() {
				this.agree = !this.agree
			},
			toPageNrfb() {
				uni.navigateTo({
					url:"/pages/web/web_xy_nrfb"
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/my.scss";
	
	.main-text {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 16px;
		line-height: 20px;
		text-align: justify;
		font-style: normal;
	}
	
	.tip-text {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		// font-size: 14px;
		color: #1E221E;
		line-height: 20px;
		text-align: justify;
		font-style: normal;
		margin: 5px 10px;
	}
	
	.num-select, .num-unselect {
		border-radius: 13px;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		// font-size: 14px;
		line-height: 20px;
		text-align: justify;
		font-style: normal;
		margin-right: 5px;
		padding: 3px 5px;
	}
	
	.num-select {
		color: #124778;
		background: #F4F8FB;
	}
	
	.num-unselect {
		color: #6F6F6F;
		background: #F6F6F6;
	}
	
	.num-input {
		width: 65px;
		height: 28px;
		background: #F8F8F8;
		// border-radius: 14px;
		border: 1px solid #D4D4D4;
	}
	
	.mainCol {
		margin: 10px;
		color: $uni-main-color;
	}
	
	.titleStyle {
		border-radius: 8px;
		height: 45px;
		/* margin: 10px; */
		background-color: white;
		width: 100%;
		
		display: flex; /* 开启flex布局 */
		justify-content: center; /* 水平居中对齐 */
		align-items: center; /* 垂直居中对齐 */
	}
	
	.colItem {
		margin-bottom: 10px;
		width: 100%;
		// margin: 10rpx;
	}
	
	.itemContent {
		border-radius: 10px;
		background-color: white;
		
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		// font-size: 14px;
		color: #333333;
		line-height: 20px;
		text-align: justify;
		font-style: normal;
		// margin: 10rpx;
		// padding: 10rpx;
	}
	
	.sub-text {
		color: #C3C3C3;
		// font-size: 14px;
	}
	
	.contentPadding {
		padding: 10px;
	}
	
	.contentStyle {
		width: 100%;
		/* margin: 10px; */
		background-color: $my-color-primary;
		border-radius: 11px 11px 0px 0px;
	}
	
	.lineMargin {
		margin: 10px;
	}
	
	.text-color-second {
		color: $my-color-primary-second;
	}
	
	.input-padding{
		padding: 0rpx 10rpx;
	}
	
	.text-score {
		// color: $my-color-primary-second;
		// font-size: 14px;
	}
	
	.agree-txt {
		color: $my-color-warn_primary;
		font-size: 14px;
	}
	
	.contact-input {
		text-align: right;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		// font-size: 14px;
		color: #333333;
		line-height: 20px;
		// text-align: justify;
		font-style: normal;
		// font-size: 14px;
	}
	// .fill-btn-primary {
	// 	width: 100%;
	// 	font-size: 15px;
	// 	border-radius: 30px;
	// 	background-color: $my-color-primary;
	// 	color: white;	
	// }

</style>
