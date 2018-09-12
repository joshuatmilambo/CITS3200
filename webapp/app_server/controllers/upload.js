var formidable = require('formidable');
var fs = require('fs');

/* Upload Files */
module.exports.upload = function(req, res) {
    console.log('Qid: ' + qid);

    var dir = __dirname + '/../files/' + qid;
    if(!fs.existsSync(dir))
        fs.mkdirSync(dir);

    var form = new formidable.IncomingForm(),
        files = [],
        fields = [];

    form.uploadDir = dir;
    form.keepExtensions = true;

    qid++;

    form
        .on('field', function(field, value) {
            console.log(field, value);
            fields.push([field, value]);
        })
        .on('file', function(field, file) {
            console.log(field, file.name);
            if(field === 'uploadzip' && file.type === 'application/x-zip-compressed')
                files.push([field, file]);
            else if(field === 'uploadpdf' && file.type === 'application/pdf')
                files.push([field, file]);
            else
                console.log('Not correct file type');
        })
        .on('end', function() {
            console.log(files);
            console.log('Files Saved');
            res.redirect('/uploadhistory');
        });
    
    form.parse(req);
};