var express = require('express')
var app = express()
var router = express.Router();
var path = require('path')//상대경로

router.get('/',function(req,res){
    var user = req.user;
    if(!user) res.render('login.ejs');
    //res.sendFile(path.join(__dirname,'../../public/main.html'))
    res.render('main.ejs',{'mb_id' : user.mb_id});
});

module.exports = router;