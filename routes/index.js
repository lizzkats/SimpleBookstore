const express = require('express');
const router = express.Router();
const Books = require('../database/db').Books

/* GET home page. */
router.get('/', function(req, res, next) {
  // const page = req.body.page || 1
  // const offset = (page - 1) * 10
  // return Books.all(offset)
  let random = []
  for (var i = 0; i < 10; i++) {
    let id = Math.floor(Math.random()*1000)
    random.push(Books.get(id))
  }
  Promise.all(random)
  .then( books => {
    console.log(books)
    res.render('index', { title: 'Express', books: books })
  })
});

router.get('/details/:id', function(req, res, next) {
  var id = req.params.id
  Books.get(id).then((book) => {
    res.render('details', { book: book })
  })
});

// router.post('/details', function(req, res, next) {
//
// })

module.exports = router;
