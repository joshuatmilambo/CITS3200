const express = require('express');
var mysql =require('mysql');


/* Login */
module.exports.login = function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var i;
  var master;
  master=false;
  req.session.master=false;
  var connection=mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'Aa18605323205',
    prot : '3306',
    database: 'cits3200'
    });
  connection.connect(function(err) {
  	if (err) throw err;
  	connection.query('select * from user',function(err,result,fields){
      if(err) throw err;
      for(i=0;i<result.length;i++){
        if(username==result[i].user_name){
          if(password==result[i].user_type){
            req.session.user=result[i].user_id;
            //console.log("userid is "+result[i].user_id);
            //test if master
            if(result[i].user_id=='2'){
              req.session.master=true;
              master=true;
              //console.log("ture test");
            }else{
              //console.log("false test");
              req.session.master=false;
              master=false;
            }
            console.log(req.session.master);
            res.render('index',{ifmaster:master});
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
