const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { TodoList } = require('./models');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// 1. Create a todo list with a label
app.post('/lists', async (req, res) => {
  try {
    const { label } = req.body;
    if (!label) {
      return res.status(400).json({ error: 'Label is required' });
    }
    
    const newList = new TodoList({ label });
    const savedList = await newList.save();
    
    res.status(201).json(savedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add a todo to a specific todo list
app.post('/lists/:id/todos', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required for a todo item' });
    }

    const list = await TodoList.findById(id);
    if (!list) {
      return res.status(404).json({ error: 'Todo list not found' });
    }

    list.todos.push({ text });
    const updatedList = await list.save();

    res.status(201).json(updatedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. List all todo lists
app.get('/lists', async (req, res) => {
  try {
    const lists = await TodoList.find();
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get a specific todo list (zoom in on the todos)
app.get('/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const list = await TodoList.findById(id);
    
    if (!list) {
      return res.status(404).json({ error: 'Todo list not found' });
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Update a todo's completion status
app.patch('/lists/:id/todos/:todoId', async (req, res) => {
  try {
    const { id, todoId } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed status must be a boolean' });
    }

    const list = await TodoList.findById(id);
    if (!list) {
      return res.status(404).json({ error: 'Todo list not found' });
    }

    const todo = list.todos.id(todoId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo item not found' });
    }

    todo.completed = completed;
    const updatedList = await list.save();

    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
