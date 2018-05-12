var mongoose = require('mongoose');

var Project = mongoose.model('project');
var userController = require('./userController');
console.log("ON_IMPORT: USER_CONTROLLER @ ADD_NEW_PROJECT", userController, userController.addNewProject);

var createProject = function(req, callback) {
    var project = new Project({
        author: req.user._id,
        investor: null,
        offers: [],
        datePosted: Date.now(),
        progress: [],
        title: req.body['project-title'],
        banner: req.body['banner-url'],
        desc: req.sanitize(req.body['body-content']),
        totalFunds: 0,
        categories: req.body['project-tags'],
        comments: [],
        ratings: {
            sumRate: 0,
            numVoters: 0
        }
    });

    project.save(function(err) {
        if (err) {
            callback(false, project);
        } else {
            console.log("USER_CONTROLLER @ ADD_NEW_PROJECT", userController, userController.addNewProject);
            userController.addNewProject(project._id, req.user, function(err2) {
                if (err2) callback(false, project);
                else callback(true, project);
            })
        }
    });
}


var getProject = function(projectId, callback) {
    Project.findOne({ '_id': projectId}, function(err, project) {
        if (err) callback(null);
        else
            callback(project);
    });
}

var updateProject = function(projectId, featureChanges, callback) {
    getProject(projectId, function(project) {
        if (project) {
            for (var i = 0; i < featureChanges.length; i++) {
                project[featureChanges[i]['name']] = featureChanges[i]['value'];
            }
            project.save(function(err) {
                if (err) callback(false, project);
                else callback(true, project);
            })
        } else {
            callback(false, project);
        }
    });
}

var addComment = function(projectId, userId, comment, callback) {
    Project.findOne({'_id': projectId}, function(err, project){
        if (err) callback(false);
        else {
            project.comments.unshift({
                commenter: userId,
                comment: comment,
                date: Date.now()
            });
            project.save(function(err) {
                if (err) callback(false);
                else callback(true);
            })
        }
    });
}

module.exports = {
    createProject: createProject,
    addComment: addComment,
    getProject: getProject,
    updateProject: updateProject
}




