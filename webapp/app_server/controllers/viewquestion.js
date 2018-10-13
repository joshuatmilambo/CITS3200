const express = require('express');
var mysql =require('mysql');

/* GET question page */
module.exports.viewquestion = function(req,res){
  var qid=req.query.qid;
  var subtopic='Unknown';

  connection.connect(function(err){
  	if (err) throw err;
  	connection.query("select qname, preview, key_words, update_date, note from questions where qid='"+qid+"'",function(err,result,fields){
      if(err) throw err;
      var name=result[0]['qname'];
      var image=result[0]['preview'];
      var topic=result[0]['key_words'];
      var yearuploaded=result[0]['update_date'];
      var comment=result[0]['note'];
      res.render('question',{qName:name, qImage:image, qComment:comment, qTopic:topic,qSubtopic:subtopic, qYearuploaded:yearuploaded, qId:qid});
      });
    });
}
