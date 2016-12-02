const express = require('express');
const router = express.Router();
const Authors = require('../database/db').Authors
const Genres = require('../database/db').Genres
const Books = require('../database/db').Books

/* GET home page. */
router.get('/', function(req, res, next) {
  let random = []
  for (var i = 0; i < 12; i++) {
    let id = Math.floor(Math.random()*1000)
    random.push(Books.get(id))
  }
  Promise.all(random)
  .then( result => {
    res.render('index', { title: 'Express', items: result })
  })
});

router.get('/details/:id', function(req, res, next) {
  const id = req.params.id
  Books.get(id).then((book) => {
    res.render('details', { book : book })
  })
});

router.post('/delete/:id', function(req, res, next){
  const id = req.params.id
  Books.delete(id)
  .then( processCompleted => {
    ('processCompleted:',processCompleted)
    res.render('processCompleted',{ processCompleted : processCompleted, editFlag : false })
  })
});

router.post('/search', function(req, res, next) {
  const searchInput = req.body.searchInput
  const parsedSearchInput = '%'+searchInput.replace(/\s+/,'%')+'%'
  Books.search(parsedSearchInput)
  .then(parsedSearchInputResults => {
    let bookSearchResultsDatabaseCalls = []
    const idArray = parsedSearchInputResults.map(parsedSearchInputResult => parsedSearchInputResult.id)
    idArray.forEach(id => bookSearchResultsDatabaseCalls.push(Books.get(id)))
    return Promise.all(bookSearchResultsDatabaseCalls)
  })
    .then( databaseCallsResults => {
      res.render('index', { items: databaseCallsResults })
  })
});

router.get('/edit/:id', function(req, res, next) {
  const editId = req.params.id
  Books.get(editId)
  .then( results => {
    res.render('edit', { item : results })
  })
})

router.post('/edit/:id', function(req, res, next) {
  const editBookId = req.params.id
  const editDescription = req.body.description
  const editImageUrl = req.body.image_url
  const editTitle = req.body.title
  const editAuthors = req.body.authors
  const editGenres = req.body.genres
  Books.edit(editBookId, editDescription, editImageUrl, editTitle, editAuthors, editGenres)
    .then(() => {
      res.render('processCompleted', {processCompleted : {title : editTitle}, editFlag : true})
    })
})

module.exports = router;
