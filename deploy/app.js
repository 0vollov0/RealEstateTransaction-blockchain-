var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router/index')
const schedule = require('node-schedule')
const coin_update = require('./custom_modules/coin_update')

app.listen(8082,function(){
    console.log('deploy server has been started port 8082');
});

// 매일 자정에 코인 정보 업데이트
var job_coin_updaate = schedule.scheduleJob('0 0 0 * * *',() => {
    coin_update.crawling_coin_cost();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(router)
