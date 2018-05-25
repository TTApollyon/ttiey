var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var dbConfig = require('../db/DBConfig')
var userSQL = require('../db/Usersql')

var pool = mysql.createPool(dbConfig.mysql)
var responseJSON = function(res,ret) {
  if(typeof ret === 'undefined') {
    res.json({code:'-200', msg:'操作失败'})
  }else{
    res.json(ret)
  }
}

router.post('/addUser',function(req,res,next){
  pool.getConnection(function(err,connection){
    connection.query(userSQL.insert,[req.body.username,req.body.password],function(err,result){
      if(result){
        result = {
          code:200,
          msg:'添加成功'
        }
      }

      responseJSON(res,result)

      connection.release()
    })
  })
  res.redirect('/')
})

router.post('/sign',function(req,res,next){
  pool.getConnection(function(err,connection){
    connection.query(userSQL.getUserByUsername,[req.body.username],function(err,rows,result){
      connection.release()
      if(rows!=null){
        if(req.body.password == rows[0].userpassword){
          console.log(rows[0])
          console.log('登陆成功')
          req.session.loginUserId = rows[0].userid
          return res.redirect('/fileDeal/operatorInferface')
        }
      }
      return res.redirect('/log/sign')
    })
  })
})

router.get('/SelectUser',function(req,res,next){
  pool.getConnection(function(err,connection){
    var param = req.query || req.params
    connection.query(userSQL.queryAll,function(err,rows,fields){
      if(err) throw err

      responseJSON(res,rows)

      connection.release()
    })
  })
})

router.get('/findUserByName',function(req,res,next){
  pool.getConnection(function(err,connection){
    var param = req.query || req.params
    connection.query(userSQL.getUserByUsername,[params.username],function(err,rows,resulet){
      if(result){
        result = {
          code:201,
          msg:'查询到'+rows[0]
        }
      }

      responseJSON(res,result)

      connection.release()
    })
  })
})

module.exports = router;
