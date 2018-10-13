const express = require('express');
var mysql =require('mysql');


/* Login */
module.exports.login = function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var i;
  connection.query('select * from user',function(err,result,fields){
    if(err) throw err;
    for(i=0;i<result.length;i++){
      if(username==result[i]['user_name']){
        if(password==result[i]['user_type']){
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
};
