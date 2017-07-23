module.exports = require('@stamp/it')({
  props: {
    process,
    setImmediate,
    require,
    express: require('express'),
    path: require('path'),
    logger: require('morgan'),
    cookieParser: require('cookie-parser'),
    bodyParser: require('body-parser'),
    http: require('http'),
    debug: require('debug')('my-app-name:server')
  },

  init() {
// Application
    const app = this.express();
    app.set('views', this.path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(this.logger('dev'));
    app.use(this.bodyParser.json());
    app.use(this.bodyParser.urlencoded({extended: false}));
    app.use(this.cookieParser());
    app.use(this.express.static(this.path.join(__dirname, 'public')));
    const port = this.process.env.PORT || 3000;
    app.set('port', port);

// Routing
    const index = this.require('./routes/index');
    const users = this.require('./routes/users');
    app.use('/', index);
    app.use('/users', users);
    app.use(this.handleNotFound);
    app.use(this.handleGenericError);

// Server
    const server = this.http.createServer(app);
    server.on('error', () => {
      // exit after finishing all I/O operations
      this.setImmediate(() => this.process.exit(1));
    });
    server.on('listening', () => {
      const addr = server.address();
      this.debug('Listening on ' + (addr.port || addr));
    });

    server.listen(port);
  },

  methods: {
    handleNotFound(req, res, next) {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    },
    handleGenericError(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    }
  }
});
