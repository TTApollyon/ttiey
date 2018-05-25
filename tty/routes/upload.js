var fs = require('fs')
var express = require('express')
var multer = require('multer')
const path = require('path');
var router = express.Router()

var mysql = require('mysql')
var dbConfig = require('../db/DBConfig')
var docSQL = require('../db/docsql')
var typeSQL = require('../db/typesql')
var messageSQL = require('../db/messagesql')

var pool = mysql.createPool(dbConfig.mysql)
var upload = multer({dest:'upload/'});

var responseJSON = function(res,ret) {
  if(typeof ret === 'undefined') {
    res.json({code:'-200', msg:'操作失败'})
  }else{
    res.json(ret)
  }
}

//将文件信息录入数据库
var setDbDoc = function(file,res,req,mime){
      pool.getConnection(function(err,connection){
      connection.query(docSQL.insert,[file.originalname,file.path,req.session.loginUserId],function(err,result){
        connection.release()
        typeOption(file,req,mime)
        uploadMessage(req,res,file)
      })
   })
 }

//检查类型，并如果没有就新建一个种类，并对doc赋值
var typeOption = function(file,req,mime){
  pool.getConnection(function(err,connection){
    connection.query(typeSQL.getTypeByName,[mime],function(err,rows,result){
      connection.release()
      if(rows[0]!=undefined&&rows!=null){
        var typeid = rows[0].typeid
        docAddType(file,req,typeid)
      }else{
        addType(mime,req)
        typeOption(file,req,mime)
      }
    })
  })
}

//查询文件
var selectDoc = function(file,req,typeid){
  var docid = null;
  pool.getConnection(function(err,connection){
    connection.query(docSQL.getDocByName,[file.originalname,req.session.loginUserId],function(err,rows,result){
      connection.release()
      docid = rows[0].docid
      docAddType(file,req,typeid,docid)
    })
  })
}

//给doc添加属性
var docAddType = function(file,req,typeid,docid){
  pool.getConnection(function(err,connection){
    connection.query(docSQL.setDocType,[typeid,file.originalname],function(err,result){
      if(err){
            console.log('[UPDATE ERROR] '+ err.message)
     }else{
        console.log(`------------------------------------UPDATE-------------------`);
        console.log(`UPDATE SUCCESS `+ result.affectedRows);        //成功影响了x行  1
        console.log(`-------------------------------------------------------------`);
      }
      connection.release()
    })
  })
}

//添加新的类型
var addType = function(mime,req){
  console.log(mime)
  pool.getConnection(function(err,connection){
    connection.query(typeSQL.insert,[mime],function(err,result){
      connection.release()
    })
  })
}

//发送更新成功信息
var uploadMessage = function(req,res,file){
  pool.getConnection(function(err,connection){
    connection.query(messageSQL.insert,[req.session.loginUserId,'上传信息成功','上传'+file.originalname+'文件成功'],function(err,rows,result){
      connection.release()
      return res.redirect('/fileDeal/operatorInferface')
    })
  })
}

router.get('/delete/:docid',function(req,res,next){
  pool.getConnection(function(err,connection){
    connection.query(docSQL.deleteDoc,[req.params.docid],function(err,result){
      connection.release()
    })
  })
})

router.post('/uploadfile',upload.single('myfile'),function(req,res,next){
  var file=req.file;
  name=file.originalname;
  nameArray=name.split('');
  var nameMime=[];
  l=nameArray.pop();
  nameMime.unshift(l);
  while(nameArray.length!=0&&l!='.'){
    l=nameArray.pop();
    nameMime.unshift(l);
  }
  //Mime是文件的后缀
  Mime=nameMime.join('');
  console.log(Mime);
  //重命名文件 加上文件后缀
  console.log(file.path)
  console.log(file.filename)
  fs.renameSync('./upload/'+file.filename,'./upload/'+file.filename+Mime);

  setDbDoc(file,res,req,Mime)
})

module.exports = router
