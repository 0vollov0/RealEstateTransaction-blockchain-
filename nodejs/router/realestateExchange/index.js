var express = require('express')
var router = express.Router()
var mysql = require('mysql')
const request = require('request')
var Web3 = require('web3');
var web3_ws = new Web3('ws://localhost:8545');
web3_ws.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
var web3_rpc = new Web3('http://localhost:8546');


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
        connection.query('select mb_account from member where mb_id = ?' ,[mb_id] , (err,rows) =>{
            if(err) res.redirect('/');
            if(rows[0].mb_account == null) res.redirect('/');
            res.render('realestateExchange/registration.ejs',{'mb_id' : mb_id,'mb_account' : rows[0].mb_account});  
        })
    }else{
        res.redirect('/');
    }
})

router.post('/registration',(req,res) => {
    var request_body = req.body;
    web3_rpc.eth.personal.unlockAccount(request_body.seller, request_body.account_password, 600).then(()=>{
        var options = {
            url: "http://localhost:8082/deploy/RealEstateTransaction",
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(request_body)
        };
    
        request(options, (error, response, body) => {
            if (error) {
                res.json(error);
                console.error('An error has occurred: ', error);
            } else {
                res.json(body);
                console.log('Post successful: response: ', body);
            }
        });
    })
})

module.exports = router;
