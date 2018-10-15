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
  console.log(req.session.user);
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
