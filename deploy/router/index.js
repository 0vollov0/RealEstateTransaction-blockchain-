var express = require('express')
var router = express.Router();
var deploy = require('./deploy/index')

//url routing
router.get('/',function(req,res){
    console.log('hello');
});

router.use('/deploy',deploy)

module.exports = router;

