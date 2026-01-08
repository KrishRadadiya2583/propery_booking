var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    try{
    res.render('about');
    }
    catch(err){
        res.send("something went wrong")
    }
});



module.exports = router;