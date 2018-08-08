var Task = require('../models/task');

/* GET Creatw Task */
module.exports.createTask = function(req, res) {
    Task.getCreatedTasks(req.user.uname, function(err, tasks) {
        if(err) throw err;
        res.render('createTask', { tasks: tasks });
    });
};

/*Check for dependencies*/
function checkDependencies (tasks) {
    var hasDependencies = [];
    for(var i = 0; i < tasks.length; i++) {
        hasDependencies[i] = false;
        for(var j = 0; j < tasks[i].dependencies.length; j++) {
            if(tasks[i].dependencies[j] !== 'N/A') { 
                hasDependencies[i] = true;
                break;
            }
        }
    }
    return hasDependencies;
}

/* GET View Tasks */
module.exports.viewTasks = function(req, res) {
    Task.sortAuto(req.user.uname, 'view', function(tasks){
        //console.log(" task");
        //console.log(tasks);
        var dependencies = checkDependencies(tasks);
        res.render('viewTasks', { 
            tasks: tasks,
            sortBy: 'auto',
            dependencies: dependencies
         });
    });
};

/* GET View Task by Date */
module.exports.viewTasksDate = function(req, res) {
    Task.sortDate(req.user.uname, 'view', function(tasks){
        var dependencies = checkDependencies(tasks);
        res.render('viewTasks', { 
            tasks: tasks,
            sortBy: 'date',
            dependencies: dependencies
         });
    });
};

/* GET View Tasks by Name */
module.exports.viewTasksName = function(req, res) {
    Task.sortName(req.user.uname, 'view', function(tasks){
        var dependencies = checkDependencies(tasks);
        res.render('viewTasks', { 
            tasks: tasks,
            sortBy: 'name',
            dependencies: dependencies
         });
    });
};

/* GET View Created Tasks */
module.exports.createdTasks = function(req, res) {
    Task.sortAuto(req.user.uname, 'created', function(tasks){
        console.log(" task");
        console.log(tasks);
        res.render('createdTasks', { 
            tasks: tasks,
            sortBy: 'auto'
         });
    });
};

/* GET View Created Tasks by Date */
module.exports.createdTasksDate = function(req, res) {
    Task.sortDate(req.user.uname, 'created', function(tasks){
        res.render('createdTasks', {             
            tasks: tasks,
            sortBy: 'date' 
        });
    });
};

/* GET View Created Tasks by Name */
module.exports.createdTasksName = function(req, res) {
    Task.sortName(req.user.uname, 'created', function(tasks){
        res.render('createdTasks', { 
            tasks: tasks,
            sortBy: 'name'
        });
    });
};

