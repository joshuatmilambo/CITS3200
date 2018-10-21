var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlUpload = require('../controllers/upload');
var ctrlSearch = require('../controllers/search');
var ctrlDownload = require('../controllers/download');
var ctrlLogin = require ('../controllers/login');
var ctrlViewquestion = require('../controllers/viewquestion');
var ctrlUphistory = require ('../controllers/uploadhistory');


router.get('/', ctrlMain.login);
router.get('/result', ctrlSearch.result);
router.get('/upload', ctrlMain.upload);
router.get('/test', ctrlMain.test);
router.get('/question', ctrlViewquestion.viewquestion);
router.get('/questionadded', ctrlMain.questionadded)
router.get('/history', ctrlMain.history);
router.get('/testhistory',ctrlMain.testhistory);
router.get('/index',ctrlMain.index);
router.get('/updateresults',ctrlMain.updateresults);
router.get('/delete',ctrlMain.delete);
router.get('/adduser',ctrlMain.adduser);
router.get('/uploadhistory',ctrlUphistory.uploadhistory);


/* POST File Upload */
router.post('/uploadfiles', ctrlUpload.upload);
router.post('/download', ctrlDownload.download);
router.post('/login',ctrlLogin.login);
router.post('/addnewuser',ctrlMain.addnewuser);
router.post('/updateresult',ctrlMain.update);
router.post('/insertHistory', ctrlUphistory.insertHistory);

module.exports = router;
