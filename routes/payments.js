const express = require('express');
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Record a payment (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    const { appointmentId, amount, method } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    const payment = new Payment({ appointment: appointmentId, amount, method });
    await payment.save();
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all payments (for reports)
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find().populate('appointment');
    res.json(payments);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
