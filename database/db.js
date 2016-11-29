const dbName = 'books_for_freedom'
const pgp = require('pg-promise')()
const connectionString = `postgres://${process.env.USER}@localhost:5432/${dbName}`
const db = pgp(connectionString)

const getAllBooks = 'SELECT * FROM books LIMIT 10 OFFSET $1'

const Books = {
  all: (offset) => db.any(getAllBooks, [offset])
}

module.exports = {Books};
