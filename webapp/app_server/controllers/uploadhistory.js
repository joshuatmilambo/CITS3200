var formidable = require('formidable');
var readChunk = require('read-chunk');



module.exports.uploadhistory = async function(req,res){
  var formno = req.query.formno;
  var userPapers = ["Testing Paper Pls Show"];
  var user_id = req.session.user;
  let testQuery = await ctrlMain.queryPromise('SELECT institution, unit, assessment, date FROM Paper WHERE user_id = ?',[user_id]);
  for (var i = 0; i < testQuery.length; i++) {
    userPapers.push(testQuery[i]['institution'] +" "+ testQuery[i]['unit'] +" "+  testQuery[i]['assessment'] +" "+ testQuery[i]['date'] +" "+ testQuery[i]['proportion']);
  }
  res.render('uploadhistory',{formno: formno, papers: userPapers});
}