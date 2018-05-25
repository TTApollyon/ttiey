var MessageSQL = {
  insert:'INSERT INTO ttieymessage(userid,msgTitle,msgTime,msgCont) VALUES(?,?,now(),?)',
  queryAll:'SELECT * FROM ttieymessage',
  getMsgByUserid:'SELECT * FROM ttieymessage WHERE userid=?',
  deleteMsg:'DELETE FROM ttieymessage WHERE msgid=?',
}

module.exports = MessageSQL
