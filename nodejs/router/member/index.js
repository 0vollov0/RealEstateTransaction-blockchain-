var express = require('express')
var router = express.Router()
var mysql = require('mysql')
const crypto = require('crypto')
const request = require('request')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
const coin_contract = require('../../custom_modules/coin_contract')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'realestatetransaction'
});

connection.connect();

router.post('/join', (req, res) => {
    var body = req.body;
    var mb_id = body.mb_id;
    var mb_pw = body.mb_pw;
    var mb_account = body.mb_account;

    mb_pw = crypto.createHash('sha512').update(mb_pw).digest('hex');

    var query_params = {
        'mb_id': mb_id,
        'mb_pw': mb_pw
    }

    var query = connection.query('INSERT INTO member SET ?', query_params, function (error, results, fields) {
        var result;
        if (error) {
            result = {
                'result': 1,
                'message': '회원가입 실패',
                'error': error
            }
        } else {
            request.post('http://localhost:8080/web3/personal_newAccount', {
                json: {
                    'params': mb_account
                }
              }, (error, res, body) => {
                if (error) {
                    console.error(error)
                    return
                }
                body = JSON.parse(body);
                connection.query('update member set mb_account = ? where mb_idx = ?',[body.result,results.insertId],(error,results,fileds) => {
                    if(error) console.log(error)
                    else console.log('계정 생성 완료')
                })
            })
            result = {
                'result': 0,
                'message': '회원가입 성공'
            }
        }
        res.json(result)
    });

})


router.get('/join', function (req, res) {
    var errMsg = req.flash('error')
    //if(errMsg) res.render('member/login.ejs',{'message' : errMsg});
    if (req.user !== undefined) res.redirect('main');
    res.render('member/join.ejs');
})

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


router.get('/login',function(req,res){
    var errMsg = req.flash('error')
    //if(errMsg) res.render('member/login.ejs',{'message' : errMsg});
    if(req.user !== undefined) res.redirect('main');
    res.render('member/login.ejs');
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) res.status(500).json(err);
        if (!user) return res.status(401).json(info.message);

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json(user);
        });
    })(req, res, next);
});

router.get('/logout',function(req,res){
    req.logOut();
    res.redirect('/');
});

router.get('/info',function(req,res){
    var data = {}
    var mb_id = req.user;
    if (mb_id !== undefined) {
        connection.query('select mb_account from member where mb_id = ?', [mb_id], (err, rows) => {
            if (err) res.redirect('/');
            if (rows[0].mb_account == null) res.redirect('/');
            data.mb_id = mb_id;
            data.mb_account = rows[0].mb_account;
            coin_contract.balanceOf(rows[0].mb_account,'1').then((amount)=>{
                data.btc = amount;
                coin_contract.balanceOf(rows[0].mb_account,'2').then((amount)=>{
                    data.eth = amount;
                    res.render('member/info.ejs',data);
                }).catch(console.log);
            }).catch(console.log);
        })
    } else {
        res.redirect('/');
    }
});


module.exports = router;