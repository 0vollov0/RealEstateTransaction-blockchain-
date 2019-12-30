var express = require('express')
var router = express.Router();
var deploy = require('./deploy/deploy')

//url routing
router.get('/',function(req,res){
    console.log('hello');
});

router.use('/deploy',deploy)

module.exports = router;