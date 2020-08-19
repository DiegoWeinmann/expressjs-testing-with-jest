const TodoModel = require('../models/todo.model');

exports.createTodo = async (req, res, next) => {
  try {
    const todo = await TodoModel.create(req.body);
    return res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

exports.getTodos = async (req, res, next) => {
  const todos = await TodoModel.find({});
  res.json(todos);
};
