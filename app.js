const express = require('express');
const connect = require('./db/mongodb');
const todoRoutes = require('./routes/todo.routes');

connect();

const app = express();

app.use(express.json());

app.use('/todos', todoRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message,
  });
});

module.exports = app;
