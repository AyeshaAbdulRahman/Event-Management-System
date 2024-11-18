const { getAllPayments, createPayment, updatePayment, deletePayment } = require('../models/PaymentModel'); // Importing model functions

// Controller for getting all payments
async function getAllPaymentsController(req, res) {
    try {
        const payments = await getAllPayments();
        res.json(payments);  // Sending the retrieved payments as JSON response
    } catch (err) {
        res.status(500).send("Error getting payments");
    }
}

// Controller for creating a new payment
async function createPaymentController(req, res) {
    try {
        const payment = await createPayment(req.body);  // Pass the payment data from the request body
        res.status(201).json(payment);  // Respond with the created payment
    } catch (err) {
        res.status(500).send("Error creating payment");
    }
}

// Controller for updating a payment by ID
async function updatePaymentController(req, res) {
    try {
        const payment = await updatePayment(req.params.paymentId, req.body);  // Update payment with provided ID and data
        res.json(payment);  // Respond with the updated payment
    } catch (err) {
        res.status(500).send("Error updating payment");
    }
}

// Controller for deleting a payment by ID
async function deletePaymentController(req, res) {
    try {
        await deletePayment(req.params.paymentId);  // Delete payment by provided ID
        res.status(204).send();  // Respond with no content (204) status on successful deletion
    } catch (err) {
        res.status(500).send("Error deleting payment");
    }
}

module.exports = { getAllPaymentsController, createPaymentController, updatePaymentController, deletePaymentController };
