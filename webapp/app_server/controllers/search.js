var mysql = require('mysql');

/*--------Raymond's modification starts--------------*/
var key_words = words_searched;
var matched_q_id = [];
// attempt to connect to mysql server
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'cits3200',
	database: 'CITS3200'
});


connection.connect(function(err) {
	if (err) {
		console.error('Error connecting: ' + err.stack);
		return;
	}
	console.log('Connected as id ' + connection.threadId);
});

// Return a question ID by searching a key word
function search_a_word(key_word){
  key_word = "%".concat(key_word,"%");
	connection.query('SELECT q_id from Question WHERE key_words LIKE ?',[key_word],function(err,results){
		if(err) throw err;
		for (var i=0;i<results.length;i++){
			if(matched_q_id.includes(results[i]['q_id'])==false){
				matched_q_id.push(results[i]['q_id']);
			}
		}
	});
}

//Return a list of question ID by searching multiple
function search_words(key_words){
	var key_word_list = key_words.split(",");
	for (var i=0;i<key_word_list.length;i++){
		search_a_word();
	}
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






<<<<<<< HEAD
	//For every keyword
	for(var i = 0; i < keywords.length; i++) {
		keyword = "%".concat(keywords[i],"%");
		//Search through database asynchronously
		let searchQuery = await ctrlMain.queryPromise('SELECT q_id,short_description,update_date from Question WHERE key_words LIKE ?',[keyword]);

		//For array of returned qids, check if it's already in results -> if not add to results
		for (var j=0;j<searchQuery.length;j++){
			if(results.includes(searchQuery[j]['q_id'])==false){
				//Contruct array with required information
				temp = new Array(3);
				temp[0] = searchQuery[j]['q_id'];
				temp[1] = searchQuery[j]['short_description'];
				temp[2] = searchQuery[j]['update_date'].getFullYear();
				results.push(temp);
			}
		}
	}

	console.log(results);
	//Pass to results array to results rendere
	res.render('result', {results: results});
};
=======




















/*--------Raymond's modification ends--------------*/
>>>>>>> loginquestion
