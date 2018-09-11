var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

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

module.exports = router;
