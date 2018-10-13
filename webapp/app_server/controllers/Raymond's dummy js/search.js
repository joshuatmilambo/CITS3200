var mysql = require('mysql');

/*--------Raymond's modification starts--------------*/
var key_words = words_searched;
var matched_q_id = [];
// attempt to connect to mysql server
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'cits3200',
	database: 'CITS3200_3'
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

//Return question information in search result webpage
function search_results(matched_q_id){
	var results=[];
	for (var i=0;i<matched_q_id.length;i++){
		var single_result = [];
		connection.query('SELECT short_description,update_date,preview_path,video_link FROM Question WHERE q_id=?',[matched_q_id[i]],function(err,results){
			if(err) throw err;
			single_result.push(results[0]['short_description'],results[0]['update_date'],results[0]['preview_path'],results[0]['video_link']);
		});
	  results.push(single_result);
	}
	return (results);
}

//Return question history
function single_question_history(q_id){
	var result =[];
	connection.query('SELECT institution,unit,assessment,date,correct,total_student,note FROM Question_History JOIN Paper USING paper_id WHERE q_id=?',[q_id],function(err,results){
		if(err) throw err;
		single_result.push(results[0]['institution'],results[0]['unit'],results[0]['assessment'],results[0]['date'],results[0]['correct'],results[0]['total_student'],results[0]['note']);
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

//Get paper status
function get_status(paper_id){
	var result_status = "";
	connection.query('SELECT status FROM Paper WHERE paper_id=?',[paper_id],function(err,results){
		if(err) throw err;
		result_status = results[0]['status'];
	});
	return (result_status);
}

//Get past papers
function get_past_papers(){
	connection.query('SELECT institution,unit,assessment,date FROM Paper WHERE status = "done"',function(err,results){
		if(err) throw err;
		var past_papers = [];
		for (var i=0;i<results.length;i++){
			var string = "";
			string = results[i]['institution']+"|"+results[i]['unit']+"|"+results[i]['assessment']+"|"+results[i]['date'];
			past_papers.push(string);
		}
		return (past_papers); // "foo()" starts here!
	});
}


























/*--------Raymond's modification ends--------------*/
