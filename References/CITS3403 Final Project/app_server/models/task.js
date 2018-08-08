var mongoose = require('mongoose');

var TaskSchema = mongoose.Schema({
    title:{
        type: String,
        index:true,
        required: true
    },
	due: {
        type: String,
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

module.exports.createNewTask = function(newTask, callback){
    for(var i = 0; i < newTask.dependencies.length; i++) {
        if(newTask.dependencies[i] === 'N/A') continue;
        var query = {'title': newTask.dependencies[i]};
        var update = {'$push': {'children': newTask.title }};
        Task.findOneAndUpdate(query, update, function(err, task) {
            if(err) throw err;
            console.log(task);
        });
    }
    newTask.save(callback);
};

module.exports.getCreatedTasks = function(username, callback) {
    var query = {'createdBy': username};
    Task.find(query, callback);
};

module.exports.taskComplete = function(title, callback) {
    var query = {'title': title};
    var update = {'complete': true}
    Task.findOneAndUpdate(query, update, function (err, task) {
        for(var i = 0; i < task.children.length; i++) {
            Task.findOne({'title': task.children[i]}, function (err, taskChild) {
                if(err) throw err;
                var dependencies = taskChild.dependencies;
                for(var i = 0; i < dependencies.length; i++) {
                    if(dependencies[i] === title) {
                        dependencies[i] = 'N/A';
                    }
                }
                var query = {'title': taskChild.title};
                var update = {'dependencies': dependencies};
                Task.update(query, update, function (err, raw) {
                    if(err) throw err;
                });
            });
        }
    });
};

module.exports.removeTask = function(title, callback) {
    var query = {'title': title};
    Task.findOneAndRemove(query, function(err, task) {
        if(err) throw err;
        for(var i = 0; i < task.children.length; i++) {
            Task.findOne({'title': task.children[i], 'complete': false}, function (err, taskChild) {
                if(err) throw err;
                if(taskChild) {
                    var dependencies = taskChild.dependencies;
                    for(var i = 0; i < dependencies.length; i++) {
                        if(dependencies[i] === title) {
                            dependencies[i] = 'N/A';
                        }
                    }
                    var query = {'title': taskChild.title};
                    var update = {'dependencies': dependencies};
                    Task.update(query, update, function (err, raw) {
                        if(err) throw err;
                    });
                }
            });
        }
    });
};

function rearrangeArr(tempArr){
    var tempHigh=[],tempNorm = [], tempLow = [];
    var res = [];
    for(var i = 0; i < tempArr.length;i++){
        if(tempArr[i].priority == "High")tempHigh.push(tempArr[i]);
        if(tempArr[i].priority == "Normal")tempNorm.push(tempArr[i]);
        if(tempArr[i].priority == "Low")tempLow.push(tempArr[i]);
    }
    for(var i = 0; i < tempHigh.length;i++)res.push(tempHigh[i]);
    for(var i = 0; i < tempNorm.length;i++)res.push(tempNorm[i]);
    for(var i = 0; i < tempLow.length;i++)res.push(tempLow[i]);
    return res;
}
module.exports.sortAuto = function(user,page,callback) {
    var query;
    if(page === 'view') query = {'uname':user};
    else query = {'createdBy':user};
    var sortq = {'due':1};
    var modifiedArr = [];
    Task.find(query).sort(sortq).exec(function(err,task){
        if(err)throw err;
        console.log("queryed tasks")
        console.log(task);
        if(task == []) {
            var j = 0;
            var date = task[0].due.toString();
            //console.log("task is ");
            //console.log(task);
            for(var i = 0;i < task.length;i++){
                //console.log(task[i].due.toString()+" "+date);
                //console.log("ij"+i.toString()+j.toString()+task.length.toString());
                if(task[i].due.toString().localeCompare(date)==0 && i +1 != task.length)continue;
                else if(task[i].due.toString().localeCompare(date)!=0 || i+1 == task.length){
                    var tempArr = [];
                    if(i+1 == task.length)tempArr = task.slice(j,i+1);
                    else tempArr = task.slice(j,i);
                    tempArr = rearrangeArr(tempArr);
                    //console.log("temp arr ij"+i.toString()+j.toString());
                    //console.log(tempArr);
                    date = task[i].due;
                    j = i;
                    for(var k = 0; k < tempArr.length;k++)modifiedArr.push(tempArr[k]);
                }
            }
            console.log("marr");
            console.log(modifiedArr);
            callback(modifiedArr);
        } else {
            console.log("just calling back task");
            callback(task);
        }
    });
    
};

module.exports.sortDate = function(user,page,callback) {
    var query;
    if(page === 'view') query = {'uname':user};
    else query = {'createdBy':user};
    var sortq = {'due':1};
    var modifiedArr = [];
    Task.find(query).sort(sortq).exec(function(err,task){
        if(err)throw err;
        callback(task);
    });
};
module.exports.sortName = function(user,page,callback) {
    var query;
    if(page === 'view') query = {'uname':user};
    else query = {'createdBy':user};
    var sortq = {'title':1};
    var modifiedArr = [];
    Task.find(query).sort(sortq).exec(function(err,task){
        if(err)throw err;
        callback(task);
    });
};