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
  console.log(id)
  Books.delete(id)
  .then( deletedBook => {
    console.log('deletedBook:',deletedBook)
    res.render('deletedBook',{ deletedBook : deletedBook })
  })
})

module.exports = router;
