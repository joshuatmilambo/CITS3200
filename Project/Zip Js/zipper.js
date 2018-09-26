var JSZip = require("jszip");
var fs = require("fs");
var filecontents = "";

//reads the current file being looked at to the file contetnts string
function stringBuilder(filename){
	let reader = new FileReader();
	filecontent += reader.readAsBinaryString(filename) + "\n";
}

/*
creates the zip to be downloaded
	-adds the string created in stringBuilder
	-adds the image files one by one naming them sequentially
	*all images etc are place holder names and will have to be updated when added in the final program
*/
function zipMaker(){
	var zip = new JSZip();
	zip.file("Questions.tex", filecontent);
	var img = zip.folder("images");
	for (i = 0; i<numfiles;i++){
		img.file("fig"+(i++)+".png", imgData, {base64;true});
	}
	zip.generateAsync({type:"blob"})
	zip.generateAsync({type:"blob"}).then(function(content) {
    	saveAs(content, "test.zip"); //can be changed to allow more dynamic allocation/saving"
	}
}

/*
This reads the zip that has been uploaded.
	- it reads all the files then prints them in the console, there isn't really any need for the .then function
	- .then function simply prints all the files from said zip.

*/
function zipReader(zipname){
	var read = new JSZip();
	read.loadAsync(zipname,{createFolders: true})
	.then(function(read)){
		console.log(read.files);
	}
}	

/*
TO DO
	1. Link to database (or at the very least have the inputs (zipname,filename etc) reference the filesystem location)
	2. Link to the website (load into the HTML and use as needed (allocate the functions to buttons, loads etc))
*/
