// routes/payments.js
const express = require('express');
const router = express.Router();
const { getAllPaymentsController, createPaymentController, updatePaymentController, deletePaymentController } = require('../controller/paymentController');

// Routes for payments
router.get('/', getAllPaymentsController);  // Get all payments
router.post('/', createPaymentController);  // Create a new payment
router.put('/:paymentId', updatePaymentController);  // Update payment by ID
router.delete('/:paymentId', deletePaymentController);  // Delete payment by ID

module.exports = router;
