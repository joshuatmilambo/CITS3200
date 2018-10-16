var ctrlMain = require('../controllers/main');


/* GET home page */
module.exports.index = function(req,res){
  res.render('index',{});
};

/* GET upload page */
module.exports.upload = function(req,res){
  res.render('upload',{});
}

/* GET test page */
module.exports.test = function(req,res){
  res.render('test',{});
}

/* GET question page */
module.exports.question = function (req, res) {
    res.render('question', {});
}

module.exports.questionadded = function (req, res) {
    var qid = req.query.qid;
    var pid = req.query.pid;
    var results = [];
    results.push(qid, pid);
    res.render('questionadded', {results:results});
}

/* GET history page */
module.exports.history = async function (req, res) {
    var results = ['uwa', 'unit', 'test', 'date', '100','200','used copper' , 'test1', 'test1', 'test1', 'test1', 'test1','smile', 'added line'];
    /*let testQuery = await ctrlMain.queryPromise('SELECT institution, unit, assessment, date, correct / total_student AS proportion FROM question_history q JOIN paper p WHERE q.paper_id = p.paper_id AND q_id = 3');
    for (var i = 0; i < testQuery.length; i++) {
        results.push(testQuery[i]['institution'], testQuery[i]['unit'], testQuery[i]['assessment'], testQuery[i]['date'], testQuery[i]['proportion']);
    }*/
    var input = req.query.qid;
    console.log(results, input);
    res.render('history', {results:results});
}

/* Get test history page */
module.exports.testhistory = function(req,res){
  res.render('testhistory',{});
}

module.exports.updateresult = async function(req,res){
  // let testQuery = await ctrlMain.queryPromise('SELECT short_description,preview_path FROM Question JOIN Question_History USING (q_id) WHERE paper_id = ?',[paper_id]);
  var results =[];
  let testQuery = await ctrlMain.queryPromise('SELECT short_description,preview_path FROM Question JOIN Question_History USING (q_id) WHERE paper_id = 1');
  for (var i = 0; i < testQuery.length; i++) {
    var single =[];
    single.push(testQuery[i]['short_description'],testQuery[i]['preview_path']);
    results.push(single);
  }
  console.log(results);
  res.render('updateresult',{results:results});
}

module.exports.login = function(req,res){
  res.render('login',{});
}


module.exports.uploadhistory = async function(req,res){
  var formno = req.query.formno;
  var userPapers = ["Testing Paper Pls Show"];
  var user_id = 1;
  let testQuery = await ctrlMain.queryPromise('SELECT institution, unit, assessment, date FROM Paper WHERE user_id = ?',[user_id]);
  for (var i = 0; i < testQuery.length; i++) {
    userPapers.push(testQuery[i]['institution'] +" "+ testQuery[i]['unit'] +" "+  testQuery[i]['assessment'] +" "+ testQuery[i]['date'] +" "+ testQuery[i]['proportion']);
  }
  res.render('uploadhistory',{formno: formno, papers: userPapers});
}


/* FUNCTION USED TO ENFORCE QUERY TO EXECUTE ASYNCHRONOUSLY */
module.exports.queryPromise = function(str, params) {
  return new Promise((resolve, reject) => {
    connection.query(str, params, (err, result, fields) => {
      if (err) throw(err);
      resolve(result);
    })
  })
}
