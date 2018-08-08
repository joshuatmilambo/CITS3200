var Skills = require('../models/skills');

/* GET Registration Page */
module.exports.register = function(req, res) {
    res.render('register');
};

/* GET Edit User Page */
module.exports.editProfile = function(req, res) {
    res.render('editProfile');
}

/* GET Skills Page */
module.exports.skills = function(req, res) {
    res.render('skills');
};

/* GET Edit Skills Page */
module.exports.editSkills = function(req, res) {
    Skills.getUserByUsername(req.user.uname, function (err, skills) {
        if(err) throw err;
        res.render('editSkills', {skill: skills.skills});
    });
}