const express = require('express');
const cors = require('cors');
const shorturlsRouter = require('./routes/shorturls');

const app = express();
app.use(express.json());
app.use(cors());

// mount API routes
app.use('/', shorturlsRouter);

module.exports = app;
