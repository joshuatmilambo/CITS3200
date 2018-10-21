var ctrlMain = require('../controllers/main');
var formidable = require('formidable');
const express = require('express');
var mysql = require('mysql');

//index page
module.exports.login = function(req,res){
  res.render('login');
};

//add user
module.exports.adduser = function(req,res){
  res.render('adduser',{});
};

module.exports.addnewuser = function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var userexist=false;
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
};

/* delete question */
module.exports.delete = function(req,res){
  var user=req.session.user;
  var qid=req.query.q;
    connection.query('delete from Temp_Paper where user_id="'+user+'" and q_id="'+qid+'"',function(err,result,fields){
      if(err) throw err;
      connection.query('select * from Temp_Paper join question on Temp_Paper.q_id=question.q_id where user_id="'+user+'"',function(err,result,fields){
        if(err) throw err;
        console.log(result);
        res.render('test',{test:result});
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
  connection.query('select * from Temp_Paper join question on Temp_Paper.q_id=question.q_id where user_id="'+user+'"',function(err,result,fields){
    if(err) throw err;
    console.log(result);
    res.render('test',{test:result});
  });
};

module.exports.questionadded = async function (req, res) {
    var qid = req.query.q;
    var uid = req.session.user;
    let testQuery = await ctrlMain.queryPromise('INSERT INTO Temp_Paper (q_id, user_id) VALUES ('+qid + ',' + uid +')');
    res.redirect('/index');
}

/* GET history page */
module.exports.history = async function (req, res) {
  var qid = req.query.q;
  var results = []//['UWA', 'Physics', 'test', '05/09/2016', '100','200','used copper' , 'UWA', 'Physics', 'test', '12/09/2015', '5','10','null'];
  let testQuery = await ctrlMain.queryPromise('SELECT institution, unit, assessment, date, correct, total_student, note FROM question_history q JOIN paper p WHERE q.paper_id = p.paper_id AND q_id = ' + qid);
  for (var i = 0; i < testQuery.length; i++) {
      results.push(testQuery[i]['institution'], testQuery[i]['unit'], testQuery[i]['assessment'], testQuery[i]['date'], testQuery[i]['correct'], testQuery[i]['total_student'], testQuery[i]['note']);
  }
  res.render('history', {results:results});
}

/* Get test history page */
module.exports.testhistory = function(req,res){
  var userid=req.session.user;
  console.log(userid);
  var testhistories;
  var username=req.session.user
  connection.query('select * from paper where user_id="'+userid+'"',function(err,result,fields){
    if(err) throw err;
    //console.log(result);
    res.render('testhistory',{testhis:result});
});
};


// get question of a paper
module.exports.updateresults = function(req,res){
  var pid=req.query.p;
  var username=req.session.user;
  console.log(pid);
  console.log(username);
  connection.query('select * from ((question_history join question on question_history.q_id=question.q_id) join paper on question_history.paper_id=paper.paper_id) where paper.paper_id="'+pid+'"',function(err,result,fields){
    //console.log(result);
    if(err) throw err;
    res.render('updateresult',{questions:result,pid:pid});
    //console.log(result);
  });
};


// Update result
module.exports.update = function(req,res){
  var form = new formidable.IncomingForm(),
      fields = [];

  form
    .on('field', function(field, value) {
      console.log(field, value)
      fields.push([field, value]);
    })

    .on('end', async function() {
      var data = [];

      for(var i = 0; i < fields.length; i++) {
        if(i%3 == 0) data.push(new Array(3));

        var num = fields[i][0].split('.')[1]

        if(/^correct/.test(fields[i][0])) {
          data[num][0] = fields[i][1];
        }
        else if(/^total/.test(fields[i][0])) {
          data[num][1] = fields[i][1];
        }
        else if(/^qid/.test(fields[i][0])) {
          data[num][2] = fields[i][1];
        }
        else {
          data[num][3] = fields[i][1];
        }
      }

      var pid=req.query.p;
      console.log(data.length);

      for(var n=0; n<data.length;n++){

        console.log(data[n][2]);
        console.log(data[n][0]);
        console.log(data[n][1]);

        await ctrlMain.queryPromise('update question_history set correct="'+data[n][0]+'",total_student="'+data[n][1]+'", note="'+data[n][3]+'" where q_id="'+data[n][2]+'"'+' AND paper_id=' +pid),function(err,result,fields){
          if(err) throw err;
        };
      };
    })

  form.parse(req);

  res.redirect('/index');
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
