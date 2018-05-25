var express = require('express')
var router = express.Router()
var passport = require('passport')
// var User=require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

router.get('/sign',function(req,res,next){
	res.render('account/signin','')
})

router.get('/register',function(req,res,next){
	res.render('account/register','')
})

router.post('/sign',function(req,res,next){
	var username = req.body.username
	passport.authenticate('local',function(err,user,info){
		if(err){
			return next(err)
		}
		if(!user){
			req.flash('error_msg',info.message)
			return res.redirect('/sign')
		}
		req.logIn(user,function(err){
			if(err){
				return next(err)
			}
			req.flash('success_msg','登陆成功...')
			return res.redirect('/fileDeal/operatorInferface')
		})
	})(req,res,next)
})



passport.serializeUser(function(user,done){
	done(null,user.username);
});

passport.deserializeUser(function(username,done){
	User.findUserByreaderId(username,function(err,user){
		done(err,user);
	});
});
module.exports = router
