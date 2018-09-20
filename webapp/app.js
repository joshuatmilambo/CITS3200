var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');

var app = express();

// define globabl variable storing SQL connection details
connection = mysql.createConnection({
  host : 'localhost', 
	user : 'root',
  password : 'cits3200',
  insecureAuth : 'true',
  database : 'CITS3200'
});

// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// on start up request current qid from SQL database --> GLOBAL
//Get the last id from Question Table
connection.connect(function(err) {
  if (err) {
		console.error('Error connecting: ' + err.stack);
		return;
	}
	console.log('Connected as id ' + connection.threadId);
});

qid = -1;
connection.query('SELECT MAX(q_id) FROM question',function(err,results){
  if(err) throw err;
  qid = results[0]['MAX(q_id)'];
  if(qid === null) {
    console.log("Initializing QID to 0");
    qid = 0;
  }
  else {
    console.log("Error initialising QID");
  }
});

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
