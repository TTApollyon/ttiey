var DocAddition = {
  insert:'INSERT INTO ttieydoc_addition(docid,docSize,updateTime,remark) values(?,?,now(),?)',
  getAdditionByDocid:'SELECT * FROM ttieydoc_addition WHERE docid=?',
  deleteDocAddition:'DELETE FROM ttieydoc_addition WHERE docid=?',
  updateRemark:'UPDATE ttieydoc_addition SET remark=? WHERE doc=?',
}
module.exports = DocAdditionSQL
