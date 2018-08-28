/* GET home page */
module.exports.index = function(req,res){
  res.render('index',{});
};

/* GET home page */
module.exports.result = function(req,res){
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

/* GET question page */
module.exports.question = function(req,res){
  res.render('question',{});
}

/* GET history page */
module.exports.history = function(req,res){
  res.render('history',{});
}
