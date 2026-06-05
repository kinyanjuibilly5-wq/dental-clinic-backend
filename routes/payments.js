const express = require('express');
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { appointmentId, amount, method } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
    const payment = await Payment.create({ appointmentId, amount, method, date: new Date().toISOString() });
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/', auth, async (req, res) => {
  const payments = await Payment.find();
  res.json(payments);
});

module.exports = router;
