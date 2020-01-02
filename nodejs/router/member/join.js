var express = require('express')
var router = express.Router()
var mysql = require('mysql')
const crypto = require('crypto')
const request = require('request')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy



var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'realestatetransaction'
});

connection.connect();



// passport.use(new LocalStrategy({
//     usernameField: 'mb_id',
//     passwordField: 'mb_pw',
//     passReqToCallback : true
//     },
//     function(req,mb_id, mb_pw, done) {
//         mb_pw = crypto.createHash('sha512').update(mb_pw).digest('hex');

//         var query = connection.query('select * from member where mb_id = ? and mb_pw = ?',[mb_id,mb_pw],function(err,rows){
//             if(err) return done(err);

//             if(rows.length){
//                 return done(null, false, {result: 1,message : '현재 사용 중인 ID 입니다.'})
//             }else{
//                 var sql = {mb_id : mb_id, mb_pw : mb_pw};
//                 var query = connection.query('insert into member set ?', sql , function(err,rows){
//                     if(err) throw err;
//                     return done(null, {result: 0,'mb_idx' : rows.insertId});
//                 })
//             }
//         })
//     }
// ));

// router.post('/join',passport.authenticate('local-join', {
//     successRedirect: '/member/joinForm',
//     failureRedirect: '/member/loginForm',
//     failureFlash: true }
// ));

router.post('/', (req, res) => {
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


router.get('/', function (req, res) {
    var errMsg = req.flash('error')
    //if(errMsg) res.render('member/login.ejs',{'message' : errMsg});
    if (req.user !== undefined) res.redirect('main');
    res.render('member/join.ejs');
})

// router.get('/loginForm',function(req,res){
//     sessionCheck(req,res);

//     res.render('member/loginForm.ejs')
// })

// router.get('/logout',function(req,res){
//     req.session.destroy();
//     res.redirect('/');
// })


// router.post('/join',function(req,res){
//     sessionCheck(req,res);

//     var body = req.body;
//     var mb_id = body.mb_id;
//     var mb_pw = body.mb_pw;
//     var mb_email = body.mb_email;

//     mb_pw = crypto.createHash('sha512').update(mb_pw).digest('hex'); 

//     var query_params = {'mb_id' : mb_id,'mb_pw' : mb_pw,'mb_email' : mb_email}

//     var query = connection.query('INSERT INTO member SET ?', query_params, function (error, results, fields) {
//         var result;
//         if (error) result = { 'result' : 1 , 'message' : '회원가입 실패' , 'error' : error}
//         else result = { 'result' : 0 , 'message' : '회원가입 성공'}
//         res.json(result)
//     });
// })

// router.post('/login',function(req,res){
//     sessionCheck(req,res);

//     var body = req.body;
//     var mb_id = body.mb_id;
//     var mb_pw = body.mb_pw;

//     mb_pw = crypto.createHash('sha512').update(mb_pw).digest('hex'); 


//     var query = connection.query('SELECT * FROM member WHERE mb_id =? AND mb_pw = ?',[mb_id,mb_pw] , function (error, results, fields) {
//         var result;
//         if (error) result = { 'result' : 1 , 'message' : '로그인 실패' , 'error' : error}
//         if(results[0]){
//             if(req.session.mb_id === undefined) req.session.mb_id = mb_id;
//             result = { 'result' : 0 , 'message' : '로그인 성공'}
//         }else{
//             result = { 'result' : 2 , 'message' : '로그인 실패'}
//         } 

//         res.json(result)
//     });
// })

module.exports = router;
