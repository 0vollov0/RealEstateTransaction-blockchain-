var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router/index')

app.listen(8082,function(){
    console.log('deploy server has been started port 8082');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(router)