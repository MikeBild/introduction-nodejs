const todoList = [{ id: 1, description: 'todo1' }];
const EventEmitter = require('events');
const eventemitter1 = new EventEmitter();

// let count = 0;
// setInterval(() => {
//   eventemitter1.emit('changed', { count: count++ });
// }, 1000);

module.exports = (req, res, next) => {
  req.baseUrl = process.env.BASEURL;
  req.todoDBBaseUrl =
    process.env.TODO_DB_BASE_URL || 'http://34.247.50.10/todos';
  req.eventemitter = eventemitter1;
  req.todoList = todoList;
  console.log(`${new Date()}: ${req.method}`);
  next();
};
