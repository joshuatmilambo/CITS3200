var formidable = require('formidable');
var fs = require('fs');
var fileType = require('file-type');
var readChunk = require('read-chunk');
var JSZip = require("jszip");

/*--------Raymond's modification starts--------------*/

// insert questions
function insert_question(q_id, name, type, size, zip_path, preview_path, note, short_description, key_words, video_link){

  var date = new Date().toLocaleDateString();

  connection.query('INSERT INTO Question VALUES (?,?,?,?,?,?,?,?,?,?,?)',[q_id,name,size,type,zip_path,preview_path,note,short_description,key_words,date,video_link],function(err,results){
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
    //Get latest QID from server
    connection.query('SELECT MAX(q_id) FROM Question', function(err, results) {
        if(err) throw err;
        var qid = results[0]['MAX(q_id)'];
        
        if(qid === null) {
            qid = 1;
        } else {
            qid++
        }

        console.log('Qid: ' + qid);

        //Sets up dynamic upload directory based on Question ID
        var dir = __dirname + '\\files\\' + qid;
        console.log(dir);
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            fs.mkdirSync(dir + "\\..\\..\\..\\..\\public\\files_previews\\" + qid);
        }
        else {
            console.log('Directory for qid %d already exsits', qid);
        }

        //Initializes form and form variables
        var form = new formidable.IncomingForm(),
            files = new Array(2),
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
                if((file !== null) && (field === 'uploadzip' && fileExt.ext === 'zip')) {
                    fs.renameSync(file.path, form.uploadDir + '/' + file.name);
                    files[0] = file;
                }
                else if((file !== null) && (field === 'uploadpdf' && fileExt.ext === 'png')) {
                    fs.renameSync(file.path, form.uploadDir + '\\..\\..\\..\\..\\public\\files_previews\\' + qid + '\\' + file.name);
                    files[1] = file;
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
                    var notes, description, keywords, type, video_link; 
                    for(var i = 0; i < fields.length; i++) {
                        if(fields[i][0] === 'notes') {
                            notes = i;
                        }
                        else if(fields[i][0] === 'description') {
                            description = i;
                        }
                        else if(fields[i][0] === 'keywords') {
                            keywords = i;
                        }
                        else if(fields[i][0] == 'video') {
                            video_link = i;
                        }
                        else {
                            type = i;
                        }
                    };

                    //READS UPLOADED ZIP FILE USING JSZIP
                    fs.readFile(form.uploadDir + '/' + files[0].name, function(err, data) {
                        if (err) throw err;

                        var read = new JSZip();
                        //LOAD DATA INTO JSZIP
                        read.loadAsync(data)
                        //AFTER, GET CONTENTS OF DATA
                        .then(function(contents) {
                            //FOR EVERY FILE IN THE ZIP
                            Object.keys(contents.files).forEach(function(filename){
                                //CHECK IF FILE NAME BEGINS WITH "figs/" --> MAKE DIRECTORY figs IF IT DOESN'T EXIST
                                var folder = filename.split('/');
                                if(/^fig/.test(folder[0]) && !fs.existsSync(dir + '/' + folder[0])) {
                                    fs.mkdirSync(dir + '/' + folder[0]);
                                }
                                //PUT FILE INTO BUFFER...
                                read.file(filename).async('nodebuffer')
                                .then(function(content){
                                    //WRITE FILE TO DIRECTORY   
                                    var dest = dir + '/' + filename;
                                    fs.writeFileSync(dest, content) 
                                });
                            });
                        });
                        //DELETE OLD ZIP FILE
                        fs.unlinkSync(form.uploadDir + '/' + files[0].name);
                    });

                    insert_question(qid, (files[0].name).split(".")[0], fields[type][1], files[0].size, dir, 'files_previews\\' + qid + '\\'  + files[1].name,
                        fields[notes][1], fields[description][1], fields[keywords][1], fields[video_link][1]);
                    res.redirect('/uploadhistory?formno=1&qid='+qid);
                }
                else {
                    console.log('Error Uploading - Not Enough Correct Files Given');
                    res.redirect('/upload');
                }
            });

        //Handle form
        form.parse(req);
    });
};
