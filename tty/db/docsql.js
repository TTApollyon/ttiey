var DocSQL = {
  insert:'INSERT INTO ttieydoc(docname,docpath,docSaveTime,userid,downloadNum) values(?,?,now(),?,0)',
  queryAll:'SELECT * FROM ttieydoc',
  getDocByTypeId:'SELCT * FROM ttieydoc WHERE typeid=?',
  getDocByName:'SELECT * FROM ttieydoc WHERE docname=? and userid=?',
  deleteDoc:'DELETE FROM ttieydoc WHERE docid=?',
  setDocType:'UPDATE ttieydoc SET typeid=? WHERE docname=?',
}

module.exports = DocSQL
