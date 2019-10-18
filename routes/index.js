var express = require('express');
var router = express.Router();
var Book = require('../models/books.model')
/* GET home page. */
router.get('/', async function(req, res, next) {
  let books
  try{
    books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec()
  }catch{
     books=[]
  }
  res.render('index',{books: books});
});

module.exports = router;
