const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const debug = require('debug')('my-app-name:server');

// Application
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 3000;
app.set('port', port);

// Routing
const index = require('./routes/index');
const users = require('./routes/users');
app.use('/', index);
app.use('/users', users);
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Server
const server = http.createServer(app);
server.on('error', () => {
  // exit after finishing all I/O operations
  setImmediate(() => process.exit(1));
});
server.on('listening', () => {
  const addr = server.address();
  debug('Listening on ' + (addr.port || addr));
});

module.exports = () => server.listen(port);
