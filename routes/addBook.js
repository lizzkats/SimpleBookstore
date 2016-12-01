const express = require('express');
const router = express.Router();
const Authors = require('../database/db').Authors
const Genres = require('../database/db').Genres
const Books = require('../database/db').Books

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('addBook',{})
});

router.post('/add', function(req, res, next) {
  const title = req.body.title
  let authors = req.body.authors
  const genres = req.body.genres
  const image_url = req.body.image_url
  const description = req.body.description
  Books.add(description, image_url, title)
  .then(book => {
    let addAuthors = []
    if(!authors) {
      return Promise.resolve(authors)
    }
    // if(!Array.isArray(authors)) {
    //   authors = [authors]
    // }
    // console.log(authors, ' ', book.id)
    // for(author in authors) {
    //   addAuthors.push(Authors.add(book.id, author))
    // }
    return Promise.resolve(Authors.add(book.id, authors))
  })
  .then(results => {
    res.redirect('/addBook')
  })

})

module.exports = router;
