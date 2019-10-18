var express = require('express');
var router = express.Router();
var multer  = require('multer')
var fs = require('fs');
var path = require('path')
var Book = require('../models/books.model')
var Author = require('../models/author.model')
var uploadpath = path.join('public', Book.coverImgBasepath)
var imageMineTypes =['image/jpeg','image/png','image/gif',]
var upload = multer({
     dest:  uploadpath,
     fileFilter:function(req, file, callback){
         callback(null, imageMineTypes.includes(file.mimetype))
     }
    })

/* GET home page. */
router.get('/', async function(req, res, next) {
    var query = Book.find()
    if(req.query.title != null && req.query.title  != ''){
        query = query.regex('title', new RegExp(req.query.title,'i'))
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter  != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore  != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
  
    try{
        const books = await query.exec()
        res.render('books/index',{
            books: books,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
});

router.get('/new', async function(req, res, next) {
    renderNewpage(res, new Book())
});
  
router.post('/',upload.single('cover'), async function(req, res) {
  const filename= req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: filename,
        description: req.body.description
    })

    try{
        const newBook = await book.save()
        res.redirect('books')
    }catch{
        if (book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewpage(res, book, true)
    }
  });
  function removeBookCover(filename){
    fs.unlink(path.join(uploadpath,filename), (err) => {
        if (err) console.error(err)
      });
 }
 async function renderNewpage(res, book, hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage ='Error Creating Book'
        res.render('books/new',params)
    }catch{
        res.redirect('/books')
    }
  }
  
module.exports = router;
