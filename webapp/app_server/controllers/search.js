var mysql = require('mysql');
var formidable = require('formidable');
var ctrlMain = require('../controllers/main');

/*--------Raymond's modification starts--------------*/

//Return question information in search result webpage
function search_results(matched_q_id){
	var results=[];
	for (var i=0;i<matched_q_id.length;i++){
		var single_result = [];
		connection.query('SELECT short_description,update_date,preview_path FROM Question WHERE q_id=?',[matched_q_id[i]],function(err,results){
			if(err) throw err;
			single_result.push(results[0]['short_description'],results[0]['update_date'],results[0]['preview_path']);
		});
	  results.push(single_result);
	}
	return (results);
}

//Return question history
function single_question_history(q_id){
	var result =[];
	connection.query('SELECT institution,unit,assessment,date,correct/total_student AS proportion FROM Question_History JOIN Paper USING paper_id WHERE q_id=?',[q_id],function(err,results){
		if(err) throw err;
		single_result.push(results[0]['institution'],results[0]['unit'],results[0]['assessment'],results[0]['date'],results[0]['proportion']);
	});
	return (result);
}

//Return multiple questions history
function questions_history(){
	var history_results =[];
	for (var i=0; i<matched_q_id.length;i++){
		history_results.push(single_question_history(matched_q_id[i]));
	}
	return (history_results);
}

/*--------Raymond's modification ends--------------*/


/*----------------CONTROLLERS----------------*/

module.exports.result = async function(req, res) {
	//Perform string processing to generate list of keywords
	var input = req.query.keywords.replace(/\s/g, '');
	var keywords = input.split(',');

	var results = [];

	//For every keyword
	for(var i = 0; i < keywords.length; i++) {
		keyword = "%".concat(keywords[i],"%");
		//Search through database asynchronously
		let searchQuery = await ctrlMain.queryPromise('SELECT q_id from Question WHERE key_words LIKE ?',[keyword]);

		//For array of returned qids, check if it's already in results -> if not add to reulst
		for (var j=0;j<searchQuery.length;j++){
			if(results.includes(searchQuery[j]['q_id'])==false){
				results.push(searchQuery[j]['q_id']);
			}
		}
	}

	console.log(results);
	res.render('result', {});
};
