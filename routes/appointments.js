const express = require('express');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Client = require('../models/Client');
const User = require('../models/User');
const router = express.Router();

// Book an appointment (dentist or nurse)
router.post('/', auth, async (req, res) => {
  try {
    const { clientName, clientPhone, dentistBadge, date, time, notes } = req.body;
    // Find or create client
    let client = await Client.findOne({ phone: clientPhone });
    if (!client) {
      client = new Client({ name: clientName, phone: clientPhone });
      await client.save();
    }
    // Find dentist by badge
    const dentist = await User.findOne({ badge: dentistBadge, role: 'dentist' });
    if (!dentist) return res.status(400).json({ msg: 'Dentist not found' });

    const appointment = new Appointment({
      client: client._id,
      dentist: dentist._id,
      date: new Date(date),
      time,
      notes
    });
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get appointments (nurse sees all, dentist sees only theirs)
router.get('/', auth, async (req, res) => {
  try {
    let appointments = await Appointment.find().populate('client dentist');
    if (req.user.role === 'dentist') {
      appointments = appointments.filter(apt => apt.dentist._id.toString() === req.user.id);
    }
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
