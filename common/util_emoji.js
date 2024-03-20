var emojiPath = "/static/emoji/"
var emojiMap = new Map()
var emojiName = []

function initEmoji() {
	for (var i = 1; i <= 100; i++) {
		emojiMap.set(`sg${i}`,`${emojiPath}sg${i}.png`)
		emojiName.push(`sg${i}`)
	}
}

function getEmoji(s) {
	return emojiMap.get(s)
}

export default {
	initEmoji,
	emojiName,
	getEmoji
}
