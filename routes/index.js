const express = require('express');
const router = express.Router();
const Books = require('../database/db').Books

/* GET home page. */
router.get('/', function(req, res, next) {
  const page = req.body.page || 2
  const offset = (page - 1) * 10
  return Books.all(offset)
.then( books => {
  console.log(books)
  res.render('index', { title: 'Express', books: books })
})
});

router.post('/details', function(req, res, next) {

})

module.exports = router;
