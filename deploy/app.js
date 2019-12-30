var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router/index')

app.listen(9001,function(){
    console.log('deploy server has been started');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(router)