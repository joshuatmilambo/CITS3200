var formidable = require('formidable');
var readChunk = require('read-chunk');



module.exports.uploadhistory = async function(req,res){
  var formno = req.query.formno;
<<<<<<< HEAD
//  var qid = req.query.qid;
=======
>>>>>>> f2979c536ac8dd4154d5cdc4ce71fe15b20fbb3f
  var userPapers = ["Testing Paper Pls Show"];
  var user_id = req.session.user;
  let testQuery = await ctrlMain.queryPromise('SELECT institution, unit, assessment, date FROM Paper WHERE user_id = ?',[user_id]);
  for (var i = 0; i < testQuery.length; i++) {
    userPapers.push(testQuery[i]['institution'] +" "+ testQuery[i]['unit'] +" "+  testQuery[i]['assessment'] +" "+ testQuery[i]['date'] +" "+ testQuery[i]['proportion']);
  }
  res.render('uploadhistory',{formno: formno, papers: userPapers});
<<<<<<< HEAD

}

module.exports.uploadhistorys = function(req,res){
  res.render('uploadhistory',{});
}
=======
}
>>>>>>> f2979c536ac8dd4154d5cdc4ce71fe15b20fbb3f
