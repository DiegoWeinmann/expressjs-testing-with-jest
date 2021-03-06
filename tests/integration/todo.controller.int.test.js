const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');
const todo = require('../mock-data/todo.json');

const endpointUrl = '/todos/';
let firstTodo, newTodoId;

describe(endpointUrl, () => {
  it('POST ' + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
  });

  it('GET ' + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });

  it('GET by id ' + endpointUrl + ':todoId', async () => {
    const response = await request(app).get(`${endpointUrl}${firstTodo._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  it('GET by id ' + endpointUrl + ':todoId not found.', async () => {
    const response = await request(app).get(
      endpointUrl + '5f13695a7dc86f2607c20d8f'
    );
    expect(response.statusCode).toBe(404);
  });

  it('DELETE ' + endpointUrl + ':todoId', async () => {
    const response = await request(app).delete(
      `${endpointUrl}${firstTodo._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(null);
  });

  it('DELETE ' + endpointUrl + ':todoId not found.', async () => {
    const response = await request(app).delete(
      endpointUrl + '5f13695a7dc86f2607c20d8f'
    );
    expect(response.statusCode).toBe(404);
    expect(response.body).toBe(null);
  });

  it('PUT ' + endpointUrl + ':todoId', async () => {
    const response = await request(app)
      .put(`${endpointUrl}${newTodoId}`)
      .send(todo);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(todo.title);
    expect(response.body.done).toBe(todo.done);
  });

  it(
    'should return error 500 on malformed data with POST ' + endpointUrl,
    async () => {
      const response = await request(app).post(endpointUrl).send({
        title: 'missing done prop',
      });
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: 'Todo validation failed: done: Path `done` is required.',
      });
    }
  );
});
