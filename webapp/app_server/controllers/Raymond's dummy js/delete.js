var mysql = require('mysql');

/*--------Raymond's modification starts--------------*/

// attempt to connect to mysql server
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'cits3200',
	database: 'CITS3200_3'
});

function delete_user(user_id){
  connection.query('DELETE FROM User WHERE user_id = ?',[user_id],function(err,results){
		if(err) throw err;
		console.log('A user is deleted successfully!');
	});
}

function delete_question(q_id){
  connection.query('DELETE FROM Question WHERE q_id = ?',[q_id],function(err,results){
		if(err) throw err;
		console.log('A question is deleted successfully!');
	});
}

function delete_paper(paper_id){
  connection.query('DELETE FROM Question WHERE paper_id = ?',[paper_id],function(err,results){
		if(err) throw err;
		console.log('A paper is deleted successfully!');
	});
}

function change_status(paper_id){
  connection.query('UPDATE Paper SET status = "done" WHERE paper_id = ?',[paper_id],function(err,results){
		if(err) throw err;
		console.log("Paper's status get changed successfully!");
	});
}

function delete_temp_paper(paper_id){
  connection.query("DELETE FROM Temp_Paper WHERE paper_id=?",[paper_id],function(err,results){
		if(err) throw err;
		console.log("Paper's status get changed successfully!");
	});
}
