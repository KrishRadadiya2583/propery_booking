var express = require('express');
var router = express.Router();
const {index} = require("../controllers/about")
router.get('/', index);



module.exports = router;