import store from "../store/index.js"
import {
	WsHost
} from "./define_const.js"
import global_data from "./global_data.js"
import NetPack from "./net_pack.js"

export var CmId = {
	LOGIN:0,
	PING:1,
	TASK_CHAT:2,
	LOAD_TASK_CHAT:3,
	N_CM_TASK_CHAT_READ:4,
	CHAT_USER:5,
	CHAT_USER_READ:7,
}

var SmId = {
	PONG:1,
	TASK_CHAT_UPDATE:3,
	TASK_CHAT_INDEX:4,
	SM_CHAT_READ:5,
	CHAT_USER_LIST:8,
	CHAT_USER_READ:9,
	SM_TASK_BE_KICK:10,	//被踢出任务
}

var wsconn = {
	isopen: false,
	_reconnect:false,
	_readDataLenth: 0,
	_readData: new Uint8Array(1024),
	_handle:new Map(),
	_token:"",
	init() {
		uni.onSocketError((res)=> {
			console.log('WebSocket连接打开失败 ', res);
			// 重连
			if (this._reconnect == true) {
				return
			}
			this._reconnect = true
			this.isopen = false
			setTimeout(() => {
				this.connectServer(this._token)
			}, 10000)
		});
		
		uni.onSocketOpen((res) => {
			console.log("ws socket open",res)
			if (this.isopen) {
				return
			}
			this.isopen = true
			this.sendLoginData()
		})
		
		uni.onSocketClose(() => {
			console.error("socket closed");
			if (this.isopen) {
				this.clearData()
			}
			this.isopen = false
			if (global_data.isLogin() && this._reconnect == false) {				
				// 重连
				this._reconnect = true
				setTimeout(() => {
					this.connectServer(this._token)
				}, 5000)
			}
		})
		
		uni.onSocketMessage(this.onReadData.bind(this));
		this.initHandle()
		// console.log("wsconn init")
	},
	initHandle() {
		this._handle.set(SmId.PONG,this.onNetPong.bind(this))
		this._handle.set(SmId.TASK_CHAT_UPDATE,this.onGetTaskChat.bind(this))
		this._handle.set(SmId.TASK_CHAT_INDEX,this.onGetTaskChatIndex.bind(this))
		this._handle.set(SmId.SM_CHAT_READ,this.onLoadTaskChatRead.bind(this))
		this._handle.set(SmId.CHAT_USER_LIST,this.onGetChatUser.bind(this))
		this._handle.set(SmId.CHAT_USER_READ,this.onLoadChatUserRead.bind(this))
		this._handle.set(SmId.SM_TASK_BE_KICK,this.onKickOutTask.bind(this))
		
		
	},
	connectServer(token) {
		if (this.isopen) {
			return
		}
		
		this._reconnect = false
		this.isopen = false
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
	sendNetPack(pid, p,resfunc = null) {
	    if (!this.isopen) {
			if (resfunc) {
				resfunc(false)
			}
	      return;
	    }
		pid += 3000
		uni.sendSocketMessage({
			data:p.decode(pid),
			fail: () => {
				if (resfunc) {
					resfunc(false)
				}
			},
			success: () => {
				if (resfunc) {
					resfunc(true)
				}
			}
		})
	},
	sendJsonData(pid,d,resfunc=null) {
		let p = NetPack.newPack()
		p.writeJsonObject(d)
		this.sendNetPack(pid,p,resfunc)
	},
	sendLoginData() {
		console.log("web socket connected")
		let p = NetPack.newPack()
		p.writeBufferString(this._token)
		this.sendNetPack(CmId.LOGIN,p)
		this.sendPing()
		
		// 清除聊天数据
		store.commit("reloadUserChatData")
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
	},
	onLoadChatUserRead(p) {
		var obj = p.readJsonObject()
		store.commit("onLoadUserChatRead",obj)
		// console.log("onLoadChatUserRead ",obj)
	},
	saveUserChatIndex(readmap) {
		var amap = new Map()
		var p = NetPack.newPack();
		p.writeInt32(readmap.size)
		for (const [key,value] of readmap) {
			p.writeInt64(key)
			p.writeInt32(value)
		}
		this.sendNetPack(CmId.CHAT_USER_READ,p)
	},
	saveTaskChatIndex(readmap) {
		var amap = new Map()
		var p = NetPack.newPack();
		p.writeInt32(readmap.size)
		for (const [key,value] of readmap) {
			p.writeString(key)
			p.writeInt32(value)
		}
		this.sendNetPack(CmId.N_CM_TASK_CHAT_READ,p)
	},
	onLoadTaskChatRead(p) {
		var obj = p.readJsonObject()
		store.commit("onLoadTaskChatRead",obj)
	},
	onKickOutTask(p) {
		var obj = p.readJsonObject()
		store.commit("onKickOutTask",obj)
	}


}

export default wsconn