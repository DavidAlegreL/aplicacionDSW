var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Importar cors

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
<<<<<<< HEAD
var tarjetasRouter = require('../tarjetasBackend/routes/tarjetas'); 
=======
>>>>>>> parent of 2968b7e4 (cambios en el fronted e intento de creacion de tarjetas con stripe)

var app = express();

// Configurar CORS
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
<<<<<<< HEAD
app.use('/tarjetas', tarjetasRouter); 
=======
>>>>>>> parent of 2968b7e4 (cambios en el fronted e intento de creacion de tarjetas con stripe)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return the error as JSON
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;