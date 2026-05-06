const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const todoListSchema = new mongoose.Schema({
  label: { type: String, required: true },
  todos: [todoSchema],
  createdAt: { type: Date, default: Date.now }
});

const TodoList = mongoose.model('TodoList', todoListSchema);

module.exports = { TodoList };
