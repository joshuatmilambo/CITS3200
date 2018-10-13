var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlRegister = require('../controllers/register');
var ctrlTasks = require('../controllers/tasks');

var User = require('../models/user');
var Skills = require('../models/skills');
var Task = require('../models/task');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// function to check whether a user is logged in before loading webpage
function loggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

/* GET home page. */
router.get('/', ctrlMain.index);
// for auth user
passport.use(new LocalStrategy(
	function (uname, password, done) {
		User.getUserByUsername(uname, function (err, user) {
			if (err) throw err;
			if (!user) {
                console.log('no such user');
				return done(null, false, { message: 'Unknown User' });
			}
            console.log('correct uname');
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
                    console.log('correct password');
					return done(null, user);
				} else {
                    console.log('wrong password');
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});
/* GET Login Page */
router.get('/login', ctrlMain.login);
// get post data from login form
router.post('/login',
  passport.authenticate('local', {successsRedirect:'/skills',failureRedirect:'/login', failureFlash: false}),
  function(req,res){
    // get current user's username
    req.session.user = req.user.uname;
    // check if the user already filled the skills form
    Skills.getUserByUsername(req.session.user, function(err,user){
        if (err) throw err;
        console.log(user);
        // if so redirect to creating task
        if(user){
            console.log('user already added skills')
            res.redirect('/view-tasks');
        } else {
            // fill skills form
            console.log("user is " +req.session.user);
            console.log("log in sid "+req.sessionID);
            res.redirect('/skills');
        }
    }); 
});

/*GET Logout Page */
router.get('/logout', loggedIn, ctrlMain.logout);

/* GET Register Page */
router.get('/register', ctrlRegister.register);
// get post data from register form
router.post('/register',function(req,res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var uname = req.body.uname;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var contactNum = req.body.contactNum;
    // store newUser to mongo
    var newUser = new User({
        fname: fname,
        lname: lname,
        uname: uname,
        email: email,
        password: password,
        contactNum: contactNum
    });
    console.log("uname "+uname);
    // check if the username has already been taken
    User.getUserByUsername(uname, function(err,user){
        if(err)throw err;
        console.log("user "+user);
        if(user){
            console.log('username has been taken');
            res.redirect('/register');
        }else{
            // if not, create new User
            User.createUser(newUser, function(err,user){
                if (err) throw err;
                console.log(user);
            });
            console.log('new user has been registered');
            res.redirect('/login');
        }
    })  
});
/* GET Skills Page */
router.get('/skills', loggedIn, ctrlRegister.skills);
// get post data from skills form
router.post('/skills', loggedIn, function(req,res){
    var skills = req.body.skills;
    var newSkill = new Skills({
        uname: req.session.user,
        skills: skills
    });
    // create scheme of skills of a user to mongo
    Skills.createUserSkills(newSkill, function(err,skill){
        if (err) throw err;
        console.log(skill);
        console.log('added skills');
        res.redirect('/create-task');
    });
});
/* GET Create Tasks Page */
router.get('/create-task', loggedIn, ctrlTasks.createTask);
// get post data from create task form
router.post('/create-task', loggedIn, function(req,res){
    var title = req.body.title;
    var due = req.body.due;
    var priority = req.body.priority;
    var skillReq = req.body.skillReq;
    var description = req.body.description;
    var dependencies = req.body.dependencies;
    var uname = "none";
    var createdBy = req.user.uname;
    // loop through skillReq, e.g. Accounting, Programming
    // see if theres one skill matches in the user's skillset
    // asign this task to that user
    for(var i = 0; i < skillReq.length;i++){
        if(skillReq[i] == "N/A")skillReq[i] = "";
    }
    Skills.getMatchingSkillsets(skillReq, function(err,users){
        if(err)throw err;
        // if found
        if(users){
            if(uname != "none")return;
            console.log("found suitable user");
            console.log(users);
            console.log(users[0]._id);
            // asign uname to username
            Skills.incrementTasks(users[0]._id,function(err,msg){
                if(err)throw err;
                if(msg)console.log(msg);
            });
            Skills.getUserByID(users[0]._id,function(err,user){
                if(err)throw err;
                if(user){
                    console.log(user);
                    uname = user.uname;
                    console.log('uname = '+uname);
                    var newTask = new Task({
                        title: title,
                        due: due,
                        priority: priority,
                        skillReq: skillReq,
                        description: description,
                        dependencies: dependencies,
                        uname: uname,
                        createdBy: createdBy,
                        complete: false,
                        children: []
                    });
                    // create new task
                    Task.createNewTask(newTask, function(err,task){
                        if (err) throw err;
                        console.log(task);
                        console.log('added task'); 
                    });
                }
            });  
        }    
    });
    //then redirect to createdTasks page after 0.5s
    //delay allows time for the mongodb server to process the create request
    setTimeout(function () {
        res.redirect('/created-tasks'); 
    }, 500);
});
/* GET References Page */
router.get('/references', ctrlMain.references);
/* GET View Tasks Page */
router.get('/view-tasks', loggedIn, ctrlTasks.viewTasks);
/* GET View Tasks Page Date */
router.get('/view-tasks-date', loggedIn, ctrlTasks.viewTasksDate);
/*Get View Tasks Page Name */
router.get('/view-tasks-name', loggedIn, ctrlTasks.viewTasksName);
/* POST View Tasks Page*/
router.post('/view-tasks', loggedIn, function(req, res) {
    var title = req.body.taskTitle;
    Task.taskComplete(title, function(err, task) {
        if(err) throw err;
        console.log(task);
    });
    //then redirect to viewTasks page after 0.5s
    //delay allows time for the mongodb server to process the update requests for removing dependencies
    setTimeout(function () {
        res.redirect('/view-tasks'); 
    }, 500);
});
/*POST View Tasks Sort*/
router.post('/sort', loggedIn, function(req, res) {
    var sortBy = req.body.sort;
    console.log(sortBy);
    switch(sortBy){
        case "sortAuto":
            res.redirect('/view-tasks');
            break;
        case "sortDate":
            res.redirect('/view-tasks-date');
            break;
        case "sortName":
            res.redirect('/view-tasks-name');
            break;
        default:
            res.redirect('/view-tasks');
    }
});

/*GET View Created Tasks Page */
router.get('/created-tasks', loggedIn, ctrlTasks.createdTasks);
/*GET View Created Tasks Page Date */
router.get('/created-tasks-date', loggedIn, ctrlTasks.createdTasksDate);
/*GET View Created Tasks Page Name */
router.get('/created-tasks-name', loggedIn, ctrlTasks.createdTasksName);
/*POST View Created Tasks Page*/
router.post('/created-tasks', loggedIn, function(req, res) {
    var title = req.body.taskTitle;
    Task.removeTask(title, function(err, task) {
        if(err) throw err;
        console.log('removed task ' + title);
    });
    //then redirect to createdTasks page after 0.5s
    //delay allows time for the mongodb server to process the update requests for removing dependencies
    setTimeout(function () {
        res.redirect('/created-tasks'); 
    }, 500);
});
/*POST Created Tasks Sort*/
router.post('/created-sort', loggedIn, function(req, res) {
    var sortBy = req.body.sort;
    console.log(sortBy);
    switch(sortBy){
        case "sortAuto":
            res.redirect('/created-tasks');
            break;
        case "sortDate":
            res.redirect('/created-tasks-date');
            break;
        case "sortName":
            res.redirect('/created-tasks-name');
            break;
        default:
            res.redirect('/created-tasks');
    }
});

/* GET Edit Profile Page */
router.get('/edit-profile', loggedIn, ctrlRegister.editProfile);
// get post data from edit profile form
router.post('/edit-profile', loggedIn, function(req,res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var confirmPassword = req.body.confirmPassword;
    var contactNum = req.body.contactNum;
    // store newUser to mongo
    var editUser = new User({
        fname: fname,
        uname: req.user.uname,
        lname: lname,
        email: email,
        contactNum: contactNum
    });
    User.updateUser(editUser, function(err, update) {
        if(err) throw err;
        console.log(update);
        console.log('updated user');
        res.redirect('/edit-skills');
    }); 
});

/* GET Edit Skills Page */
router.get('/edit-skills', loggedIn, ctrlRegister.editSkills);
// get post data from skills form
router.post('/edit-skills', loggedIn, function(req,res){
    var skills = req.body.skills;
    var newSkill = new Skills({
        uname: req.session.user,
        skills: skills
    });
    // update scheme of skills of a user to mongo
    Skills.editUserSkills(newSkill, function(err, skill){
        if (err) throw err;
        console.log(skill);
        console.log('updated skills');
        res.redirect('/view-tasks');
    });
});

/* GET Testing Page */
router.get('/testing', ctrlMain.testing);

/* GET About Page */
router.get('/about', ctrlMain.about);

module.exports = router;
