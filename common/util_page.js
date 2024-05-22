
function toLoginPageDialog() {
	uni.showModal({
		title:"请先登录",
		confirmText:"去登录",
		fail() {
			
		},
		success(res) {
			if (res.confirm) {
				uni.navigateTo({
					url:"/pages/user/login"
				})
			}
		}
	})
}

function toIdCardPage() {
	uni.navigateTo({
		url:"/pages/edit/edit_idcard_page"
	})
}

export default {
	toLoginPageDialog,
	toIdCardPage,
}