<template>
	<view>
		<view class="input-content">
			<myrow>
				<uv-textarea ref="chatinput" autoHeight :cursor="cursor" :focus="focus" @blur="onInputBlue"
					v-model="inputContent" :customStyle="{margin:'10px',backgroundColor: '#fff'}"
					:adjustPosition="false" @keyboardheightchange="onKeyBoardHeight" />
				<toggle-button @state="toggleEmojiKeyboard" :state1="!emojiKeyboardVisible" :customStyle="{margin:'5px'}">
					<template v-slot>
						<myicon name="biaoqing" :customStyle="{fontSize:'24px'}"></myicon>
					</template>
					<template v-slot:state2>
						<myicon name="jianpan1" :customStyle="{fontSize:'24px'}"></myicon>
					</template>
				</toggle-button>
				
				<toggle-button @state="onCustomKeyBoard" :state1="!customBoardShow" :customStyle="{margin:'5px'}">
					<template v-slot>
						<uv-icon name="plus-circle" size="26px"></uv-icon>
					</template>
					<template v-slot:state2>
						<uv-icon name="close-circle" size="26px"></uv-icon>
					</template>
				</toggle-button>
			</myrow>
		</view>
		<view class="emoji-keyboard" v-show="emojiKeyboardVisible">
			<scroll-view scroll-y="true" class="emoji-content" enable-flex="true">
				<uv-grid :col="7" @click="onClickEmoji">
					<uv-grid-item v-for="(emoji,index) in emojis" :key="index">
						<image class="emoji-item" :src="`/static/emoji/${emoji}.png`" :key="emoji"></image>
					</uv-grid-item>
				</uv-grid>
			</scroll-view>
			<view class="emoji-opt">
				<myrow>
					<expanded></expanded>
					<button class="emoji-opt-btn" @click="deleteText">
						<uv-icon name="backspace" size="24px"></uv-icon>
					</button>
					<button class="emoji-opt-btn" style="margin: 10px;" @click="onSendMsg">
						<text style="font-size: 12px;">发送</text>
					</button>
				</myrow>
			</view>
		</view>
		<view class="custom-board" v-show="customBoardShow">
			<view style="height: 10px;"></view>
			<slot name="customBoard"></slot>
		</view>
		<view :style="{height:keyBoardHeight+'px',width:'100%'}"></view>
		<uv-safe-bottom></uv-safe-bottom>
	</view>
</template>

<script>
	import util_emoji from '../../common/util_emoji';

	function insertString(originalString, insertString, index) {
		return originalString.slice(0, index) + insertString + originalString.slice(index);
	}

	function removeSubstring(str, startIndex, endIndex) {
		return str.slice(0, startIndex) + str.slice(endIndex);
	}
	
	export default {
		name:"chat-input",
		emits: ['sendmsg'],
		data() {
			return {
				inputContent: '',
				emojis: util_emoji.emojiName,
				emojiKeyboardVisible: false,
				customBoardShow: false,
				keyBoardHeight: 0,
				cursor: -1,
				focus: false,
			};
		},
		methods:{
			onInputBlue(event) {
				this.cursor = event.detail.cursor
			},
			
			onClickEmoji(n) {
				this.addEmoji(this.emojis[n])
			},
			addEmoji(emoji) {
				var nstr = '[' + emoji + ']'
				if (this.cursor == -1) {
					this.inputContent += nstr;
				} else {
					this.inputContent = insertString(this.inputContent, nstr, this.cursor)
					this.cursor += nstr.length
				}
			},
			toggleEmojiKeyboard(state) {
				this.emojiKeyboardVisible = !this.emojiKeyboardVisible;
				if (!this.emojiKeyboardVisible) {
					this.focus = true
				} else {
					this.focus = false
					this.customBoardShow = false
				}
			},
			deleteText() {
				var endi = this.cursor
				if (this.cursor < 0) {
					endi = this.inputContent.length
				}
			
				var starti = endi - 1
				if (this.inputContent[endi - 1] == "]") {
					for (var i = endi - 1; i >= 0; i--) {
						if (this.inputContent[i] == '[') {
							starti = i
							break
						}
					}
				}
				if (endi <= 0) {
					return
				}
				this.inputContent = removeSubstring(this.inputContent, starti, endi)
				this.cursor = starti
			},
			onKeyBoardHeight(r) {
				this.keyBoardHeight = r.detail.height
			},
			onCustomKeyBoard(state) {
				// console.log("onCustomKeyBoard ", state)
				this.customBoardShow = !this.customBoardShow
				if (this.customBoardShow) {
					this.emojiKeyboardVisible = false
					uni.hideKeyboard()
				}
			},
			onSendMsg() {
				if (this.inputContent.length <= 0) {
					return
				}
				this.$emit("sendmsg",this.inputContent)
			}
		}
	}
</script>

<style lang="scss">
	.input-content {
		background-color: #9a9a9a;
	}
	
	.emoji-keyboard {
		height: 300px;
		width: 100%;
		// background-color: #fff;
	}
	
	.custom-board {
		height: 300px;
		width: 100%;
		// background-color: #fff;
	}
	
	.emoji-opt {
		position: relative;
		bottom: 80px;
	}
	
	.emoji-opt-btn {
		display: flex;
		// flex-direction: row;
		// flex-wrap: nowrap;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
		width: 50px;
		/* 按钮宽度，根据需要设置 */
		height: 30px;
		/* 按钮高度，根据需要设置 */
		padding: 0px;
		/* 其他按钮样式 */
	}
	
	.emoji-content {
		height: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	
	.emoji-item {
		width: 30px;
		height: 30px;
		// background-size: cover;
		margin: 5px 10px;
	}

</style>