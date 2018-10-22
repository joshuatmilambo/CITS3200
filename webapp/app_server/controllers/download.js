var ctrlMain = require('../controllers/main');
var JSZip = require('jszip');
var fs = require('fs');
var formidable = require('formidable');
var image_data = [];
var filecontents = '';

//reads the current file being looked at to the file contetnts string
function stringBuilder(filename) {
	console.log(filename);
	var buff = fs.readFileSync(filename);
	var enc = new Buffer(buff).toString("utf8");
	filecontents += enc + '\n\n';
	console.log(filecontents);
};

function imageBuilder(imagePath) {
	if(fs.existsSync(imagePath + '\\figs')) {
		var imageNames = fs.readdirSync(imagePath + '\\figs');
		for(var i = 0; i < imageNames.length; i++) {
			var buff = fs.readFileSync(imagePath + '\\figs\\' + imageNames[i]);
			image_data.push(new Buffer(buff).toString("base64"));
		}
	}
};

/*
creates the zip to be downloaded
	-adds the string created in stringBuilder
	-adds the image files one by one naming them sequentially
	*all images etc are place holder names and will have to be updated when added in the final program
*/
module.exports.download = async function(req, res) {

	res.set('Content-disposition', 'attachmemt; filename=test.zip');
	res.set('Content-Type', 'nodebuffer');

	//Get info submitted from form
	var form = new formidable.IncomingForm(),
		fields = [];

	form
	//All text fields stored in array with field name and value
	.on('field', function(field, value) {
		console.log(field, value);
		fields.push([field, value]);
	})

	.on('end', async function() {
		var inst, unit, assess, date;
		for(var i = 0; i < fields.length; i++) {
			if(fields[i][0] === 'inst') {
				inst = fields[i][1];
			}
			else if(fields[i][0] === 'unit') {
				unit = fields[i][1];
			}
			else if(fields[i][0] === 'assessment') {
				assess = fields[i][1];
			}
			else{
				date = fields[i][1];
			}
		}

		let paperInsert = await ctrlMain.queryPromise("INSERT INTO paper (user_id, institution, unit, assessment, date) VALUES (?,?,?,?,?)", 
			[req.session.user, inst, unit, assess, date], function(err, result) {
				if(err) throw err;
			});

	})

	form.parse(req);

	//Get number of questions in paper
	let downloadQuery = await ctrlMain.queryPromise('SELECT q_id FROM temp_paper');
	console.log(downloadQuery.length);
	//For every question get zip path and image path
		for(var i = 0; i < downloadQuery.length; i++) {
			let fileQuery = await ctrlMain.queryPromise('SELECT zip_path FROM question WHERE q_id = ' + downloadQuery[i]['q_id']);
			console.log(fileQuery[0]['zip_path']);
			//Add buffers to universal arrays
			stringBuilder(fileQuery[0]['zip_path'] + '\\Q.txt');
			imageBuilder(fileQuery[0]['zip_path']);
		}

	let maxpid = await ctrlMain.queryPromise('SELECT max(paper_id) FROM paper');
	        var newpid=maxpid[0]['max(paper_id)'];
	        //let q_ids = await ctrlMain.queryPromise('SELECT q_id FROM temp_paper where user_id='+req.session.user+'');
	        var k=0;
	        for (var k=0; k<downloadQuery.length; k++){
	            let historyInsert = await ctrlMain.queryPromise('INSERT INTO question_history (q_id,paper_id) VALUES ('+downloadQuery[k]['q_id']+','+newpid+')');
	       }

	//Create zip containg appended text files and images
	var zip = new JSZip();
	zip.file("Questions.txt", filecontents);
	var img = zip.folder("images");
	for (i = 0; i < image_data.length; i++){
		var buff = new Buffer(image_data[i], "base64");
		img.file("fig"+(i++)+".eps", buff);
	}
	zip.generateNodeStream({type:"nodebuffer", streamFiles:true})
		.pipe(res)

	//Reset temp_paper table
	for(var i = 0; i < downloadQuery.length; i++) {
		connection.query('DELETE FROM temp_paper WHERE q_id = ' + downloadQuery[i]['q_id']+' AND user_id = '+req.session.user, function(err, result) {
			if(err) throw err;
		});
	}
};