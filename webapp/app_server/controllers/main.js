const express = require('express');
var mysql = require('mysql');


//add user
module.exports.adduser = function(req,res){
  res.render('adduser',{});
}

module.exports.addnewuser = function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var userexist=false;
  var connection=mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'Aa18605323205',
  prot : '3306',
  database: 'testdata'
  });
  connection.connect(function(err) {
  	if (err) throw err;
  	connection.query('select * from users',function(err,result,fields){
      if(err) throw err;
      for(i=0;i<result.length;i++){
        if(username==result[i].user_id){
          userexist=true;
        }
      }
      if(userexist){
        res.render('adduser',{warning:'User already exist'});
      }else{
        connection.query("insert into users (user_id,user_password) values ('"+username+"','"+password+"')",function(err,result,fields){
          if (err) throw err;
          res.render('adduser',{warning:'User sucessfully added'})
        });
      }
    });
  });
}

/* GET home page */
module.exports.result = function(req,res){
  //console.log(req.session.user);
  res.render('result',{});
}

/* GET upload page */
module.exports.upload = function(req,res){
  res.render('upload',{});
}


/* GET test page */
module.exports.test = function(req,res){
  res.render('test',{});
}

/* GET history page */
module.exports.history = function(req,res){
  res.render('history',{});
}

// Update result
module.exports.update = function(req,res){
  var n;
  var correct=req.body.correct;
  var total=req.body.total;
  var qid=req.body.qid;
  var pid=req.query.p;
  var connection=mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'Aa18605323205',
  prot : '3306',
  database: 'testdata'
  });
  connection.connect(function(err) {
    if (err) throw err;
    for (n=0; n<correct.length;n++){
      connection.query('insert into question_history (q_id,paper_id,correct,totol) values ("'+qid[n]+'","'+pid+'","'+correct[n]+'","'+total[n]+'")',function(err,result,fields){
        if(err) throw err;
      });
    }
  });
  res.render('index',{});
}

/* Get test history page */
module.exports.testhistory = function(req,res){
  var username=req.session.user;
  var testhistories;
  var connection=mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'Aa18605323205',
  prot : '3306',
  database: 'testdata'
  });
  var username=req.session.user
  connection.connect(function(err) {
    if (err) throw err;
    connection.query('select * from papertest where user_id="'+username+'"',function(err,result,fields){
      if(err) throw err;
      //console.log(result);
      res.render('testhistory',{testhis:result});
  });
});
}

module.exports.updateresult = function(req,res){
  var pid=req.query.p;
  var username=req.session.user;
  var connection=mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'Aa18605323205',
  prot : '3306',
  database: 'testdata'
  });
  connection.connect(function(err) {
    if (err) throw err;
    connection.query('select * from questions join papertest on questions.paper_id=papertest.paper_id where questions.paper_id="'+pid+'"',function(err,result,fields){
      if(err) throw err;
      res.render('updateresult',{questions:result,paper_id:pid});
      //console.log(result);
  });
});
}

module.exports.login = function(req,res){
  res.render('login',{});
}


module.exports.uploadhistory = function(req,res){
  res.render('uploadhistory',{});
}
