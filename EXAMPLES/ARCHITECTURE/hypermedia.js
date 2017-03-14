const express = require('express');
const app = express();
const books = [{
        id: 1,
        title: 'ABC',
        author: 1,
      }, {
        id: 2,
        title: 'XYZ',
        author: 2,
      }];

const authors = [{
        id: 1,
        name: 'Foo',
        books: [2],
      }, {
        id: 2,
        name: 'Bar',
        books: [1],
      }, {
        id: 3,
        name: 'Foo Bar',
        books: [1, 2],
      }];

app.get('/authors', (req, res) => {
  res
    .links({
      next: '/authors?skip=10&take=10',
      prev: '/authors',
    })
    .send({
      uri: '/authors',
      next_uri: '/authors?skip=10&take=10',
      prev_uri: '/authors',
      authors: authors.map(x => ({
        uri: `/authors/${x.id}`,
        name: x.name,
        books_uri: x.books.map(x => `/books/${x}`),
      })),
    });
});

app.get('/authors/:id', (req, res) => {
  const x = authors.find(x => x.id == req.params.id);
  if(!x) return res.sendStatus(404);

  res
    .send({
      uri: `/authors/${req.params.id}`,
      author: {
        uri: `/authors/${x.id}`,
        name: x.name,
        books_uri: x.books.map(x => `/books/${x}`),
      },
    });
});

app.get('/books', (req, res) => {
  res
    .links({
      next: '/books?skip=10&take=10',
      prev: '/books',
    })
    .send({
      uri: '/books',
      next_uri: '/books?skip=10&take=10',
      prev_uri: '/books',
      books: books.map(x => ({
        uri: `/books/${x.id}`,
        title: x.title,
        author_uri: `/authors/${x.author}`,
      })),
    });
});

app.get('/books/:id', (req, res) => {
  const x = books.find(x => x.id == req.params.id);
  if(!x) return res.sendStatus(404);
  res
    .send({
      uri: `/books/${req.params.id}`,
      book: {
        uri: `/books/${x.id}`,
        title: x.title,
        author_uri: `/authors/${x.author}`,
      },
    });
});

app.listen(3000, () => console.log('Listen on 3000'));
