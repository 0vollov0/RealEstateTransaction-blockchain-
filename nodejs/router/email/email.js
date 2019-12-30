var express = require('express')
var app = express()
var router = express.Router();
var path = require('path')//상대경로
var mysql = require('mysql')

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'root',
    database : 'jsman'
});

connection.connect();

//Router !!
router.post('/form',function(req,res){
    //get : req.param('email)
    console.log(req.body)
    res.render('email.ejs',{'email' : req.body.email})
});

router.post('/ajax',function(req,res){
    var email = req.body.email;
    var responseData = {};

    connection.query('select name from user where email ="' + email + '"', function(err,rows){
        if(err) throw err;
        if(rows[0]){
            responseData.result = "ok"
            responseData.name = rows[0].name;
        }else{
            responseData.result = "none";
            responseData.name = "";
        }
        res.json(responseData);
    })
});

module.exports = router;