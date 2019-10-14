var express = require('express');
var router = express.Router();
var Author = require('../models/author.model')
/* GET home page. */
router.get('/', async function(req, res, next) {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !==''){
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try{
    const authors = await Author.find(searchOptions);
    res.render('authors/index',{
      authors: authors,
      searchOptions : req.query
    })
   
  }catch{
    res.redirect('/')
  }
});
router.get('/new',  function(req, res, next) {
    res.render('authors/new',{author : new Author()});
  });
  
router.post('/', async function(req, res, next) {
    const author = new Author({
      name: req.body.name
    })
    try{
      const newAuthor = await author.save();
      res.redirect('authors')
    }catch{
      res.render('authors/new',{
        author: author,
        errorMessage:'Error creating Author'
      })
    }
  });
module.exports = router;
