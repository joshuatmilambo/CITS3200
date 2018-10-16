var ctrlMain = require('../controllers/main');
var JSZip = require('jszip');
var fs = require('fs');
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

	//Get number of questions in paper
	let downloadQuery = await ctrlMain.queryPromise('SELECT q_id FROM temp_paper');
	console.log(downloadQuery.length);
		for(var i = 0; i < downloadQuery.length; i++) {
			let fileQuery = await ctrlMain.queryPromise('SELECT zip_path FROM question WHERE q_id = ' + downloadQuery[i]['q_id']);
			console.log(fileQuery[0]['zip_path']);
			stringBuilder(fileQuery[0]['zip_path'] + '\\Q.txt');
			imageBuilder(fileQuery[0]['zip_path']);
		}

	var zip = new JSZip();
	zip.file("Questions.txt", filecontents);
	var img = zip.folder("images");
	for (i = 0; i < image_data.length; i++){
		var buff = new Buffer(image_data[i], "base64");
		img.file("fig"+(i++)+".png", buff);
	}
	zip.generateNodeStream({type:"nodebuffer", streamFiles:true})
		.pipe(res)
};