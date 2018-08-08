"use strict";

// NPM install mongoose and chai. Make sure mocha is globally
// installed
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chai = require('chai');
const expect = chai.expect;
var bcrypt = require('bcryptjs');
// models Schema
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
var SkillSchema = mongoose.Schema({
  uname:{
      type: String,
      index:true,
      required: true
  },
skills:[{
      type: String,
      required: true
  }],
  taskNum:{
      type: Number,
      default: 0
  }
});

var TaskSchema = mongoose.Schema({
  title:{
      type: String,
      index:true,
      required: true
  },
due: {
      type: Date,
      required: true
  },
  priority: {
      type: String,
      required: true
  },
  skillReq: [{
      type: String,
      required: true
  }],
  description: {
      type: String,
      required: true
  },
  dependencies: [{
      type: String,
      required: true
  }],
  complete: {
      type: Boolean,
      default: false
  },
  uname:{
      type: String,
      required: true
  },
  createdBy: {
      type: String,
      required: true
  },
  children: [{
      type: String
  }]
});

var Task = module.exports = mongoose.model('Task', TaskSchema);
var User = module.exports = mongoose.model('User', UserSchema);
var Skills = module.exports = mongoose.model('Skills', SkillSchema);
mongoose.connect('mongodb://webApp:password@ds133550.mlab.com:33550/taskplanner');
    var db = mongoose.connection;
describe('Users Database Tests', function() {
  //Before starting the test, create a sandboxed database connection
  //Once a connection is established invoke done()
  before(function (done) {
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      console.log('We are connected to users database!');
      return done();
    });
  });

  describe('Test users Database', function() {
    //Save new user object
    it('New name saved to test database', function(done) {
        var newUser = User({
            fname: "testfname",
            lname: "testlname",
            uname: "testuname",
            email: "testemail",
            password: "testpwd",
            contactNum: "testcontactNum"
        });
        this.timeout(3000);
        newUser.save(done);
    });

    it('Dont save incorrect format to database', function(done) {
      //Attempt to save with wrong info. An error should trigger
      var wrongSave = User({
        notName: 'Not Mike'
      });
      wrongSave.save(err => {
        if(err) { return done(); }
        throw new Error('Should generate error!');
      });
    });

    it('Should retrieve data from test database', function(done) {
      //Look up the 'Mike' object previously saved.
      User.find({uname: 'testuname'}, (err, user) => {
        if(err) {throw err;}
        if(user.length === 0) {throw new Error('No data!');}
        done();
      });
    });
  });
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  describe('Test Skills Database', function() {
    //Save new skills object
    it('New user skills saved to test database', function(done) {
      var newSkill = Skills({
          uname: "testuname",
          skills: [],
          taskNum: 0
      });
        newSkill.save(done);
    });

    it('Dont save incorrect format to database', function(done) {
      //Attempt to save with wrong info. An error should trigger
      var wrongSave = Skills({
        notSkill: 'Not Skill'
      });
      wrongSave.save(err => {
        if(err) { return done(); }
        throw new Error('Should generate error!');
      });
    });

    it('Should retrieve data from test database', function(done) {
      //Look up the 'Mike' object previously saved.
      Skills.find({uname: 'testuname'}, (err, skills) => {
        if(err) {throw err;}
        if(skills.length === 0) {throw new Error('No data!');}
        done();
      });
    });
  });
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  describe('Test Tasks Database', function() {
    //Save new task object
    it('New task saved to test database', function(done) {
      var newTask = Task({
          title: "testTitle",
          due: new Date(),
          priority: "testHigh",
          skillReq: [],
          description: "testdescript",
          dependencies: [],
          uname: "testuname",
          createdBy: "testcreateBy",
          complete: false,
          children: []
      });
        newTask.save(done);
    });

    it('Dont save incorrect format to database', function(done) {
      //Attempt to save with wrong info. An error should trigger
      var wrongSave = Task({
        notTask: 'Not Task'
      });
      wrongSave.save(err => {
        if(err) { return done(); }
        throw new Error('Should generate error!');
      });
    });

    it('Should retrieve data from test database', function(done) {
      //Look up the 'Mike' object previously saved.
      Task.find({uname: 'testuname'}, (err, tasks) => {
        if(err) {throw err;}
        if(tasks.length === 0) {throw new Error('No data!');}
        done();
      });
    });
  });
  //After all tests are finished drop database and close connection
  after(function(done){
    User.deleteOne({uname: 'testuname'}, (err, user) => {
        if(err) {throw err;}
      });
      Skills.deleteOne({uname: 'testuname'}, (err, user) => {
        if(err) {throw err;}
      });
      Task.deleteOne({uname: 'testuname'}, (err, task) => {
        if(err) {throw err;}
        mongoose.connection.close(done);
      });
  });

});