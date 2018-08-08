/*GET HOME Page*/
module.exports.index = function(req, res) {
    res.render('index');
};

/*GET LOGIN Page*/
module.exports.login = function(req, res) {
    res.render('login');
};

/*PROCESS LOGOUT*/
module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}

/*GET REFERENCES Page*/
module.exports.references = function(req, res) {
    res.render('references');
};

/*GET TESTING Page */
module.exports.testing = function(req, res) {
    res.render('testing');
}; 

module.exports.about = function(req, res) {
    res.render('about');
};