const paymentModel = require('../models/PaymentModel');

// Get all payments
async function getAllPayments(req, res) {
    try {
        const payments = await paymentModel.getAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
}

// Get payment by ID
async function getPaymentById(req, res) {
    const { id } = req.params;
    try {
        const payment = await paymentModel.getPaymentById(id);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment', error: error.message });
    }
}

// Create new payment
async function createPayment(req, res) {
    const { amount, method, participantId, eventId } = req.body;
    try {
        const result = await paymentModel.createPayment({ amount, method, participantId, eventId });
        res.status(201).json({ message: 'Payment created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment', error: error.message });
    }
}

// Update payment by ID
async function updatePaymentById(req, res) {
    const { id } = req.params;
    const { amount, method } = req.body;
    try {
        const result = await paymentModel.updatePaymentById(id, { amount, method });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Payment updated successfully' });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
}

// Delete payment by ID
async function deletePaymentById(req, res) {
    const { id } = req.params;
    try {
        const result = await paymentModel.deletePaymentById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Payment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
}

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePaymentById,
    deletePaymentById
};
