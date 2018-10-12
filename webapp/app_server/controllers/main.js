const express = require('express');


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
