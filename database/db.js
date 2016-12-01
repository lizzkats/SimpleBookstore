const dbName = 'books_for_freedom'
const pgp = require('pg-promise')()
const connectionString = `postgres://${process.env.USER}@localhost:5432/${dbName}`
const db = pgp(connectionString)

const getAllBooks = 'SELECT * FROM books LIMIT 10 OFFSET $1'

const getBook = 'SELECT * FROM books WHERE id = $1'
const getAuthors = 'SELECT authors.*, book_id FROM authors JOIN book_authors ON id = author_id WHERE book_id IN ($1:csv)'
const getGenres = 'SELECT genres.*, book_id FROM genres JOIN book_genres ON id = genre_id WHERE book_id IN ($1:csv)'
const addBook = 'INSERT INTO books(id, description, image_url, title) VALUES(DEFAULT, $1, $2, $3) RETURNING id'
const addAuthors = 'INSERT INTO authors(id, name) VALUES(DEFAULT, $2) RETURNING * ; INSERT INTO book_authors(book_id, author_id) SELECT books.id, authors.id FROM books JOIN authors ON authors.name = $2 WHERE books.id = $1 RETURNING *'
const addGenres = 'INSERT INTO genres(id, name) VALUES(DEFAULT, $2); INSERT INTO book_genres(book_id, genre_id) SELECT books.id, genres.id FROM books JOIN genres ON genres.name = $2 WHERE books.id = $1'

const Books = {
  get: (id) => db.one(getBook, [id]),
  delete: (id) => db.one(deleteBook, [id]),
  add: (description, image_url, title) => db.one(addBook, [description, image_url, title]),
  edit: (id, description, image_url, title) => db.one(editBook, [id, description, image_url, title]),
  search: (title) => db.any(searchBooks, [title])
}

const Authors = {
  add: (book_id, name) => db.any(addAuthors, [book_id, name]),
  get: (books) => db.any(getAuthors, [books]),
  delete: (book_id) => db.none(deleteAuthor, [book_id]),
  edit: (book_id) => db.one(editAuthor, [book_id]),
  search: (name) => db.any(searchAuthors, [name])
}

const Genres = {
  add: (book_id, name) => db.none(addGenres, [book_id, name]),
  get: (books) => db.any(getGenres, [books]),
  delete: (book_id) => db.none(deleteGenre, [book_id]),
  edit: (book_id) => db.one(editGenre, [book_id]),
  search: (name) => db.any(searchGenres, [name])
}

module.exports = {Books, Authors, Genres};
