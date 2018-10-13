var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlUpload = require('../controllers/upload');
var ctrlLogin = require ('../controllers/login');
var ctrlSearch = require ('../controllers/search');

var ctrlViewQuestion = require ('../controllers/viewquestion');

// function to check whether a user is logged in before loading webpage
function loggedIn (req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

/* GET home page. */
router.get('/', loggedIn, ctrlMain.index);
router.get('/login', ctrlMain.login)
router.get('/result', loggedIn, ctrlSearch.result);
router.get('/upload', loggedIn, ctrlMain.upload);
router.get('/test', loggedIn, ctrlMain.test);
router.get('/question', loggedIn, ctrlViewQuestion.viewquestion);
router.get('/history', loggedIn, ctrlMain.history);
router.get('/testhistory', loggedIn, ctrlMain.testhistory);
router.get('/updateresult', loggedIn, ctrlMain.updateresult);
router.get('/uploadhistory', loggedIn, ctrlMain.uploadhistory);

/* POST File Upload */
router.post('/uploadfiles', ctrlUpload.upload);

/*POST Login Check */
router.post('/login',ctrlLogin.login);

module.exports = router;
