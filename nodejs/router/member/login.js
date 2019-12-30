var express = require('express')
var router = express.Router()
var mysql = require('mysql')
const crypto = require('crypto')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var connection = mysql.createConnection({
    host    :   'localhost',
    port    :   3306,
    user    :   'root',
    password:   'root',
    database:   'realestatetransaction'
});

connection.connect();

passport.serializeUser(function(user, done) {
    done(null, user.mb_id);
});

passport.deserializeUser(function(mb_id, done) {
    done(null, mb_id);
});

passport.use(new LocalStrategy({
    usernameField: 'mb_id',
    passwordField: 'mb_pw',
    passReqToCallback : true
    },
    function(req,mb_id, mb_pw, done) {
        mb_pw = crypto.createHash('sha512').update(mb_pw).digest('hex');
        var query = connection.query('select * from member where mb_id = ? and mb_pw = ?',[mb_id,mb_pw],function(err,rows){
            if(err) return done(err);

            if(rows.length) return done(null, {result: 0,'mb_id' : mb_id})
            else return done(null,false,{result: 1 ,'message':'일치하는 회원 정보가 없습니다.'})
        })
    }
));


router.get('/',function(req,res){
    var errMsg = req.flash('error')
    //if(errMsg) res.render('member/login.ejs',{'message' : errMsg});
    if(req.user !== undefined) res.redirect('main');
    res.render('member/login.ejs');
});

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) res.status(500).json(err);
        if (!user) return res.status(401).json(info.message);

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json(user);
        });
    })(req, res, next);
});

// router.post('/', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
//   function (req, res) {
//     res.redirect('/');
//   });

// function sessionCheck(req,res){
//     if(req.session.mb_id  != null && req.session.mb_id.length > 0) res.redirect('/');
// }

module.exports = router;