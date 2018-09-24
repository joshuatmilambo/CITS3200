var mysql = require('mysql');

/*------------Raymond's dummy part begins---------------*/
var zip_file_path;
var preview_file_path;




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

//Get all question ids
function get_all_q_ids(paper_id){
	var all_q_ids =[];
	connection.query('SELECT q_id FROM Temp_Paper WHERE paper_id = ?',[paper_id],function(err,results){
		if(err) throw err;
		for (var i=0;i<results.length;i++){
			all_q_ids.push(results[i]['q_id']);
		}
	});
	return (all_q_ids);
}

//Get zip file path
function get_zip_path(q_id){
	var zip_path ="";
	connection.query('SELECT zip_path FROM Question WHERE q_id = ?',[q_id],function(err,results){
		if(err) throw err;
		zip_path = results[0]['zip_path'];
	});
	return (zip_path);
}

//Get preview path
function get_preview_path(q_id){
	var preview_path ="";
	connection.query('SELECT zip_path FROM Question WHERE q_id = ?',[q_id],function(err,results){
		if(err) throw err;
		zip_path = results[0]['zip_path'];
	});
	return (zip_path);
}

//Clear Temp Paper Table
function clean_temp_paper(paper_id){
	connection.query('DELETE FROM Temp_Paper WHERE paper_id = ?',[paper_id],function(err,results){
		if(err) throw err;
		console.log("Associated records in Temp_Paper table are cleaned");
	});
}
