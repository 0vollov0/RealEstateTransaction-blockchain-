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

router.get('/',function(req,res){
    var responseData = {};

    connection.query('select mv_title from movie', function(err,rows){
        if(err) throw err;
        if(rows.length > 0){
            responseData.result = 0;
            responseData.data = rows;
        }else{
            responseData.result = 1;
        }
        res.json(responseData);
    })
});

router.post('/',function(req,res){
    var mv_title = req.body.mv_title;
    var mv_type = req.body.mv_type;
    var mv_grade = req.body.mv_grade;
    var mv_actor = req.body.mv_actor;

    var sql_params = {'mv_title' : mv_title,'mv_type' : mv_type,'mv_grade' : mv_grade,'mv_actor' : mv_actor}
    console.log(sql_params)
    var query = connection.query('insert into movie set ?',sql_params , function(err,rows){
        if(err) throw err;
        
        res.json({'result':0});
    })
});

router.get('/:title',function(req,res){
    var mv_title = req.params.title;
    console.log(mv_title)
    var responseData = {};

    var query = connection.query('select * from movie where mv_title = ?',[mv_title], function(err,rows){
        if(err) throw err;
        if(rows[0]){
            responseData.result = 0;
            responseData.data = rows;
        }else{
            responseData.result = 1;
        }
        res.json(responseData);
    })
});

router.delete('/:title',function(req,res){
    var mv_title = req.params.title;
    
    var responseData = {};

    var query = connection.query('delete from movie where mv_title = ?',[mv_title], function(err,rows){
        if(err) throw err;
        if(rows.affectedRows > 0){
            responseData.result = 0;
            responseData.data = mv_title;
        }else{
            responseData.result = 1;
        }
        res.json(responseData);
    })
});


module.exports = router;
