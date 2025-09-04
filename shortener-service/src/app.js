const express = require('express');
const shorturlsRouter = require('./routes/shorturls');

const app = express();
app.use(express.json());

// mount API routes
app.use('/', shorturlsRouter);

module.exports = app;
