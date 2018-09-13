var formidable = require('formidable');
var fs = require('fs');
var fileType = require('file-type');
var readChunk = require('read-chunk');

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