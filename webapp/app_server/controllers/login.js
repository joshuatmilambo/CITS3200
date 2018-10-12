const express = require('express');
const bcrypt =require('bcrypt');
var mysql =require('mysql');


/* Login */
module.exports.login = function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var i;
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
          if(password==result[i].user_password){
            connection.end();
            req.session.user=username;
            res.render('index',{});
            return;
          }else{
            res.render('login',{warning:'Please check password.'});
          }
        }
      }
      res.render('login',{warning:'Please check username.'});
    });
  });
};
