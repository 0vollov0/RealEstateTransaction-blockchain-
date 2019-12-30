var express = require('express')
var app = express()
var router = express.Router();
var path = require('path') //상대경로
var join = require('./member/join')
var login = require('./member/login')
var logout = require('./member/logout')
var main = require('./main/main')
var email = require('./email/email')

var movies = require('./movie/index')

//url routing
router.get('/', function (req, res) {
    var mb_id = req.user;
    if(mb_id !== undefined){
        res.render('index.ejs',{'mb_id' : mb_id});  
    }else{
        res.render('index.ejs',{'mb_id' : null});
    } 
});

router.use('/join', join)
router.use('/login', login)
router.use('/logout', logout)
router.use('/main', main)
router.use('/email', email)
router.use('/movies', movies)

// router.use('/', express.static(__dirname + '/www')); // redirect root
router.use('/js', express.static(__dirname + '../../node_modules/bootstrap/dist/js')); // redirect bootstrap JS
router.use('/js', express.static(__dirname + '../../node_modules/jquery/dist')); // redirect JS jQuery
router.use('/js', express.static(__dirname + '../../js'));
router.use('/css', express.static(__dirname + '../../node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
router.use('/css', express.static(__dirname + '../../css'));
router.use('/img', express.static(__dirname + '../../img'));

module.exports = router;