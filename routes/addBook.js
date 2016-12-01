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
    // if(!authors) {
    //   return Promise.resolve(authors)
    // }
    // if(!genres){
    //   return Promise.resolve(genres)
    // }
    // if(!Array.isArray(authors)) {
    //   authors = [authors]
    // }
    // console.log(authors, ' ', book.id)
    // for(author of authors) {
    //   addAuthors.push(Authors.add(book.id, author))
    // }
    return Promise.all([Authors.add(book.id, authors), Genres.add(book.id, genres)])
  })
  .then(results => {
    res.redirect('/addBook')
  })

})

module.exports = router;
