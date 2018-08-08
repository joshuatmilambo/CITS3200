var mongoose = require('mongoose');

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

var Skills = module.exports = mongoose.model('Skills', SkillSchema);

module.exports.createUserSkills = function(newUserSkill, callback){
    newUserSkill.save(callback);
}

module.exports.editUserSkills = function(userSkill, callback) {
    var query = {'uname': userSkill.uname};
    Skills.updateOne(query, {'skills': userSkill.skills}, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {'uname': username};
    console.log('in skill db '+username);
    Skills.findOne(query, callback);
}
module.exports.incrementTasks = function(ID, callback){
    var query = {'_id': ID};
    Skills.update(
        query,
        {$inc:{"taskNum":1}},callback);
}
module.exports.getUserByID = function(ID, callback){
    var query = {'_id': ID};
    console.log(query);
    Skills.findOne(query,callback); 
}
module.exports.getMatchingSkillsets = function(skill, callback){
    Skills.aggregate([
        {$sort:{tasks:1}},
        {$match:{"skills":{$in:skill}}},
        {$project:{"skillsCopy":"$skills","skills":1}},
        {$unwind:"$skills"},
        {$match:{skills:{$in:skill}}},
        {$group:{_id:"$_id","noOfMatches":{$sum:1},"skills":{$first:"$skillsCopy"}}},
        {$sort:{noOfMatches:-1}},
        {$project:{"_id":1,"noOfMatches":1,skills:1}}
    ],callback);
}