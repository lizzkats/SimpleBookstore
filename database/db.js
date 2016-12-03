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
const deleteBook = 'DELETE FROM books WHERE id = $1 RETURNING *'
const searchBooks = 'SELECT id FROM books WHERE LOWER(title) LIKE LOWER($1)'
const editBook = 'UPDATE books SET description = $2, image_url = $3, title = $4 WHERE id = $1 RETURNING *'

const Books = {
  get: (id) => db.one(getBook, [id])
              .then(oneBook => {
                const book = oneBook
                const bookId = book.id
                if(!bookId) {
                  return Promise.resolve(book)
                }
                return Promise.all([Authors.get(bookId), Genres.get(bookId), book])
                })
                .then(results => {
                  const authors = results[0]
                  const genres = results[1]
                  const bookInformation = results[2]
                    bookInformation.authors = authors.filter(author => author.book_id === bookInformation.id)
                    bookInformation.genres = genres.filter(genre => genre.book_id === bookInformation.id)
                  return bookInformation
              }),
  delete: (id) => db.one(deleteBook, [id]),
  add: (description, image_url, title) => db.one(addBook, [description, image_url, title]),
  edit: (id, description, image_url, title, authors, genres) => db.one(editBook, [id, description, image_url, title])
        .then(bookInformation => {
          const authorArray = []
          const genreArray = []
          if(!authors){ return Promise.resolve(authors)}
          if(!genres){ return Promise.resolve(genres)}
          if(authors.length === 1){ authors = [authors]}
          if(genres.length === 1){ genres = [genres]}
          authors.forEach(author => authorArray.push(Authors.add(id, author)))
          genres.forEach(genre => genreArray.push(Genres.add(id, genre)))
          Promise.all([authorArray, genreArray])
          .then(() => {
            const editedBook = {}
            editedBook.title = title
            return editedBook
          })
  }),
  search: (title) => db.any(searchBooks, [title])
}

const Authors = {
  add: (book_id, name) => db.any(addAuthors, [book_id, name]),
  get: (books) => db.any(getAuthors, [books]),
  delete: (book_id) => db.none(deleteAuthor, [book_id]),
  search: (name) => db.any(searchAuthors, [name])
}

const Genres = {
  add: (book_id, name) => db.none(addGenres, [book_id, name]),
  get: (books) => db.any(getGenres, [books]),
  delete: (book_id) => db.none(deleteGenre, [book_id]),
  search: (name) => db.any(searchGenres, [name])
}

module.exports = {Books, Authors, Genres};
