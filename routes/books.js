var express = require('express');
var router = express.Router();
//var multer  = require('multer')
// var fs = require('fs');
// var path = require('path')
var Book = require('../models/books.model')
var Author = require('../models/author.model')
// var uploadpath = path.join('public', Book.coverImgBasepath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
// var upload = multer({
//      dest:  uploadpath,
//      fileFilter:function(req, file, callback){
//          callback(null, imageMineTypes.includes(file.mimetype))
//      }
//     })

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
  
router.post('/', async function(req, res) {
   const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try{
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    }catch{
        
        renderNewpage(res, book, true)
    }
  });
 
  // Show Books
  router.get('/:id', async function(req, res, next){
    try{
        const book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show',
        {
            book : book,
          
        }
        )
    }catch{
         res.redirect('/')
    }
})
// Edit
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
  } catch {
    res.redirect('/')
  }
})
// Update
router.put('/:id', async function(req, res, next){
  let book
  try{
      book = await Book.findById(req.params.id)
      book.title= req.body.title,
      book.author = req.body.author,
      book.publishDate = new Date(req.body.publishDate),
      book.pageCount = req.body.pageCount,
      book. description = req.body.description
     if(req.body.cover != null && req.body.cover !== ''){
      saveCover(book, req.body.cover)
     }
     await book.save()
      res.redirect('/books')
  }catch{
      if(book != null){
          renderEditpage(res, book, true)
      }else{
          res.redirect('/')
      }
      
  }
})
// Delete
router.delete('/:id', async function(req, res, next){
    let book
    try{
        book = await Book.findById(req.params.id)
       await book.remove()
        res.redirect('/books')
    }catch{
        if(book != null){
            res.render('books/show',{
                book: book,
                errorMessage:'Could not remove book'
            })
        }else{
            res.redirect('/')
        }
        
    }
  })
 async function renderNewpage(res, book, hasError=false){
    renderFormPage(res, book, 'new', hasError)
  }

   
 async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book,'edit', hasError)
  }
  
  async function renderFormPage(res, book,form, hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form === 'edit') {
              params.errorMessage = 'Error Updating Book'
            } else {
              params.errorMessage = 'Error Creating Book'
            }
          }
        res.render(`books/${form}`,params)
    }catch{
        res.redirect('/books')
    }
  }

function saveCover(book, coverEncoded) {
    if (coverEncoded === null) return
    const cover = JSON.parse(JSON.stringify(coverEncoded))
    
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64')
      book.coverImageType = cover.type
    }
  }

module.exports = router;
