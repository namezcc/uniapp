// var HostBase = "http://192.168.0.39:18999"
// var WsHost = "ws://192.168.0.39:10002/"
var HostBase = "http://47.99.56.195:18999"
var WsHost = "ws://47.99.56.195:10002/"
// var HostBase = "http://192.168.0.77:8999"
// var WsHost = "ws://192.168.0.77:10002/"

var ErrCode = {
	SUCCESS:0,
	ERROR:1,
}

var EnumSex = {
	WOMAN:0,
	MAN:1,
}

var TaskMoneyType = {
	Reward:0,
	Cost:1,
}

var EnumLoadState = {
	More:"more",
	Loading:"loading",
	noMore:"noMore",
}

var ServerConfig = {
	LoadTaskNum: 20,
}

var UserFinishState = {
	none:0,
	haveMoney:1,
	getMoney:2,
	down:3,
}

class LoadState {
	constructor(state) {
		this.state = state || EnumLoadState.More
		this.stateStr = "more"
	}
	
	setState(state) {
		this.state = state
		if (state == EnumLoadState.More) {
			this.stateStr = "more"
		} else if(state == EnumLoadState.Loading){
			this.stateStr = "loading"
		}else if(state == EnumLoadState.noMore){
			this.stateStr = "noMore"
		}
	}
}

var UpdateEventType = {
	Task:"evUpdateTask",
}

var ChatContentType = {
	Text:1,
	Image:2,
	Task:3
}

var PageType = {
	User:1,
	ChatUser:2,
	ChatTask:3,
}

var ReportTaskType = {
	fanzui:0,   //违法犯罪
	  seqing:1,   //色情低俗
	  zhapian:2,  //涉嫌欺诈
	  zhengzhi:3, //政治敏感
	  other:4,    //其他
}

var ReportUserType = {
	fanzui:0,   //违法犯罪
	  seqing:1,   //色情低俗
	  zhapian:2,  //涉嫌欺诈
	  zhengzhi:3, //政治敏感
	  other:4,    //其他
}

var ReportTaskName = [
	"违法犯罪",
	"色情低俗",
	"涉嫌欺诈",
	"政治敏感",
	"其他",
]

var ReportUserName = [
	"违法犯罪",
	"色情低俗",
	"涉嫌欺诈",
	"政治敏感",
	"其他",
]

export {
	ErrCode,
	EnumSex,
	HostBase,
	WsHost,
	TaskMoneyType,
	EnumLoadState,
	LoadState,
	ServerConfig,
	UserFinishState,
	UpdateEventType,
	ChatContentType,
	PageType,
	ReportTaskType,
	ReportUserType,
	ReportTaskName,
	ReportUserName,
}