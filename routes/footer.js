var express = require('express');
var router = express.Router();
const {helpcenter,safety,cancellation,report,hosting,hostprotection,hostresource,community,carrer,newsroom,investors,privacy,terms,sitemap} = require("../controllers/footer");
router.get('/help-center', helpcenter);

router.get('/safety', safety);

router.get('/cancellation', cancellation);

router.get('/report', report);

router.get('/hosting', hosting);

router.get('/host-protection', hostprotection);

router.get('/host-resource', hostresource);

router.get('/community', community);

router.get('/carrer', carrer);

router.get('/newsroom', newsroom);

router.get('/investors', investors);

router.get('/privacy', privacy);

router.get('/terms', terms);

router.get('/sitemap', sitemap);

module.exports = router;
