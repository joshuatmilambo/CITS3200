var mysql = require('mysql');

/*------------Raymond's dummy part begins---------------*/
var zip_file_path;
var preview_file_path;




// attempt to connect to mysql server
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'cits3200'
});

connection.connect(function(err) {
	if (err) {
		console.error('Error connecting: ' + err.stack);
		return;
	}
	console.log('Connected as id ' + connection.threadId);
});
