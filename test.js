const index = require('./index');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use('/', index);

test('index route works', done => {
    request(app)
    .get('/')
    .expect('Conten-Type', '/json/')
    .expect({ name: 'Blogs App'})
    .expect(200, done);
});

test('testing route works', done => {
    request(app)
    .get('/test')
    .type('form')
    .send({ item: "hello there!"})
    .then(() => {
        request(app)
        .get('/test')
        .expect({ array: ["Hello world"], done});
    });
});