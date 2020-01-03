var express = require('express')
var router = express.Router()
var mysql = require('mysql')
//const crypto = require('crypto')

var connection = mysql.createConnection({
    host    :   'localhost',
    port    :   3306,
    user    :   'root',
    password:   'root',
    database:   'realestatetransaction'
});

connection.connect();

router.get('/registration',(req,res) => {
    var mb_id = req.user;
    if(mb_id !== undefined){
        res.render('realestateExchange/registration.ejs',{'mb_id' : mb_id});  
    }else{
        res.render('realestateExchange/registration.ejs',{'mb_id' : null});
    }
})

router.post('/registration',(req,res) => {
    
})

module.exports = router;
