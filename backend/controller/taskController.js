const taskModel = require('../models/taskModel');

// Get all tasks
async function getAllTasks(req, res) {
    try {
        const tasks = await taskModel.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
}

// Get task by ID
async function getTaskById(req, res) {
    const { id } = req.params;
    try {
        const task = await taskModel.getTaskById(id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
}

// Create new task
async function createTask(req, res) {
    const { name, status, teamId } = req.body;
    try {
        const result = await taskModel.createTask({ name, status, teamId });
        res.status(201).json({ message: 'Task created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
}

// Update task by ID
async function updateTaskById(req, res) {
    const { id } = req.params;
    const { name, status, teamId } = req.body;
    try {
        const result = await taskModel.updateTaskById(id, { name, status, teamId });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Task updated successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
}

// Delete task by ID
async function deleteTaskById(req, res) {
    const { id } = req.params;
    try {
        const result = await taskModel.deleteTaskById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTaskById,
    deleteTaskById
};
