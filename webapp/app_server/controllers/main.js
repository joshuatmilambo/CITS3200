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

/* GET history page */
module.exports.history = async function (req, res) {
    var test = [0,0,0,0];
    var results = [];
    let testQuery = await ctrlMain.queryPromise('SELECT institution, unit, assessment, date, correct / total_student AS proportion FROM question_history q JOIN paper p WHERE q.paper_id = p.paper_id AND q_id = 3');
    for (var i = 0; i < testQuery.length; i++) {
        results.push(testQuery[i]['institution'], testQuery[i]['unit'], testQuery[i]['assessment'], testQuery[i]['date'], testQuery[i]['proportion']);
    }
    console.log(results);
    res.render('history', {results:results});
}

/* Get test history page */
module.exports.testhistory = function(req,res){
  res.render('testhistory',{});
}

module.exports.updateresult = function(req,res){
  res.render('updateresult',{});
}

module.exports.login = function(req,res){
  res.render('login',{});
}


module.exports.uploadhistory = function(req,res){
  res.render('uploadhistory',{});
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