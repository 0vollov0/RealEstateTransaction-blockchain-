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

router.get('/balanceOf',(req,res)=>{
    var data = {};
    var mb_id = req.user;
    var coin_type = req.query.coin_type;
    if (mb_id !== undefined) {
        connection.query('select mb_account from member where mb_id = ?', [mb_id], (err, rows) => {
            if (err) res.json({'result': false});
            if (rows[0].mb_account == null) res.json({'result': false});
            data.mb_id = mb_id;
            data.mb_account = rows[0].mb_account;
            coin_contract.balanceOf(data.mb_account,coin_type).then((amount)=>{
                if (amount){
                    if (coin_type == '1') {
                        data.btc = amount;
                    }else if (coin_type == '2') {
                        data.eth = amount;
                    }
                    data.result = true;
                    res.json(data);
                }
            }).catch((error)=>{
                res.json({'result':false})
            })
        })
    }else res.json({'result':false})
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