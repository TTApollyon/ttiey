var express = require('express')
var app = express()
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var bodyParser = require('body-parser')

var fileDeal = require('./routes/fileDeal')
var log = require('./routes/log')
var upload = require('./routes/upload')

var users = require('./operation/users')


app.set('views', 'views/')
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

//配置session,passpord必要的中间件
app.use(session({
    secret: 'secret',//加密字符串
    resave: true,
    saveUninitialized: true
}));

// Passport init 身份验证模块passport初始化
app.use(passport.initialize());
app.use(passport.session());

//网站信息寄存器
app.use(flash());

app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user || null;
  next();
});

app.use('/fileDeal',fileDeal)
app.use('/users',users)
app.use('/log',log)
app.use('/upload',upload)

app.get('/',function(req,res,next){
	res.render('index','')
})

app.get('/new',function(req,res,next){
  res.render('new','')
})

// 捕获404并定向到错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var server = app.listen(3000,function(){
	var host = server.address().address
	var port = server.address().port

	console.log('Run in http;//%s:%s',host,port)
})

module.exports = app
