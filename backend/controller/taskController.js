// controllers/tasksController.js
const { getAllTasks, createTask, updateTask, deleteTask } = require('../models/taskModel');

// Get all tasks
async function getAllTasksController(req, res) {
    try {
        const tasks = await getAllTasks();
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error in getAllTasksController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Create a new task
async function createTaskController(req, res) {
    const { Task_id, Task_Name, Assigned_To } = req.body;
    const task = { Task_id, Task_Name, Assigned_To };

    try {
        await createTask(task);
        res.status(201).send('Task created successfully');
    } catch (err) {
        console.error('Error in createTaskController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Update task by ID
async function updateTaskController(req, res) {
    const { taskId } = req.params;
    const { Task_Name, Assigned_To } = req.body;
    const task = { Task_Name, Assigned_To };

    try {
        await updateTask(taskId, task);
        res.status(200).send('Task updated successfully');
    } catch (err) {
        console.error('Error in updateTaskController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Delete task by ID
async function deleteTaskController(req, res) {
    const { taskId } = req.params;

    try {
        await deleteTask(taskId);
        res.status(200).send('Task deleted successfully');
    } catch (err) {
        console.error('Error in deleteTaskController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getAllTasksController, createTaskController, updateTaskController, deleteTaskController };
