const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/todo-tdd', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected To MongoDb.');
  } catch (err) {
    console.log(err);
  }
}

module.exports = connect;
