const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(cors());
app.use(express.static('frontend'));
app.use(express.json());

let tasks = [];
let taskId = 1; // Initialize the task ID counter

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const newTask = { id: taskId, ...req.body }; // Assign ID to the new task
  console.log(newTask);
  tasks.push(newTask);
  console.log(tasks);
  taskId++; // Increment the task ID for the next task
  res.status(201).json(newTask);
});

// Get a single task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    res.json(task);
  }
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    res.status(404).send('Task not found');
  } else {
    tasks[taskIndex] = { id: taskId, ...req.body };
    res.json(tasks[taskIndex]);
  }
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    res.status(404).send('Task not found');
  } else {
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json(deletedTask);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
