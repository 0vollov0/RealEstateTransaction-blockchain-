var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router/index')
var passport = require('passport')
//var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
//var cookieSession = require('cookie-session');
var flash = require('connect-flash')
var path = require('path')
const schedule = require('node-schedule')
const coin_update = require('./custom_modules/coin_update')
const miner = require('./custom_modules/miner')
const request = require('request');


app.listen(8080, function () {
    coin_update.crawling_coin_cost();
    console.log('localhost:8080 has been started');
});

// 매일 자정에 코인 정보 업데이트
var job_coin_updaate = schedule.scheduleJob('0 0 0 * * *', () => {
    coin_update.crawling_coin_cost();
})

//마이닝
setInterval(() => {
    var options = {
        url: "http://localhost:8546",
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "eth_pendingTransactions",
            "params": [],
            "id": 1
        })
    };

    request(options, (error, response, body) => {
        if (error) {
            return;
        } else {
            var result = JSON.parse(body).result;
            if (result.length > 0){
                miner.miner_start();
                setTimeout(() => {
                    miner.miner_stop();
                }, 2000);
            } 
        }
    });
}, 6000*5);

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(router)