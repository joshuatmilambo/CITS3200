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
    var test = 0;
    var results = [];
    let testQuery = await ctrlMain.queryPromise('SELECT q_id FROM question_history WHERE q_id = 1');
    results.push(testQuery[0]['q_id']);
    console.log(results);
    res.render('history', {test: test });
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