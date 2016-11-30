const dbName = 'books_for_freedom'
const pgp = require('pg-promise')()
const connectionString = `postgres://${process.env.USER}@localhost:5432/${dbName}`
const db = pgp(connectionString)

const getAllBooks = 'SELECT * FROM books LIMIT 10 OFFSET $1'

const getBook = 'SELECT * FROM books WHERE id = $1'

const Books = {
  all: (offset) => db.any(getAllBooks, [offset])
                  .then(),
  get: (id) => db.one(getBook, [id]),
  delete: (id) => db.one(deleteBook, [id]),
  add: (description, image_url, title) => db.one(addBook, [description, image_url, title]),
  edit: (id, description, image_url, title) => db.one(editBook, [id, description, image_url, title]),
  search: (title) => db.any(searchBooks, [title])
}

const Authors = {
  get: (books) => db.any(getAuthors, [books]),
  delete: (book_id) => db.none(deleteAuthor, [book_id]),
  edit: (book_id) => db.one(editAuthor, [book_id]),
  search: (name) => db.any(searchAuthors, [name])
}

const Genres = {
  get: (books) => db.any(getGenres, [books]),
  delete: (book_id) => db.none(deleteGenre, [book_id]),
  edit: (book_id) => db.one(editGenre, [book_id]),
  search: (name) => db.any(searchGenres, [name])
}

module.exports = {Books, Authors, Genres};
