const express = require('express');
const todoRoutes = require('./routes/todo.routes');

const app = express();

app.use(express.json());

app.use('/todos', todoRoutes);

// app.listen(3000, () => {
//   console.log('Server is listening on port 3000.');
// });

module.exports = app;
