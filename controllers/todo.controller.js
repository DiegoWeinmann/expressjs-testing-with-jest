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
  try {
    const todos = await TodoModel.find({});
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const todo = await TodoModel.findById(req.params.todoId);

    if (!todo) {
      return res.status(404).json(null);
    }

    return res.json(todo);
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      req.params.todoId,
      req.body,
      {
        new: true,
        useFindAndModify: false,
      }
    );

    if (!updatedTodo) {
      return res.status(404).json(null);
    }

    return res.status(200).json(updatedTodo);
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.todoId);

    if (!deletedTodo) {
      return res.status(404).json(null);
    }

    return res.status(200).json(null);
  } catch (err) {
    next(err);
  }
};
