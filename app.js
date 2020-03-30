var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

global.__base = __dirname + '/';
global.__base__config = __base + 'config/';
global.__base__helpers = __base + 'helpers/';
global.__base__routes = __base + 'routes/';
global.__base__schemas = __base + 'schemas/';
global.__base__validates = __base + 'validates/';
global.__base__views = __base + 'views/';

var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
const flash = require('express-flash-notification');
const session = require('express-session');
var moment = require('moment');

var indexRouter = require(__base__routes + 'backend/index');
const systemConfig = require(__base__config + 'system');
const databaseInfo = require(__base__config + 'database');


// Database connection
mongoose.connect(`mongodb+srv://${databaseInfo.username}:${databaseInfo.password}@${databaseInfo.database}-k6kid.gcp.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true });
// =================================

var app = express();

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(flash(app));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'defaultLayout');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.systemConfig = systemConfig;
app.locals.moment = moment;
// Router for backend
app.use(`/${systemConfig.prefixAdmin}`, indexRouter);

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
    res.render(__base__views + 'pages/error/error', { title: 'Error' });
});

module.exports = app;