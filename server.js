/*jshint node:true*/

var express = require('express'),
    assets = require('connect-assets'),
    stylus = require('stylus'),
    nib = require('nib'),

app = module.exports = express.createServer();

app.configure(function() {
  app.set('views', __dirname + '/app');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(stylus.middleware({
    src: __dirname + '/app',
    compile: function(str, path) {
      return stylus(str).set('filename', path).set('compress', false).set('compress', true).use(nib());
    }
  }));
  app.use(app.router);
  app.use(express['static'](__dirname + '/app'));
  return app.use(assets());
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  return app.get('/env', function(req, res) {
    return res.json(process.env);
  });
});

app.configure('production', function() {
  return app.use(express.errorHandler());
});

app.get(/\/[a-zA-Z\-\_]*$/, function(req, res) {
  return res.render('index', { layout: false });
});

app.listen(process.env.port || 3000, function() {
  return console.log('Express server listening on port %d in %s mode', app.address().port, app.settings.env);
});