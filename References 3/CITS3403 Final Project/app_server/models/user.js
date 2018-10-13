var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	fname: {
		type: String,
		index:true,
		required: true
    },
    lname: {
		type: String,
		required: true
    },
    uname: {
		type: String,
		required: true
    },
    email: {
		type: String,
		required: true
    },
		password: {
		type: String,
		required: true
    },
	contactNum: {
		type: String,
		required: true
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
		var query = {'uname': username};
    console.log(query);
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.updateUser = function(updatedUser, callback) {
	var query = {'uname': updatedUser.uname};
	var update = {'fname': updatedUser.fname, 'lname': updatedUser.lname, 'email': updatedUser.email, 'contactNum': updatedUser.contactNum,};
	User.findOneAndUpdate(query, update, callback);
}