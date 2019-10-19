if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var authorRouter = require('./routes/author');
var booksRouter = require('./routes/books')
var app = express();

// view engine setup
app.set('view engine', 'pug');
app.set('views', 'views');

var mongoose= require('mongoose');
// mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true });
 mongoose.connect(process.env.DATABASE_URL,{useUnifiedTopology: true,
   useNewUrlParser: true, })
 const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Mongoose'))
app.use(logger('dev'));
app.use(express.json(({limit: '50mb'})));
app.use(express.urlencoded({limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit:'10mb' ,extended: false }));

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', booksRouter)
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
 
// app.listen(port,function(){
//    console.log('Server litening port',port)
// })
app.listen(process.env.PORT || 3000)
module.exports = app;
