const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router;

//get-all-users fix in all 