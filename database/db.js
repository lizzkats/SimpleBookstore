const dbName = 'books_for_freedom'
const pgp = require('pg-promise')()
const connectionString = `postgres://${process.env.USER}@localhost:5432/${dbName}`
const db = pgp(connectionString)

const getAllBooks = 'SELECT * FROM books LIMIT 10 OFFSET $1'

const getBook = 'SELECT * FROM books WHERE id = $1'
const getAuthors = 'SELECT authors.*, book_id FROM authors JOIN book_authors ON id = author_id WHERE book_id IN ($1:csv)'
const getGenres = 'SELECT genres.*, book_id FROM genres JOIN book_genres ON id = genre_id WHERE book_id IN ($1:csv)'
const Books = {
  all: (offset) => db.any(getAllBooks, [offset])
                  .then(books => {
                    const bookList = books
                    const bookIds = books.map(book => book.id)
                    if(bookIds.length === 0){
                      return Promise.resolve(books)
                    }
                    Promise.all([Authors.get(bookIds), Genres.get(bookIds), bookList])
                    .then(results => {
                      const authors = results[0]
                      const genres = results[1]
                      const books = results[2]
                      books.forEach(book => {
                        book.authors = authors.filter(author => author.book_id === book.id)
                        book.genres = genres.filter(genre => genre.book_id === book.id)
                      })
                      return books
                    })
                  }),
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
