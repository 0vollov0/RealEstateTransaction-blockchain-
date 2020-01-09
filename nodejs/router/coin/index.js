var express = require('express')
var router = express.Router()
var mysql = require('mysql')

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

module.exports = router;