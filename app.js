global.appName="9GAG"


var createError = require('http-errors');
var express = require('express');
var favicon = require('express-favicon');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');



var mongoose = require('mongoose');

require('./config/passport')(passport);

var app = express();
app.use(expressLayouts);


var mongodbUri = '';

mongoose.connect(mongodbUri, { useNewUrlParser: true });

var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function() {
    console.log("Connecting Database")
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'photo')));
app.use(favicon(__dirname + '/public/favicon.png'));

// required for passport
app.use(session({
    secret: 'gizlibilgi', // session secret
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



require('./routes/routerManager')(app,passport);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

    res.render('error', {
        status:err.status || 500,
        message: 'Error not found',//err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
