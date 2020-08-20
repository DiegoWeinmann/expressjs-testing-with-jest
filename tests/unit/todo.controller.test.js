const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../models/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/todos.json');
const todo = require('../mock-data/todo.json');

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();

let req, res, next;
const todoId = '5f3dbaa3c692132b0ed5b237';
let updateOptions;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

afterAll(() => {
  TodoModel.create.mockRestore();
  TodoModel.find.mockRestore();
  TodoModel.findById.mockRestore();
});

describe.only('TodoController.updateTodo', () => {
  beforeEach(() => {
    req.params.todoId = todoId;
    req.body = newTodo;
    updateOptions = {
      new: true,
      useFindAndModify: false,
    };
  });

  it('should have a updateTodo function.', () => {
    expect(typeof TodoController.updateTodo).toBe('function');
  });

  it('should update with TodoModel.findByIdAndUpdate.', async () => {
    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      todoId,
      newTodo,
      updateOptions
    );
  });

  it('should return a response with the json data and status code 200', async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it('should handle error.', async () => {
    const errorMessage = {
      message: 'error updating todo.',
    };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await TodoController.updateTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('TodoController.getTodoById', () => {
  beforeEach(() => {
    req.params.todoId = todoId;
  });

  it('should have a getTodoById function', () => {
    expect(typeof TodoController.getTodoById).toBe('function');
  });

  it('should call TodoModel.findById with route param id', async () => {
    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toHaveBeenCalledWith(req.params.todoId);
  });

  it('should return json body and response code 200', async () => {
    TodoModel.findById.mockReturnValue(todo);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(todo);
  });

  it('should handle error.', async () => {
    const errorMessage = {
      message: 'Error finding todo',
    };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);
    await TodoController.getTodoById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it('should return 404 when todo does not exist.', async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe('TodoController.getTodos', () => {
  it('should have a getTodos function', () => {
    expect(typeof TodoController.getTodos).toBe('function');
  });

  it('should call TodoModel.find({})', async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });

  it('should return response with status 200 and all the todos', async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });

  it('should handle errors in getTodos', async () => {
    const errorMessage = {
      message: 'Error finding todos.',
    };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getTodos(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('TodoController.createTodo', () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it('should have a create todo function', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });

  it('should call TodoModel.create', () => {
    TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalled();
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it('should return 201 status code.', async () => {
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return json body in the response.', async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it('should handle errors in createTodo.', async () => {
    const errorMessage = {
      message: 'Done property missing.',
    };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
