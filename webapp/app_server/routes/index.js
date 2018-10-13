var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlUpload = require('../controllers/upload');
var ctrlLogin = require ('../controllers/login');
var ctrlViewQuestion = require ('../controllers/viewquestion');

/* GET home page. */
router.get('/', ctrlMain.login);
router.post('/login',ctrlLogin.login);
router.get('/result', ctrlMain.result);
router.get('/upload', ctrlMain.upload);
router.get('/test', ctrlMain.test);
router.get('/question', ctrlViewQuestion.viewquestion);
router.get('/history', ctrlMain.history);
router.get('/testhistory',ctrlMain.testhistory);
router.get('/updateresult',ctrlMain.updateresult);
router.get('/uploadhistory',ctrlMain.uploadhistory);

/* POST File Upload */
router.post('/uploadfiles', ctrlUpload.upload);

module.exports = router;
