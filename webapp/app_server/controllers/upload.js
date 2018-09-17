var formidable = require('formidable');
var fs = require('fs');
var fileType = require('file-type');
var readChunk = require('read-chunk');
var mysql = require('mysql');

/*--------Raymond's modification starts--------------*/

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

//Get the last id from Question Table
var last_id =0;
function get_last_id(last_id){
	connection.query('SELECT MAX(q_id) FROM Question',function(err,results){
		if(err) throw err;
		last_id = results[0]['MAX(q_id)'];
	});
}


// insert questions
function insert_question(){
  var q_id = last_id+1;
  var name = file.name; // file's name
  var type = fileEXT.ext;
  var size = file.size;
  var zip_path = file.path;
  var preview_path = pdf.path;
  var note = note_text_post;
  var short_description = short_description_post;
  var key_words = key_words_post;

  var date = new Date();
  var update_date = date.toLocaleDateString();

  connection.query('INSERT INTO Question VALUES (?,?,?,?,?,?,?,?,?,?)',[q_id,name,type,size,zip_path,preview_path,note,short_description,key_words,update_date],function(err,results){
		if(err) throw err;
		console.log("Question inserted successfully");
	});
}

// update paper
function update_paper(){
  var user_id = user.getid(); //get user's id
  var institution = institution_post;
  var unit = unit_post;
  var assessment = assessment_post;
  var date = input_date;

  connection.query('INSERT INTO Paper (user_id,institution,unit,assessment,date) VALUES (?,?,?,?,?)',[user_id,institution,unit,assessment,date],function(err,results){
		if(err) throw err;
		console.log("Paper updated successfully");
	});
}

//update history
function update_history(){
	var q_id = selected_question_id;
	var paper_id = selected_paper_id;
	var correct = correct_number;
	var total_student = total_stu_number;

	connection.query('INSERT INTO Question_History (q_id,paper_id,correct,total_student) VALUES (?,?,?,?)',[q_id,paper_id,correct,total_student],function(err,results){
		if(err) throw err;
		console.log("Paper updated successfully");
	});
}

//update user
function insert_user(){
	var user_name = input_user_name;
	var user_type = input_user_type;

	connection.query('INSERT INTO User (user_name,user_type) VALUES (?,?)',[user_name,user_type],function(err,results){
		if(err) throw err;
		console.log("Paper updated successfully");
	});

}
/*--------Raymond's modification ends--------------*/



/* Upload Files */
module.exports.upload = function(req, res) {
    console.log('Qid: ' + qid);

    //Sets up dynamic upload directory based on Question ID
    var dir = __dirname + '/../files/' + qid;
    if(!fs.existsSync(dir))
        fs.mkdirSync(dir);

    //Initializes form and form variables
    var form = new formidable.IncomingForm(),
        files = [],
        fields = [];

    //Sets up upload directory and keeps form extensions
    form.uploadDir = dir;
    form.keepExtensions = true;

    form
        //All text fields stored in array with field name and value
        .on('field', function(field, value) {
            console.log(field, value);
            fields.push([field, value]);
        })
        .on('file', function(field, file) {
            console.log(field, file.name);

            //Read first 4100 bytes of file to determine file type
            var buffer = readChunk.sync(file.path, 0, 4100);
            var fileExt = fileType(buffer);

            //If filetype is allowed and corresponds to the input field --> rename and add file to array
            if((file !== null) && ((field === 'uploadzip' && fileExt.ext === 'zip') || (field === 'uploadpdf' && fileExt.ext === 'pdf'))) {
                fs.renameSync(file.path, form.uploadDir + '/' + file.name);
                files.push([field, file]);
            }
            //If not, delete file from filesystem
            else {
                console.log('Not correct file type');
                fs.unlinkSync(file.path);
            }
        })
        //If files uploaded correctly, redirect to next page, else report error and reload page
        .on('end', function() {
            if(files.length === 2) {
                console.log('Upload Complete');
                qid++;
                res.redirect('/uploadhistory');
            }
            else {
                console.log('Error Uploading - Not ENough Correct Files Given');
                res.redirect('/upload');
            }
        });

    //Handle form
    form.parse(req);
};

// connection.end();
// don't use the connection.end() can prevent the error when using callback function in mysql functions
