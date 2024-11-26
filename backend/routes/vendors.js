const express = require('express');
const router = express.Router();
const vendorsController = require('../controller/vendorsController');

router.get('/', vendorsController.getAllVendors);
router.get('/:id', vendorsController.getVendorById);
router.post('/', vendorsController.createVendor);
router.put('/:id', vendorsController.updateVendorById);
router.delete('/:id', vendorsController.deleteVendorById);

module.exports = router;
