import { ChatContentType } from "./define_const"
import util_time from "./util_time"

function makeChatInfo(ctype,content,user) {
	var now = util_time.getSecond()
	
	return {
		content:content,
		content_type:ctype,
		index:-1,
		send_time:now,
		cid:user.cid,
		sendername:user.name,
		sendericon:user.icon,
	}
}

function makeTaskInfo(task,user) {
	let content = `|task ${task.id}#${task.title}|`
	return makeChatInfo(ChatContentType.Task,content,user)
}

function getShortContent(ctype,content) {
	switch (ctype){
		case ChatContentType.Text:
			return content
			break;
		case ChatContentType.Image:
			return "[图片]"
		case ChatContentType.Task:
			return "[任务]"
		default:
			break;
	}
	return ""
}

export default {
	makeChatInfo,
	makeTaskInfo,
	getShortContent,
}