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
  const authors = req.body.authors
  const genres = req.body.genres
  const image_url = req.body.image_url
  const description = req.body.description
  Books.add(description, image_url, title)
  .then(id => {
    console.log(id)
  })
  res.redirect('/addBook')

})

module.exports = router;
