var express = require('express');
var router = express.Router();

router.get('/help-center', function(req, res, next) {
    res.render('footer/help-center');
});

router.get('/safety', function(req, res, next) {
    res.render('footer/safety');
});

router.get('/cancellation', function(req, res, next) {
    res.render('footer/cancellation');
});

router.get('/report', function(req, res, next) {
    res.render('footer/report');
});

router.get('/hosting', function(req, res, next) {
    res.render('footer/hosting');
});

router.get('/host-protection', function(req, res, next) {
    res.render('footer/host-protection');
});

router.get('/host-resource', function(req, res, next) {
    res.render('footer/host-resource');
});

router.get('/community', function(req, res, next) {
    res.render('footer/community');
});

router.get('/carrer', function(req, res, next) {
    res.render('footer/carrer');
});

router.get('/newsroom', function(req, res, next) {
    res.render('footer/newsroom');
});

router.get('/investors', function(req, res, next) {
    res.render('footer/investors');
});

router.get('/privacy', function(req, res, next) {
    res.render('footer/privacy');
});

router.get('/terms', function(req, res, next) {
    res.render('footer/terms');
});

router.get('/sitemap', function(req, res, next) {
    res.render('footer/sitemap');
});

module.exports = router;
