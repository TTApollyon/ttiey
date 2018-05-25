var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var dbConfig = require('../db/DBConfig')
var docSQL = require('../db/docsql')
var typeSQL = require('../db/typesql')
var messageSQL = require('../db/messagesql')


var pool = mysql.createPool(dbConfig.mysql)

var responseJSON = function(res,ret) {
  if(typeof ret === 'undefined') {
    res.json({code:'-200', msg:'操作失败'})
  }else{
    res.json(ret)
  }
}

var queryAllDoc = function(req,res,next){
  pool.getConnection(function(err,connection){
    connection.query(docSQL.queryAll,function(err,rows,result){
      connection.release()
      queryAllType(req,res,next,rows)
    })
  })
}

//查看该用户所有消息
var getUserMessage = function(req,res,next,docData,typeData){
  pool.getConnection(function(err,connection){
    connection.query(messageSQL.getMsgByUserid,[req.session.loginUserId],function(err,rows,result){
      connection.release()
      console.log(rows)
      res.render('operatorInferface/operator',{'userid':req.session.loginUserId,'docData':docData,'typeData':typeData,'messageData':rows})
    })
  })
}

var queryAllType = function(req,res,next,docrow){
	pool.getConnection(function(err,connection){
    connection.query(typeSQL.queryAll,function(err,rows,result){
      connection.release()
      getUserMessage(req,res,next,docrow,rows)
    })
  })
}

router.get('/download/upload/:docpath',function(req,res,next){
  var filepath = __dirname.substr(0,__dirname.length-7)+'\\upload\\'+req.params.docpath
  res.download(filepath)
})

router.get('/download',function(req,res,next){
  console.log(1)
})

router.get('/operatorInferface',function(req,res,next){
	queryAllDoc(req,res,next)
})

module.exports = router
