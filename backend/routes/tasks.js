// routes/tasks.js
const express = require('express');
const router = express.Router();
const { getAllTasksController, createTaskController, updateTaskController, deleteTaskController } = require('../controller/taskController');

// Routes for tasks
router.get('/', getAllTasksController);  // Get all tasks
router.post('/', createTaskController);  // Create a new task
router.put('/:taskId', updateTaskController);  // Update task by ID
router.delete('/:taskId', deleteTaskController);  // Delete task by ID

module.exports = router;
