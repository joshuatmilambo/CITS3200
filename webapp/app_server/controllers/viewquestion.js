const express = require('express');
var mysql =require('mysql');

/* GET question page */
module.exports.viewquestion = function(req,res){
  var qid=req.query.q;
  var subtopic='Unknown';
  connection.query("select short_description, preview_path, key_words, update_date, note from question where q_id="+qid,function(err,result,fields){
    if(err) throw err;
    var name=result[0].short_description;
    var image=result[0].preview_path;
    var topic=result[0].key_words;
    var yearuploaded=result[0].update_date.getFullYear();
    var comment=result[0].note;
    res.render('viewquestion',{qName:name, qImage:image, qComment:comment, qTopic:topic,qSubtopic:subtopic, qYearuploaded:yearuploaded, qId:qid});
    });
}
