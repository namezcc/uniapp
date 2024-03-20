import { table_create } from "./util_table"

function makeKV(obj) {
	let vec = []
	for (let k in where) {
		let v = where[k]
		vec.push(`${k}=${v}`)
	}
	return vec.join(",")
}

function makeWhere(where) {
	let kv = makeKV(where)
	if (kv == "") {
		return ""
	}
	return " WHERE "+kv
}

var util_db = {
	name:"",
	path:"",
	initDb(cid) {
		var newname = `bb_${cid}`
		if (this.name != "" && this.name != newname) {
			if(this.isOpen()){
				plus.sqlite.closeDatabase({
					name:this.name
				})
			}
		}
		this.name = `bb_${cid}`
		this.path = `_cod/bb_${cid}.db`
		
		return new Promise((resolve,reject)=>{
			let isopen = this.isOpen()
			if (isopen) {
				resolve(true)
				return
			}
			plus.sqlite.openDatabase({
				name:this.name,
				path:this.path,
				success: () => {
					this.onOpenDatabase()
					resolve(true)
				},
				fail: (e) => {
					console.log("open database fail ",JSON.stringify(e))
					resolve(false)
				}
			})
		})
	},
	isOpen() {
		return plus.sqlite.isOpenDatabase({name:this.name,path:this.path})
	},
	async onOpenDatabase() {
		console.log("on open database")
		var bc = await this.batch()
		bc.exec(table_create.createChat)
		bc.exec(table_create.createReadHistory)
		bc.exec(table_create.createChatUser)
		bc.exec(table_create.createChatUserList)
		bc.exec(table_create.createBlackList)
		bc.exec(table_create.createInterestTask)
		bc.exec(table_create.createUserState)
		await bc.commit()
	},
	transactionBegin() {
		return new Promise((resolve,reject)=>{
			plus.sqlite.transaction({
				name:this.name,
				operation:"begin",
				success: () => {
					resolve(true)
				},
				fail: (e) => {
					console.log("transaction fail ",JSON.stringify(e))
					resolve(false)
				}
			})
		})
	},
	transactionCommit() {
		return new Promise((resolve,reject)=>{
			plus.sqlite.transaction({
				name:this.name,
				operation:"commit",
				success: () => {
					resolve(true)
				},
				fail: (e) => {
					console.log("transaction commit fail ",JSON.stringify(e))
					resolve(false)
				}
			})
		})
	},
	exec(sql) {
		return new Promise((resolve,reject)=>{
			plus.sqlite.executeSql({
				name:this.name,
				sql:sql,
				success: () => {
					resolve(true)
				},
				fail: (e) => {
					console.log("exec sql fail ",JSON.stringify(e),sql)
					resolve(false)
				}
			})
		})
	},
	async batch() {
		var self = this
		var res = await this.transactionBegin()
		if (!res) {
			return
		}
		return {
			sql:[],
			exec(s) {
				this.sql.push(s)
			},
			async commit() {
				await self.exec(this.sql)
				let cr = await self.transactionCommit()
				if (!cr) {
					plus.sqlite.transaction({
						name:this.name,
						operation:"rollback",
						success: () => {
						},
						fail: (e) => {
							console.log("transaction rollback fail ",JSON.stringify(e))
						}
					})
				}
			}
		}
	},
	/**
	 * @param {string} tab
	 * @param {Object} where
	 * @param {Array} fields
	*/
	select(tab,where,fields) {
		let fs = fields.length == 0 ? "*" : fields.join(",")
		let ws = makeWhere(where)
		let sql = `SELECT ${fs} FROM ${tab}${ws};`
		return new Promise((resolve,reject)=>{
			plus.sqlite.selectSql({
				name:this.name,
				sql:sql,
				success: (e) => {
					resolve(e)
				},
				fail: () => {
					resolve()
				}
			})
		})
	},
	query(sql) {
		return new Promise((resolve,reject)=>{
			plus.sqlite.selectSql({
				name:this.name,
				sql:sql,
				success: (e) => {
					resolve(e)
				},
				fail: () => {
					resolve()
				}
			})
		})
	},
	insert(tab,obj) {
		let key = []
		let val = []
		for (let k in obj) {
			key.push(k)
			val.push(obj[k])
		}
		key = key.join(",")
		val = val.join(",")
		let sql = `INSERT INTO ${tab} (${key}) VALUES (${val})`
		return this.exec(sql)
	},
	update(tab,set,where) {
		let sv = makeKV(set)
		let wv = makeWhere(where)
		let sql = `UPDATE ${tab} SET ${sv}${wv};`
		return this.exec(sql)
	},
	delete(tab,where) {
		let wv = makeWhere(where)
		let sql = `DELETE FROM ${tab}${wv};`
		return this.exec(sql)
	}
	
	
	
}

export default util_db