var formidable = require('formidable');

var ctrlMain = require('../controllers/main');


module.exports.uploadhistory = async function(req,res){
  var formno = req.query.formno;
  var userPapers = [[]];
  var user_id = req.session.user;
  var qid = req.query.qid;
  let testQuery = await ctrlMain.queryPromise('SELECT paper_id, institution, unit, assessment, date FROM Paper WHERE user_id = ?',[user_id]);
  for (var i = 0; i < testQuery.length; i++) {
    userPapers.push([testQuery[i]['paper_id'],[testQuery[i]['institution'] +" "+ testQuery[i]['unit'] +" "+  testQuery[i]['assessment'] +" "+ testQuery[i]['date']]]);
  }
  res.render('uploadhistory',{formno: formno, papers: userPapers, qid: qid});

}

module.exports.insertHistory = async function(req,res) {
  var qid = req.query.qid
  var newpapers = 0;

  var form = new formidable.IncomingForm(),
      fields = [];

  form
    .on('field', function(field, value) {
      console.log(field, value);
      fields.push([field, value]);
    })

    .on('end', async function() {
      var data = []

      for(var i = 0; i < fields.length; i+=6) {
        var num = fields[i][0].split('.')[1] - 1;

        if(/^oldnew/.test(fields[i][0])) {
          if(fields[i][1] === 'newpaper') {
            newpapers++;
            data.push(new Array(4));
            for(var j = i; j < 6*(num+1); j++) {
              if(/^institution/.test(fields[j][0])) {
                data[num][0] = fields[j][1];
              }
              else if(/^unit/.test(fields[j][0])) {
                data[num][1] = fields[j][1];
              }
              else if(/^assessment/.test(fields[j][0])) {
                data[num][2] = fields[j][1];
              }
              else {
                data[num][3] = fields[j][1];
              }
            }
          } 

          else {
            for(var j = i; j < 6*(num+1); j++) {
              let paperid;
              if(/^selectold/.test(fields[j][0])) {
                paperid = fields[j][1];

                let insQHistory = await ctrlMain.queryPromise("INSERT INTO question_history (q_id, paper_id) VALUES (?,?)",
                [qid, paperid], function(err, result) {
                  if(err) throw err;
                });
              }
            }
          }
        }
      }

      console.log(data);

      console.log(newpapers);
      for(var i = 0; i < newpapers; i++) {
        let insertPaper = await ctrlMain.queryPromise("INSERT INTO paper (user_id, institution, unit, assessment, date) VALUES (?,?,?,?,?)",
        [req.session.user, data[i][0], data[i][1], data[i][2], data[i][3]], function(err, results) {
          if(err) throw err;
        });
        
        let insQHistory = await ctrlMain.queryPromise("INSERT INTO question_history (q_id, paper_id) VALUES (?,?)",
              [qid, insertPaper.insertId], function(err, results) {
                if(err) throw err;
        });
      }

      res.redirect('/index');
    })

  form.parse(req);
}
