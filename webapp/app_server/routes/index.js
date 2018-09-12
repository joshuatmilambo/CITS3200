var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlUpload = require('../controllers/upload');

/* GET home page. */
router.get('/', ctrlMain.index);
router.get('/result', ctrlMain.result);
router.get('/upload', ctrlMain.upload);
router.get('/test', ctrlMain.test);
router.get('/question', ctrlMain.question);
router.get('/history', ctrlMain.history);
router.get('/testhistory',ctrlMain.testhistory);
router.get('/updateresult',ctrlMain.updateresult);
router.get('/uploadhistory',ctrlMain.uploadhistory);

/* POST File Upload */
router.post('/uploadfiles', ctrlUpload.upload);

module.exports = router;
