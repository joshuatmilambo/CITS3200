var ctrlMain = require('../controllers/main');
const express = require('express');
var mysql = require('mysql');


//add user
module.exports.adduser = function(req,res){
  res.render('adduser',{});
};

module.exports.addnewuser = function(req,res){
  connection=mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'Aa18605323205',
  prot : '3306',
  database: 'cits3200'
  });

  var username=req.body.username;
  var password=req.body.password;
  var userexist=false;
  connection.connect(function(err) {
  	if (err) throw err;
  	connection.query('select * from user',function(err,result,fields){
      if(err) throw err;
      for(i=0;i<result.length;i++){
        if(username==result[i].user_name){
          userexist=true;
        }
      }
      if(userexist){
        res.render('adduser',{warning:'User already exist'});
      }else{
        connection.query("insert into user (user_name,user_type) values ('"+username+"','"+password+"')",function(err,result,fields){
          if (err) throw err;
          res.render('adduser',{warning:'User sucessfully added'})
        });
      }
    });
  });
};

/* delete question */
module.exports.delete = function(req,res){
  connection=mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'Aa18605323205',
  prot : '3306',
  database: 'cits3200'
  });

  var user=req.session.user;
  var qid=req.query.q;
  connection.connect(function(err) {
    if (err) throw err;
      connection.query('delete from Temp_Paper where user_id="'+user+'" and q_id="'+qid+'"',function(err,result,fields){
        if(err) throw err;
        connection.query('select * from Temp_Paper join question on Temp_Paper.q_id=question.q_id where user_id="'+user+'"',function(err,result,fields){
          if(err) throw err;
          console.log(result);
          res.render('test',{test:result});
        });
      });
  });
};


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
  var user=req.session.user;
    connection.connect(function(err) {
      if (err) throw err;
        connection.query('select * from Temp_Paper join question on Temp_Paper.q_id=question.q_id where user_id="'+user+'"',function(err,result,fields){
          if(err) throw err;
          console.log(result);
          res.render('test',{test:result});
      });
});
};

/* GET question page */
module.exports.question = function (req, res) {
    res.render('question', {});
}

module.exports.questionadded = async function (req, res) {
    connection=mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'Aa18605323205',
    prot : '3306',
    database: 'cits3200'
    });

    var qid = req.query.q;
    var uid = req.session.user;
    let testQuery = await ctrlMain.queryPromise('INSERT INTO Temp_Paper (q_id, user_id) VALUES ('+qid + ',' + uid +')');
    res.render('questionadded', {results:results});
}

/* GET history page */
module.exports.history = async function (req, res) {
    connection=mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'Aa18605323205',
    prot : '3306',
    database: 'cits3200'
  });


    var results = []//['UWA', 'Physics', 'test', '05/09/2016', '100','200','used copper' , 'UWA', 'Physics', 'test', '12/09/2015', '5','10','null'];
    let testQuery = await ctrlMain.queryPromise('SELECT institution, unit, assessment, date, correct, total_student, note FROM question_history q JOIN paper p WHERE q.paper_id = p.paper_id AND q_id = 3');
    for (var i = 0; i < testQuery.length; i++) {
        results.push(testQuery[i]['institution'], testQuery[i]['unit'], testQuery[i]['assessment'], testQuery[i]['date'], testQuery[i]['correct'], testQuery[i]['total_student'], testQuery[i]['note']);
    }
    var input = req.query.qid;
    console.log(results, input);
    res.render('history', {results:results});
}

/* Get test history page */
module.exports.testhistory = function(req,res){
    connection=mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'Aa18605323205',
    prot : '3306',
    database: 'cits3200'
    });

  var userid=req.session.user;
  console.log(userid);
  var testhistories;
  var username=req.session.user
  connection.connect(function(err) {
    if (err) throw err;
    connection.query('select * from paper where user_id="'+userid+'"',function(err,result,fields){
      if(err) throw err;
      //console.log(result);
      res.render('testhistory',{testhis:result});
  });
});
};


// get question of a paper
module.exports.updateresults = function(req,res){
  var pid=req.query.p;
  var username=req.session.user;
  connection=mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'Aa18605323205',
  prot : '3306',
  database: 'cits3200'
  });
  console.log(pid);
  console.log(username);
  connection.connect(function(err) {
    if (err) throw err;
    connection.query('select * from ((question_history join question on question_history.q_id=question.q_id) join paper on question_history.paper_id=paper.paper_id) where paper.paper_id="'+pid+'"',function(err,result,fields){
      //console.log(result);
      if(err) throw err;
      res.render('updateresult',{questions:result,paper_id:pid});
      //console.log(result);
  });
});
};


module.exports.updateresult = async function(req,res){
  connection=mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'Aa18605323205',
  prot : '3306',
  database: 'cits3200'
  });

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



// Update result
module.exports.update = function(req,res){
  var n;
  var correct=req.body.correct;
  var total=req.body.total;
  var qid=req.body.qid;
  console.log(qid);
  var pid=req.query.p;
  connection.connect(function(err) {
    if (err) throw err;
    for (n=0; n<correct.length;n++){
      console.log(qid[n]);
      connection.query('update question_history set correct="'+correct[n]+'",total_student="'+total[n]+'" where q_id="'+qid[n]+'"'),function(err,result,fields){
        if(err) throw err;
      };
    };
  });
  res.render('index',{});
};


/* FUNCTION USED TO ENFORCE QUERY TO EXECUTE ASYNCHRONOUSLY */
module.exports.queryPromise = function(str, params) {
  return new Promise((resolve, reject) => {
    connection.query(str, params, (err, result, fields) => {
      if (err) throw(err);
      resolve(result);
    })
  })
}
