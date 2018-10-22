const express = require('express');
var mysql =require('mysql');


/* Login */
module.exports.login = function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var i;
  var master=false;

  connection.query('select * from user',function(err,result,fields){
    if(err) throw err;
    for(i=0;i<result.length;i++){
      if(username==result[i].user_name){
        if(password==result[i].user_password){
          req.session.user=result[i].user_id;
          //vaild master
          if(result[i].user_id=='1'){
            req.session.master=true;
            master=true;
          }else{
            req.session.master=false;
          }
          console.log(req.session.master);
          //
          res.render('index',{ifmaster:master});
          return;
        }else{
          res.render('login',{warning:'Please check password.'});
        }
      }
    }
    res.render('login',{warning:'Please check username.'});
  });
};
