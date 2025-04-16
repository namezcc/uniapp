import { FontHost } from "./define_const"

function loadFont() {
	let url = FontHost+"Alibaba-PuHuiTi-Heavy.ttf"
	console.log("start loadfont",url)
	uni.loadFontFace({
		family:"AlibabaPuHuiTi_2_105_Heavy",
		source:`url(${url})`,
		global:true,
		success: () => {
			console.log("loadfont success")
		},
		fail: (err) => {
			console.log("loadfont fail",err)
		},
	})
}

export default {
	loadFont,
}