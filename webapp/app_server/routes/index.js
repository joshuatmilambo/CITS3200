var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlUpload = require('../controllers/upload');
var ctrlSearch = require('../controllers/search');

/* GET home page. */
router.get('/', ctrlMain.login);
router.get('/result', ctrlSearch.result);
router.get('/upload', ctrlMain.upload);
router.get('/test', ctrlMain.test);
router.get('/question', ctrlMain.question);
router.get('/questionadded', ctrlMain.questionadded)
router.get('/history', ctrlMain.history);
router.get('/testhistory',ctrlMain.testhistory);
router.get('/updateresult',ctrlMain.updateresult);
router.get('/index',ctrlMain.index);
router.get('/uploadhistory',ctrlMain.uploadhistory);

/* POST File Upload */
router.post('/uploadfiles', ctrlUpload.upload);

module.exports = router;
