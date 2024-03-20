var table = {
	tabChat : "chat",
	tabReadhistory : "readHistory",
	tabChatUser : "chat_user",
	tabChatUserList : "chat_user_list",
	tabBlackList : "black_list",
	tabInterestTask : "interest_task",
	tabUserState : "user_state",
}

export var table_create = {
	createChat: `
	    CREATE TABLE IF NOT EXISTS ${table.tabChat} (
	      taskid TEXT,
	      "index" INTEGER,
	      cid INTEGER,
	      sendername TEXT,
	      sendericon TEXT,
	      send_time INTEGER,
	      content TEXT,
	      content_type INTEGER,
	      PRIMARY KEY (taskid, "index")
	    )
	`,
	createReadHistory: `
	    CREATE TABLE IF NOT EXISTS ${table.tabReadhistory} (
	      taskid TEXT PRIMARY KEY,
	      updateTime INTEGER,
	      task TEXT
	    )
	`,
	createChatUser:` 
	    CREATE TABLE IF NOT EXISTS ${table.tabChatUser} (
	      keycid INTEGER,
	      chatid INTEGER,
	      cid INTEGER,
	      issend INTEGER DEFAULT 0,
	      sendername TEXT,
	      sendericon TEXT,
	      send_time INTEGER,
	      content TEXT,
	      content_type INTEGER,
	      PRIMARY KEY (keycid, chatid)
	    )
	`,
	createChatUserList:`
	    CREATE TABLE IF NOT EXISTS ${table.tabChatUserList} (
	      keycid INTEGER,
	      cid INTEGER,
	      read_chat_id INTEGER DEFAULT 0,
	      chatid INTEGER,
	      sendername TEXT,
	      sendericon TEXT,
	      send_time INTEGER,
	      content TEXT,
	      content_type INTEGER,
	      PRIMARY KEY (keycid)
	    )
	`,
	createBlackList: `
	    CREATE TABLE IF NOT EXISTS ${table.tabBlackList} (
	      cid INTEGER,
	      PRIMARY KEY (cid)
	    )
	`,
	createInterestTask: `
	    CREATE TABLE IF NOT EXISTS ${table.tabInterestTask} (
	      taskid TEXT,
	      PRIMARY KEY (taskid)
	    )
	`,
	createUserState: `
	    CREATE TABLE IF NOT EXISTS ${table.tabUserState} (
	      id INTEGER,
	      value INTEGER,
	      PRIMARY KEY (id)
	    )
	`,
}

export default table