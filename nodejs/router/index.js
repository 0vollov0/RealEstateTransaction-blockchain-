var express = require('express')
var app = express()
var router = express.Router();
var path = require('path') //상대경로
var join = require('./member/join')
var login = require('./member/login')
var logout = require('./member/logout')
var coin = require('./coin/index')
var realestateExchange = require('./realestateExchange/index')
var web3 = require('./web3/index')

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
router.use('/coin', coin)
router.use('/realestateExchange',realestateExchange)
router.use('/web3',web3)

// router.use('/', express.static(__dirname + '/www')); // redirect root
router.use('/js', express.static(__dirname + '../../node_modules/bootstrap/dist/js')); // redirect bootstrap JS
router.use('/js', express.static(__dirname + '../../node_modules/jquery/dist')); // redirect JS jQuery
router.use('/js', express.static(__dirname + '../../js'));
router.use('/css', express.static(__dirname + '../../node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
router.use('/css', express.static(__dirname + '../../css'));
router.use('/img', express.static(__dirname + '../../img'));
router.use('/template', express.static(__dirname + '../../html/template'));
router.use('/template', express.static(__dirname + '../../views/template'));

module.exports = router;