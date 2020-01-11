var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var coin_contract = require('../../custom_modules/coin_contract')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'realestatetransaction'
});

connection.connect();

router.get('/info', (req, res) => {
    var info = new Array();

    connection.query('select * from coin', (err, rows) => {
        rows.forEach(element => {
            info.push({
                'coin_name': element.coin_name,
                'coin_symbol': element.coin_symbol,
                'coin_today_value': element.coin_today_value,
                'coin_yesterday_value': element.coin_yesterday_value
            })
        });
        res.json(info)
    })
})

router.post('/charge', (req,res) =>{
    var recipient = req.body.recipient;
    var amount = Number(req.body.amount);
    var coin_type = req.body.coin_type;

    coin_contract.transfer(recipient,amount,coin_type).then((result)=>{
        if (result) res.json({'result': true,'coin_type' : coin_type})
    }).catch((error) => {
        console.log(error);
        res.redirect('/');
    })
})

module.exports = router;