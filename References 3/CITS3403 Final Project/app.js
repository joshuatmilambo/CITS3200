var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')



var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');

// init mongo
var mongo = require('mongo');
var mongoose = require('mongoose');
// LocalHost Connection
//mongoose.connect('mongodb://localhost/users');
// External mLab Connection
mongoose.connect('mongodb://webApp:password@ds133550.mlab.com:33550/taskplanner');
var db = mongoose.connection;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
app.use(cookieParser());
app.use(session({
    secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
    resave: false,
    saveUninitialized: true
}));
// init passport
app.use(passport.initialize());
app.use(passport.session());

// set local var user for pug views to test if user is logged in
app.use(function(req, res, next) {
  if(req.user) {
    res.locals.user = req.user
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
