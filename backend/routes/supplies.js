const express = require('express');
const router = express.Router();
const suppliesController = require('../controller/suppliesController');

router.get('/', suppliesController.getAllSupplies);
router.get('/:id', suppliesController.getSupplyById);
router.post('/', suppliesController.createSupply);
router.put('/:id', suppliesController.updateSupplyById);
router.delete('/:id', suppliesController.deleteSupplyById);

module.exports = router;
