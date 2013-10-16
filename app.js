var express = require('express'),
  MySQLSessionStore = require('connect-mysql-session')(express);;
var routes = require('./routes/main');
var login = require('./routes/login');
var upload = require('./routes/upload');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  store: new MySQLSessionStore("db_babyry", "babyry", "babyry", {
  // options...
  }),
  secret: "cat"
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var loginCheck = function(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', loginCheck, routes.index);
app.get('/login', login.login);
app.post('/login_result', login.result);
app.post('/register_result', login.register);
app.get('/upload', loginCheck, upload.upload);
app.post('/upload', loginCheck, upload.upload);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
