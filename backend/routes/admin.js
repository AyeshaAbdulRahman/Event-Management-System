const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.get('/email/:email', adminController.getAdminByEmail);
router.post('/', adminController.createAdmin);
router.put('/:id', adminController.updateAdminById);
router.delete('/:id', adminController.deleteAdminById);
module.exports = router;
