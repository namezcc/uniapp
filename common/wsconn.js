import store from "../store/index.js"
import {
	WsHost
} from "./define_const.js"
import NetPack from "./net_pack.js"

export var CmId = {
	LOGIN:0,
	PING:1,
	TASK_CHAT:2,
	LOAD_TASK_CHAT:3,
	CHAT_USER:5,
}

var SmId = {
	PONG:1,
	TASK_CHAT_UPDATE:3,
	TASK_CHAT_INDEX:4,
	CHAT_USER_LIST:8,
}

var wsconn = {
	isopen: false,
	_readDataLenth: 0,
	_readData: new Uint8Array(1024),
	_handle:new Map(),
	_token:"",
	init() {
		uni.onSocketError(function(res) {
			console.log('WebSocket连接打开失败 ', res);
		});
		
		uni.onSocketOpen(() => {
			this.isopen = true
			this.sendLoginData()
		})
		
		uni.onSocketClose(() => {
			if (this.isopen) {
				this.clearData()
			}
			this.isopen = false
			// 重连
			setTimeout(() => {
				// this.connectServer(this._token)
			}, 10000)
		})
		
		uni.onSocketMessage(this.onReadData.bind(this));
		this.initHandle()
		// console.log("wsconn init")
	},
	initHandle() {
		this._handle.set(SmId.PONG,this.onNetPong.bind(this))
		this._handle.set(SmId.TASK_CHAT_UPDATE,this.onGetTaskChat.bind(this))
		this._handle.set(SmId.TASK_CHAT_INDEX,this.onGetTaskChatIndex.bind(this))
		this._handle.set(SmId.CHAT_USER_LIST,this.onGetChatUser.bind(this))
		
		
	},
	connectServer(token) {
		setTimeout(()=>{
			if (this.isopen) {
				this.close()
			}
			
			this._token = token

			try{
				var stask = uni.connectSocket({
					url: WsHost,
					complete:()=> {
						// console.log("ws complete ")
					},
					fail: (r) => {
						console.log("ws fail ",r)
					},
					success: (r) => {
						// console.log("ws success ",r)
					}
				})
				stask.onError((r)=>{
					console.log("ws err ",r.toString())
				})							
			}catch(e){
				console.log(e)
			}
		},10)
	},
	close() {
		this.isopen = false
		uni.closeSocket({})
		this.clearData()
	},
	clearData() {
		this._readDataLenth = 0
		this._readData = new Uint8Array(1024)
	},
	concatBuffer(b) {
		let needlen = this._readDataLenth + b.length
		if (needlen > this._readData.byteLength) {
			let newlen = needlen > this._readData.byteLength * 2 ? needlen : this._readData.byteLength * 2
			let nb = new Uint8Array(newlen)
			nb.set(this._readData, 0)
			this._readData = nb
		}
		this._readData.set(new Uint8Array(b), this._readDataLenth)
		this._readDataLenth += b.length
	},
	onReadData(res) {
		// console.log('收到服务器内容：' + res.data);
		var data = new Uint8Array(res.data);
		this.concatBuffer(data)

		let offset = 0;
		while (this._readDataLenth - offset >= 8) {
			const packlen = new DataView(this._readData.buffer, offset).getInt32(0, true);
			if (packlen > this._readDataLenth - offset) {
				break;
			}
			const pid = new DataView(this._readData.buffer, offset + 4).getInt32(0, true);
			if (packlen > 655350) {
				console.error(`get pack size error ${packlen} pid:${pid}`);
				break;
			}
			let sublist;
			if (packlen - 8 > 0) {
				sublist = this._readData.buffer.slice(offset + 8, offset + packlen);
			} else {
				sublist = new ArrayBuffer(0);
			}
			this.onReadNetPack(pid, NetPack.fromPack(sublist));
			offset += packlen;
		}
		if (offset > 0) {
			if (this._readDataLenth > offset) {
				this._readData.set(this._readData.slice(offset, this._readDataLenth), 0)
			}
			this._readDataLenth -= offset
		}
	},
	sendNetPack(pid, p) {
	    if (!this.isopen) {
	      console.error("socket closed");
	      return;
	    }
		pid += 3000
		uni.sendSocketMessage({
			data:p.decode(pid)
		})
	},
	sendJsonData(pid,d) {
		let p = NetPack.newPack()
		p.writeJsonObject(d)
		this.sendNetPack(pid,p)
	},
	sendLoginData() {
		console.log("web socket connected")
		let p = NetPack.newPack()
		p.writeBufferString(this._token)
		this.sendNetPack(CmId.LOGIN,p)
		this.sendPing()
	},
	sendPing() {
		setTimeout(()=>{
			let p = NetPack.newPack()
			this.sendNetPack(CmId.PING,p)
		},10*1000)
	},
	onReadNetPack(pid,p) {
		let f = this._handle.get(pid)
		// console.log("get pack pid ",pid)
		if (f != undefined) {
			f(p)
		}
	},
	onNetPong() {
		this.sendPing()
		// console.log("on net ping")
	},
	onGetTaskChat(pack) {
		var obj = pack.readJsonObject()
		// console.log("get task chat ",obj)
		// 存入数据库
		
		// 
		store.commit("onGetTaskChat",obj)
	},
	onGetTaskChatIndex(p) {
		var obj = p.readJsonObject()
		// console.log("chat index ",obj)
		store.commit("onGetTaskChatIndex",obj)
	},
	loadTaskChatFromNet(taskid,startIndex,endIndex) {
	    if (startIndex < 0) {
	      startIndex = 0;
	    }
	    var num = endIndex - startIndex;
	    var p = NetPack.newPack();
	    p.writeString(taskid);
	    p.writeInt32(startIndex);
	    p.writeInt32(num);
	    this.sendNetPack(CmId.LOAD_TASK_CHAT, p);
	},
	onGetChatUser(p) {
		var obj = p.readJsonObject()
		store.commit("onGetUserChat",obj)
	}


}

export default wsconn