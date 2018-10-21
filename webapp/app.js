var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var session = require('client-sessions');
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');

var app = express();

// define globabl variable storing SQL connection details
connection = mysql.createConnection({
  host : 'localhost',
	user : 'root',
  password : 'cits3200', //is actually cits3200 (changed it for my local computer)
  database : 'CITS3200'  //is actually CITS3200 (changed it for my local computer)
});

//app.use('/public', express.static(path.join(__dirname, 'public')));

var staticResource='~/documents/uni/cits3200/masters/cits3200/webapp';
app.use('/public2', express.static(path.join(staticResource, 'public2')));


// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookieName:'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 24*60*60*1000,
  activeDuration: 10*60*1000,
  ephemeral: true
}));
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
